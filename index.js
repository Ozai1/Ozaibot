console.log('Stwarting Ozwaibot!!!')
const { unix } = require('moment');
const moment = require('moment');
const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const guildinvites = new Map();
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone', });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
      require(`./handlers/${handler}`)(client, Discord);
})

client.on('ready', async () => {
      let rating = Math.floor(Math.random() * 2) + 1;
      if (rating == 1) {
            client.user.setPresence({ status: 'dnd' });
      }
      let query = "SET GLOBAL max_connections = 512";
      let data = []
      connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
      })
      data = []
      client.guilds.cache.forEach(async (guild) => {
            query = `CREATE TABLE IF NOT EXISTS ${guild.id}config(id INT(12) AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255) COLLATE utf8mb4_unicode_ci, details VARCHAR(255) COLLATE utf8mb4_unicode_ci, details2 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details3 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details4 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details5 VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
            serversdb.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
            })
            query = `CREATE TABLE IF NOT EXISTS ${guild.id}punishments(id INT(12) AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(32), serverid VARCHAR(32), adminid VARCHAR(32), timeexecuted VARCHAR(32), timeunban VARCHAR(32), reason VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
            serversdb.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
            })
            if (guild.me.hasPermission('MANAGE_GUILD')) {
                  guild.fetchInvites().then(invites => guildinvites.set(guild.id, invites)).catch(err => { console.log(err) })
            }
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
                              query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
                              data = ['muterole']
                              serversdb.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                                    if (results == ``) {
                                          return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found in db.`)
                                    }
                                    for (row of results) {
                                          let muteroleid = row["details"];
                                          const muterole = guild.roles.cache.get(muteroleid)
                                          if (!muterole) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found.`)
                                          if (guild.me.roles.highest.position <= muterole.position) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was higher in perms than me.`)
                                          if (!guild.me.hasPermission('MANAGE_ROLES')) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the i no longer have manage roles.`)
                                          member.roles.remove(muterole).catch(err => { console.log(err) })
                                          console.log(`unmuted ${userid} in ${guild}(${guild.id})`)
                                    }
                              })
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
      let alllogs = client.channels.cache.get('882845463647256637');
      alllogs.send(`Bot started up <@!508847949413875712>`)
      console.log(`Signed into ${client.user.tag}`)

})
client.on('guildMemberAdd', async member => {
      const guild = member.guild
      console.log(`${member.user.tag} joined ${guild}`)
      if (!guild.me.hasPermission('MANAGE_GUILD')) return
      let query = `SELECT * FROM ${member.guild.id}config WHERE type = ?`;
      let data = ['whitelist']
      serversdb.query(query, data, async function (error, results, fields) {
            if (error) {
                  console.log('backend error for checking active bans')
                  return console.log(error)
            }
            if (results == '' || results === undefined) {
            } else {
                  let query = "SELECT * FROM whitelist WHERE userid = ? && serverid = ?";
                  let data = [member.id, member.guild.id]
                  connection.query(query, data, async function (error, results, fields) {
                        if (error) {
                              console.log('backend error for checking active bans')
                              return console.log(error)
                        }
                        if (results == '' || results === undefined) {
                              try {
                                    if (member.guild.me.hasPermission('BAN_MEMBERS') && member.guild.me.roles.highest > member.roles.highest) {
                                          member.ban({ reason: `Unauthed join, autoban (was not added to whitelist)`, days: 1 }).catch(err => { console.log(err) })
                                          console.log(`${member.user.tag}(${member.id}) tried to join ${member.guild} and got autobanned AUTOBAN`)
                                          const ozacordgen = client.channels.cache.get('926782590826987563')
                                          ozacordgen.send(`${member.user.tag}(${member.id}) tried to join ${member.guild} and got autobanned AUTOBAN`).catch(err => { console.log(err) })
                                    } else console.log(`Ozaibot either doesnt have ban perms or doesnt have high enough perms to ban new members in guild ${member.guild.id} for its whitelist`)
                              } catch (err) {
                                    console.log(err)
                              }
                        }
                  })
            }
      })
      if (guild.id == '942731536770428938') {
            let blossomrole = guild.roles.cache.get('942791591725252658')
            member.roles.add(blossomrole).catch(err => {console.log(err)})
      }
      const cachedinvites = guildinvites.get(member.guild.id);
      const newinvites = await member.guild.fetchInvites();
      guildinvites.set(member.guild.id, newinvites)
      try {
            const usedinvite = newinvites.find(inv => cachedinvites.get(inv.code).uses < inv.uses)
            if (!usedinvite) {
                  query = `INSERT INTO invites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
                  data = [member.id, member.guild.id, 'unknown', Number(Date.now(unix).toString().slice(0, -3).valueOf()), 'unknown']
                  connection.query(query, data, function (error, results, fields) {
                        if (error) {
                              return console.log(error)
                        }
                        console.log(`${member.user.tag} has joined ${member.guild} using invite code [unknown] made by [unknown]`)
                        return
                  })
                  return
            }
            query = `INSERT INTO invites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
            data = [member.id, member.guild.id, usedinvite.inviter.id, Number(Date.now(unix).toString().slice(0, -3).valueOf()), usedinvite.code]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        return console.log(error)
                  }
                  console.log(`${member.user.tag} has joined ${member.guild} using invite code ${usedinvite.code} made by ${usedinvite.inviter.tag}`)
                  return
            })
            query = `SELECT * FROM lockdownlinks WHERE invitecode = ? && serverid = ?`;
            data = [usedinvite.code, member.guild.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) return
                  for (row of results) {
                        let action = row["action"]
                        let adminid = row["adminid"]
                        if (action === 'mute') {
                              let query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
                              let data = ['muterole']
                              serversdb.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                                    if (results == `` || results === undefined) {
                                          return console.log(`${guild} (${guild.id}) has set up a link to automute but there is no mute role for this server`)
                                    }
                                    for (row of results) {
                                          let muteroleid = row["details"];
                                          const muterole = guild.roles.cache.get(muteroleid)
                                          if (!muterole) {
                                                return console.log(`${guild} (${guild.id}) has set up a link to automute but the mute role could not be found`)
                                          }
                                          if (guild.me.roles.highest.position <= muterole.position) {
                                                console.log(`${guild} (${guild.id}) has set up a link to automute but I do not have high enough permissions to mute the user`)
                                          }
                                          member.roles.add(muterole).catch(err => {
                                                console.log(err)
                                          })
                                          console.log(`${member.user.tag} was muted from ${guild} (${guild.id}) for using blacklisted link: ${usedinvite.code}`)
                                          member.send(`You have been muted because you are a prime suspect in an on going raid.`)
                                    }
                              })
                        } else if (action === 'kick') {
                              member.send(`You have been kicked from ${guild} because you are a prime suspect in an on going raid.`)
                              member.kick().catch(err => { console.log(err) })
                              console.log(`${member.user.tag} was kicked from ${guild} for using blacklisted link: ${usedinvite.code}`)
                        } else if (action === 'ban') {
                              let admin = client.users.cache.get(adminid)
                              if (!admin) { admin = 'Unknownuser' } else { admin = admin.tag }
                              member.send(`You have been banned from ${guild} because you are a prime suspect in an on going raid.`)
                              member.ban({ reason: `AUTOBAN: Used link set for autoban: ${usedinvite.code}. The blacklist on this invite was set by ${admin}(${adminid})` }).catch(err => { console.log(err) })
                              console.log(`${member.user.tag} was banned from ${guild} for using blacklisted link: ${usedinvite.code}.`)
                        }
                  }
            })
            query = `SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?`;
            data = [member.id, member.guild.id, 'mute']
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        return console.log(error)
                  }
                  if (results == `` || results === undefined) return
                  let query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
                  let data = ['muterole']
                  serversdb.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                        if (results == `` || results === undefined) {
                              return console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but muterole was removed in db`)
                        }
                        for (row of results) {
                              let muteroleid = row["details"];
                              const muterole = guild.roles.cache.get(muteroleid)
                              if (!muterole) {
                                    return console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but muterole was not found`)
                              }
                              if (guild.me.roles.highest.position <= muterole.position) {
                                    console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but i have lower perms than muterole now`)
                              }
                              member.roles.add(muterole, { reason: `AUTOMUTE: user has left and rejoined while muted, mute role auto added. if this user is not meant to be muted please unmute them through ozaibot so they do not get automuted for mute evading again.` }).catch(err => {
                                    console.log(err)
                              })
                              console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, remuted`)
                              member.send(`You have been auto muted from ${member.guild} due to a previous mute not expiring but you rejoining, you will still be unmuted when the mute expires or if you are manually unmuted.`)
                        }
                  })
            })
      } catch (err) {
            console.log(err)
      }
})
client.on('inviteCreate', async invite => {
      const newinvites = await invite.guild.fetchInvites();
      guildinvites.set(invite.guild.id, newinvites)
})
client.on('guildMemberUpdate', async (oldmember, newmember) => {
      if (newmember.guild.id == '806532573042966528') {
            if (!newmember.roles.cache.has('922514880102277161') && oldmember.roles.cache.has('922514880102277161')) {
                  let katcordgen = client.channels.cache.get('806532573042966530');
                  if (!katcordgen) return console.log('kat cord general not found');
                  let welcomemessages = [`welcome to rainy day kat-fe ${newmember}! <@&933185109094465547>`];
                  let rating = Math.floor(Math.random() * welcomemessages.length);
                  katcordgen.send(welcomemessages[rating]).catch(err => { console.log(err) });
                  console.log('welcome message sent')
            }
      }
})
client.on('messageUpdate', (oldMessage, newMessage) => { // Old message may be undefined
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
})
client.on('guildMemberRemove', async member => {
      if (member.id == '753454519937007696') {
            client.users.cache.get('508847949413875712').send(`${member.user.tag} has left ${member.guild}`)
      }
})
client.on('messageReactionAdd', async (react, author) => {
      if (react.message.id == '942754717484863508') {
            let member = react.message.guild.members.cache.get(author.id)
            if (react.emoji.name === 'p_pink01_nf2u') { // she/her 942758515368407050
                  let prorole = react.message.guild.roles.cache.get('942758515368407050')
                  member.roles.add(prorole).catch(err => { console.log(err) })
                  author.send('Gave you the she/her role.')
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/him 942758528299438100
                  let prorole = react.message.guild.roles.cache.get('942758528299438100')
                  member.roles.add(prorole).catch(err => { console.log(err) })
                  author.send('Gave you the he/him role.')
            } else if (react.emoji.name === 'p_pink03_nf2u') { // they/them 942758559547019284
                  let prorole = react.message.guild.roles.cache.get('942758559547019284')
                  member.roles.add(prorole).catch(err => { console.log(err) })
                  author.send('Gave you the they/them role.')
            } else if (react.emoji.name === 'p_pink04_nf2u') { // she/they 942758579574829106
                  let prorole = react.message.guild.roles.cache.get('942758579574829106')
                  member.roles.add(prorole).catch(err => { console.log(err) })
                  author.send('Gave you the she/they role.')
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/they 942758598533083157
                  let prorole = react.message.guild.roles.cache.get('942758598533083157')
                  member.roles.add(prorole).catch(err => { console.log(err) })
                  author.send('Gave you the he/they role.')
            }
      }
})
client.on('messageReactionRemove', async (react, author) => {
      if (react.message.id == '942754717484863508') {
            let member = react.message.guild.members.cache.get(author.id)
            if (react.emoji.name === 'p_pink01_nf2u') { // she/her 942758515368407050
                  let prorole = react.message.guild.roles.cache.get('942758515368407050')
                  member.roles.remove(prorole).catch(err => { console.log(err) })
                  author.send('Took away the she/her role.')
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/him 942758528299438100
                  let prorole = react.message.guild.roles.cache.get('942758528299438100')
                  member.roles.remove(prorole).catch(err => { console.log(err) })
                  author.send('Took away the he/him role.')
            } else if (react.emoji.name === 'p_pink03_nf2u') { // they/them 942758559547019284
                  let prorole = react.message.guild.roles.cache.get('942758559547019284')
                  member.roles.remove(prorole).catch(err => { console.log(err) })
                  author.send('Took away the they/them role.')
            } else if (react.emoji.name === 'p_pink04_nf2u') { // she/they 942758579574829106
                  let prorole = react.message.guild.roles.cache.get('942758579574829106')
                  member.roles.remove(prorole).catch(err => { console.log(err) })
                  author.send('Took away the she/they role.')
            } else if (react.emoji.name === 'p_pink02_nf2u') { // he/they 942758598533083157
                  let prorole = react.message.guild.roles.cache.get('942758598533083157')
                  member.roles.remove(prorole).catch(err => { console.log(err) })
                  author.send('Took away the he/they role.')
            }
      }
})
client.login(process.env.DISCORD_TOKEN)

