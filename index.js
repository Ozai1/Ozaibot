console.log('Stwarting Ozwaibot!!!');
const fs = require('fs');
const { unix } = require('moment');
const { Player } = require('discord-player');
const Discord = require('discord.js');
const moment = require('moment');

const synchronizeSlashCommands = require('discord-sync-commands-v14');
const { Main_INIT } = require('./INIT')
const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

const client = new Discord.Client({
      intents: 98047/* doesnt include status intents*/, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone',
});

client.musicConfig = require('./musicconfig');
client.player = new Player(client, client.musicConfig.opt.discordPlayer);
const player = client.player;
client.commands = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler', 'slashcommand_handler'].forEach(handler => {
      require(`./handlers/${handler}`)(client, Discord);
});

client.on('ready', async () => {
      // setInterval(async () => {
      //       util.status('112.213.34.137').then(async (response) => {
      //             let onlineplayers = []
      //             if (!response.players.sample) {
      //                   onlineplayers[0] = 'No one :('
      //             } else {
      //                   response.players.sample.forEach(player => {
      //                         onlineplayers.push(`${player.name}`)
      //                   })
      //             }
      //             onlineplayers = onlineplayers.toString()
      //             onlineplayers = onlineplayers.replace(/,/g, '\n')
      //             const embed77 = new Discord.MessageEmbed()
      //                   .setTitle('MC Server Status')
      //                   .setColor('BLUE')
      //                   .setDescription(`**Currently ${response.players.online} players online:**\n${onlineplayers}`)
      //                   .setFooter({ text: "Server IP: vps01.tsict.com.au, version 1.18.2; Embed refreshes ever 2 mins" })
      //             const statuschannel = client.channels.cache.get('984030657078513714')
      //             const messagetoedit = await statuschannel.messages.fetch('984043956008550430')
      //             messagetoedit.edit({ embeds: [embed77] })
      //       }).catch(async err => {
      //             const embed77 = new Discord.MessageEmbed()
      //                   .setTitle('MC Server Status')
      //                   .setColor('RED')
      //                   .setDescription(`Server down.`)
      //                   .setFooter({ text: `Server IP: 112.213.34.137; Embed refreshes ever 2 mins.` })
      //             const statuschannel = client.channels.cache.get('984030657078513714')
      //             const messagetoedit = await statuschannel.messages.fetch('984043956008550430')
      //             messagetoedit.edit({ embeds: [embed77] })
      //             console.log(err)
      //       })
      // }, 120000);

      console.log(`Signed into ${client.user.tag}`);
      fs.readdir("./slashcommands/", (_err, files) => {
            synchronizeSlashCommands(client, client.slashcommands.map((c) => ({
                  name: c.name,
                  description: c.description,
                  options: c.options,
                  type: 'CHAT_INPUT'
            })), {
                  debug: false
            });
      })
      let rating = Math.floor(Math.random() * 2) + 1;
      if (rating == 1) {
            client.user.setPresence({ status: 'dnd' });
      }
      let query = "SET GLOBAL max_connections = 512";
      let data = [];
      connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error);
      });
      query = "DELETE FROM activeinvites";
      data = [];
      connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error);
      });
      client.guilds.cache.forEach(async guild => {
            if (guild.me.permissions.has('MANAGE_GUILD')) {
                  const newinvites = await guild.invites.fetch();
                  newinvites.forEach(async invite => {
                        query = `INSERT INTO activeinvites (serverid, inviterid, invitecode, uses) VALUES (?, ?, ?, ?)`;
                        data = [guild.id, invite.inviter.id, invite.code, invite.uses];
                        connection.query(query, data, function (error, results, fields) {
                              if (error) return console.log(error);
                        })
                  })
            } guild.members.fetch();
      })
      setInterval(() => { // 2 second interval, being used for mute checking
            let query = `SELECT * FROM activebans WHERE timeunban < ?`;
            let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results !== ``) {
                        for (row of results) {
                              query = "DELETE FROM activebans WHERE id = ?";
                              data = [row["id"]]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                              })
                              var serverid = row["serverid"];
                              var userid = row["userid"];
                              const guild = client.guilds.cache.get(serverid);
                              let member = guild.members.cache.get(userid);
                              if (!member) { member = searchmember(userid, guild) }
                              if (!guild) return console.log(`Attempted to unmute ${userid} in guild ${serverid} but the server was not found`)
                              if (!member) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the user was not found in the server`)
                              query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                              data = ['muterole', guild.id]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                                    if (results == ``) {
                                          return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found in db.`)
                                    }
                                    for (row of results) {
                                          let muteroleid = row["details"];
                                          const muterole = guild.roles.cache.get(muteroleid)
                                          if (!muterole) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found.`)
                                          if (guild.me.roles.highest.position <= muterole.position) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was higher in perms than me.`)
                                          if (!guild.me.permissions.has('MANAGE_ROLES')) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the i no longer have manage roles.`)
                                          member.roles.remove(muterole).catch(err => { console.log(err) })
                                          console.log(`unmuted ${userid} in ${guild}(${guild.id})`)
                                    }
                              })
                        }
                  }
            })
            query = `SELECT * FROM reminders WHERE time < ?`;
            data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results !== ``) {
                        for (row of results) {
                              query = "DELETE FROM reminders WHERE id = ?";
                              data = [row["id"]]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                              })
                              var channelid = row["channelid"];
                              var userid = row["userid"];
                              let text = row["text"];
                              const channel = client.channels.cache.get(channelid);
                              let member = channel.guild.members.cache.get(userid);
                              if (!member) { member = searchmember(userid, channel.guild) }
                              if (!member) { return console.log('failed to spit reminder because member could not be found') }
                              channel.send(text).catch(err => console.log(err));
                        }
                  }
            })
      }, 2000);
      setInterval(() => { // 1 min interval, being used for blacklisted invites checking
            let query = `SELECT * FROM lockdownlinks WHERE timeremove < ?`;
            let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results !== ``) {
                        for (row of results) {
                              query = "DELETE FROM lockdownlinks WHERE id = ?";
                              data = [row["id"]]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                              })
                              var serverid = row["serverid"];
                              var invitecode = row["invitecode"];
                              const guild = client.guilds.cache.get(serverid);
                              if (!guild) { guild = 'unknownguild' }
                              return console.log(`Blacklist on invite ${invitecode} has expired for guild ${guild}(${serverid})`)
                        }
                  }
            })
      }, 60000);
      await Main_INIT(client)
      let alllogs = client.channels.cache.get('986882651921190932');
      alllogs.send(`Bot started up <@!508847949413875712>`);
      console.log(`Finished caching and updating`);
});

client.on('guildMemberUpdate', async (oldmember, newmember) => {
      if (newmember.guild.id == '806532573042966528') {
            if (!newmember.roles.cache.has('922514880102277161') && oldmember.roles.cache.has('922514880102277161')) {
                  let katcordgen = client.channels.cache.get('806532573042966530');
                  if (!katcordgen) return console.log('kat cord general not found');
                  const webhookclient = await katcordgen.createWebhook('Welcome to rainy day kat-fé!', {
                        avatar: 'https://cdn.discordapp.com/attachments/868363455105732609/952954742160650300/unknown.png',
                  })
                  const welcomeembed = new Discord.MessageEmbed()
                        .setTitle('We are glad to have you here!')
                        .addField('Important Information:', '\n\nCheck out this link to vote for our server!\nhttps://top.gg/servers/806532573042966528\n\nCheck out <#906751907597525062> and <#850549971081625640> to get started.')
                        .setFooter({ text: 'We hope you enjoy your time here!' })
                  await webhookclient.send({ content: `Hey <@${newmember.id}>! Welcome. <@&933185109094465547>`, embeds: [welcomeembed] });
                  console.log('welcome message sent');
                  await webhookclient.delete();
            }
      }
});

client.on('messageUpdate', async (oldMessage, newMessage) => { // Old message may be undefined
      return
      if (!oldMessage.author) return;
      const MessageLog = client.channels.cache.find(channel => channel.id === '802262886624919572');
      var embed = new Discord.MessageEmbed()
            .setAuthor(newMessage.author.username)
            .setTimestamp()
            .setColor('#392B47')
            .addFields(
                  { name: 'original:', value: oldMessage },
                  { name: 'edit:', value: newMessage });
      MessageLog.send(embed);
});

client.on('messageReactionAdd', async (react, author) => {
      if (react.message.id == '942754717484863508') {
            let member = react.message.guild.members.cache.get(author.id);
            if (react.emoji.name === 'p_pink01_nf2u') { // she/her 942758515368407050
                  let prorole = react.message.guild.roles.cache.get('942758515368407050');
                  member.roles.add(prorole).catch(err => { console.log(err) });
                  author.send('Gave you the she/her role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/him 942758528299438100
                  let prorole = react.message.guild.roles.cache.get('942758528299438100');
                  member.roles.add(prorole).catch(err => { console.log(err) });
                  author.send('Gave you the he/him role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink03_nf2u') { // they/them 942758559547019284
                  let prorole = react.message.guild.roles.cache.get('942758559547019284');
                  member.roles.add(prorole).catch(err => { console.log(err) });
                  author.send('Gave you the they/them role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink04_nf2u') { // she/they 942758579574829106
                  let prorole = react.message.guild.roles.cache.get('942758579574829106');
                  member.roles.add(prorole).catch(err => { console.log(err) });
                  author.send('Gave you the she/they role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/they 942758598533083157
                  let prorole = react.message.guild.roles.cache.get('942758598533083157');
                  member.roles.add(prorole).catch(err => { console.log(err) });
                  author.send('Gave you the he/they role.').catch(err => { console.log('could not message user to conf adding role') });
            } else {
                  react.remove().catch(err => { console.log(err) });
            }
      } if (react.message.id == '959716895672659998') {
            let member = react.message.guild.members.cache.get(author.id);
            if (react.emoji.name === '✅') {
                  let verrole = react.message.guild.roles.cache.get('959715895708635136');
                  member.roles.remove(verrole).catch(err => { console.log(err) });
                  const verchannel = client.channels.cache.get('959715867963297832');
                  const vermessage = await verchannel.messages.fetch('959716895672659998');
                  vermessage.reactions.resolve("✅").users.remove(member.id);
                  console.log(`Verified ${member.user.tag} (${member.id}) in javi cord`);
            } else {
                  react.remove();
            }
      }
});

client.on('messageReactionRemove', async (react, author) => {
      if (react.message.id == '942754717484863508') {
            let member = react.message.guild.members.cache.get(author.id)
            if (react.emoji.name === 'p_pink01_nf2u') { // she/her 942758515368407050
                  let prorole = react.message.guild.roles.cache.get('942758515368407050');
                  member.roles.remove(prorole).catch(err => { console.log(err) });
                  author.send('Took away the she/her role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/him 942758528299438100
                  let prorole = react.message.guild.roles.cache.get('942758528299438100');
                  member.roles.remove(prorole).catch(err => { console.log(err) });
                  author.send('Took away the he/him role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink03_nf2u') { // they/them 942758559547019284
                  let prorole = react.message.guild.roles.cache.get('942758559547019284');
                  member.roles.remove(prorole).catch(err => { console.log(err) });
                  author.send('Took away the they/them role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink04_nf2u') { // she/they 942758579574829106
                  let prorole = react.message.guild.roles.cache.get('942758579574829106');
                  member.roles.remove(prorole).catch(err => { console.log(err) });
                  author.send('Took away the she/they role.').catch(err => { console.log('could not message user to conf adding role') });
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/they 942758598533083157
                  let prorole = react.message.guild.roles.cache.get('942758598533083157');
                  member.roles.remove(prorole).catch(err => { console.log(err) });
                  author.send('Took away the he/they role.').catch(err => { console.log('could not message user to conf adding role') });
            }
      }
});

client.on("voiceStateUpdate", async (oldstate, newstate) => {
      return
      if (oldstate.member.user.bot) return;
      let oldmember = oldstate.member
      let newmember = newstate.member
      if (oldmember.voice.channelId !== null) { // USER JOINED CHANNEL

            if (!newmember.voice === oldmember.voice) {
                  console.log(`${oldmember.user.tag} joined a voice channel`)
                  if (newmember.voice.channelId == '964544014584016956') {
                        newmember.voice.setChannel(null)
                  }
            }

      }
      if (!newmember.voice.channel) { // USER LEFT CHANNEL
            console.log(`${oldmember.user.tag} left a voice channel`)
      }

      //console.log(`${oldmember.user.tag} changed voice channel state`)

});

client.login(process.env.DISCORD_TOKEN);

player.on('trackStart', (queue, track) => {
      if (!client.musicConfig.opt.loopMessage && queue.repeatMode !== 0) return;
      queue.metadata.send({ content: `**Playing** :notes: \`${track.title}\` - Now!` }).catch(e => { });
});

player.on('trackAdd', (queue, track) => {
      queue.metadata.send({ content: `\`${track.title}\` **added to playlist.** ✅` }).catch(e => { });
});

player.on('tracksAdd', (queue) => {
      queue.metadata.send({ content: `**Added playlist.** ✅` }).catch(e => { });
});

player.on('queueEnd', (queue) => {
      if (client.musicConfig.opt.voiceConfig.leaveOnTimer.status === true) {
            setTimeout(() => {
                  if (queue.connection) queue.connection.disconnect();
                  queue.metadata.send('Disconnected due to inactivity.')
            }, client.musicConfig.opt.voiceConfig.leaveOnTimer.time);
      }
      queue.metadata.send({ content: 'Queue finished!' }).catch(e => { });
});

player.on('botDisconnect', (queue) => {
      queue.metadata.send('Bot has been disconnected.');
      queue.destroy();
});

player.on('connectionError', async (queue, error) => {
      console.log(error)
});

player.on('error', async (queue, error) => {
      console.log(error)
});