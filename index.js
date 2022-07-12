console.log('Stwarting Ozwaibot!!!');
const fs = require('fs');
const { unix } = require('moment');
const { Player } = require('discord-player');
const Discord = require('discord.js');

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
      console.log(`Signed into ${client.user.tag}`);
      fs.readdir("./slashcommands/", (_err, files) => {
            synchronizeSlashCommands(client, client.slashcommands.map((command) => ({
                  name: command.name,
                  description: command.description,
                  options: command.options,
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
            guild.members.fetch();
            if (guild.me.permissions.has('MANAGE_GUILD')) {
                  const newinvites = await guild.invites.fetch();
                  newinvites.forEach(async invite => {
                        query = `INSERT INTO activeinvites (serverid, inviterid, invitecode, uses) VALUES (?, ?, ?, ?)`;
                        data = [guild.id, invite.inviter.id, invite.code, invite.uses];
                        connection.query(query, data, function (error, results, fields) {
                              if (error) return console.log(error);
                        })
                  })
            }
      })
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
                              let guild = client.guilds.cache.get(serverid);
                              if (!guild) { guild = 'unknownguild' }
                              return console.log(`Blacklist on invite ${invitecode} has expired for guild ${guild}(${serverid})`)
                        }
                  }
            })
      }, 60000);
      Main_INIT(client, Discord)
      let alllogs = client.channels.cache.get('986882651921190932');
      alllogs.send(`Bot started up <@!508847949413875712>`);
      console.log(`Finished caching and updating`);
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

client.on("voiceStateUpdate", async (oldstate, newstate) => {
      if (oldstate.member.user.bot) return;
      if (newstate.channelId === null) return //console.log(`${oldstate.member.user.tag} left a channel`)
      if (oldstate.channelId === null) {
            if (client.lockedvoicechannels.includes(newstate.channelId)) {
                  newstate.member.voice.setChannel(null, 'Channel has been locked by command. Kicking from VC. To unlock channel, use `lockvc [channel]`').catch(err => { console.log(err) })
            }
            return //console.log(`${oldstate.member.user.tag} joined a channel`)
      }
      if (oldstate.channelId !== newstate.channelId) {
            if (client.lockedvoicechannels.includes(newstate.channelId)) {
                  newstate.member.voice.setChannel(null, 'Channel has been locked by command. Kicking from VC. To unlock channel, use `lockvc [channel]`').catch(err => { console.log(err) })
            }
            return //console.log(`${oldstate.member.user.tag} moved channels`)
      }
      if (oldstate.selfDeaf && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} un-deafened`)
      if (oldstate.selfMute && !newstate.selfMute && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} un-muted`)
      if (!oldstate.selfMute && newstate.selfMute && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} muted`)
      if (!oldstate.selfdeaf && newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} deafened`)
      if (oldstate.selfVideo && !newstate.selfVideo) return// console.log(`${oldstate.member.user.tag} stopped videoing`)
      if (!oldstate.selfVideo && newstate.selfVideo) return// console.log(`${oldstate.member.user.tag} started videoing`)
      if (oldstate.streaming && !newstate.streaming) return //console.log(`${oldstate.member.user.tag} stopped streaming`)
      if (!oldstate.streaming && newstate.streaming) return //console.log(`${oldstate.member.user.tag} started streaming`)
      if (oldstate.serverDeaf && !newstate.serverDeaf) return// console.log(`${oldstate.member.user.tag} was un-force-deafened`)
      if (!oldstate.serverDeaf && newstate.serverDeaf) return //console.log(`${oldstate.member.user.tag} was force-deafened`)
      if (oldstate.serverMute && !newstate.serverMute) return //console.log(`${oldstate.member.user.tag} was un-force-muted`)
      if (!oldstate.serverMute && newstate.serverMute) return //console.log(`${oldstate.member.user.tag} was force-muted`)
});

client.login(process.env.DISCORD_TOKEN);

player.on('trackStart', (queue, track) => {
      if (!client.musicConfig.opt.loopMessage && queue.repeatMode !== 0) return;
      queue.metadata.send({ content: `**Playing** :notes: \`${track.title}\` - Now!` }).catch(err => { });
});

player.on('trackAdd', (queue, track) => {
      queue.metadata.send({ content: `\`${track.title}\` **added to playlist.** ✅` }).catch(err => { });
});

player.on('tracksAdd', (queue) => {
      queue.metadata.send({ content: `**Added playlist.** ✅` }).catch(err => { });
});

player.on('queueEnd', (queue) => {
      if (client.musicConfig.opt.voiceConfig.leaveOnTimer.status === true) {
            setTimeout(() => {
                  if (queue.connection) queue.connection.disconnect();
                  queue.metadata.send('Disconnected due to inactivity.')
            }, client.musicConfig.opt.voiceConfig.leaveOnTimer.time);
      }
      queue.metadata.send({ content: 'Queue finished!' }).catch(err => { });
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