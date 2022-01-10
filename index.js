console.log('Starting....')
const { unix } = require('moment');
const moment = require('moment');
const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const serversdb = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const guildinvites = new Map();
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone' });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
      require(`./handlers/${handler}`)(client, Discord);
})

client.on('ready', async () => {
      let rating = Math.floor(Math.random() * 2) + 1;
      if (rating == 1) {
            client.user.setPresence({ status: 'dnd' });
            console.log('Set status to DND')
      } else console.log('Set status to Online')
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
            guild.fetchInvites().then(invites => guildinvites.set(guild.id, invites)).catch(err => { console.log(err) })
      })
      console.log(`Signed into ${client.user.tag}`)
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
      console.log('shits online')
})
client.on('guildMemberAdd', async member => {
      const guild = member.guild
      console.log(`${member.user.tag} joined ${member.guild}`)
      if (member.guild.id == '911829929962901514' || member.guild.id == '750558849475280916') {
            let allowedusers = ['508847949413875712', '862247858740789269', '349920059549941761', '855480412319383592', '918143536879267872', '889139211771449354', '302050872383242240', '235088799074484224', '408785106942164992', '816968930564243457', '292953664492929025',]
            if (!allowedusers.includes(member.id)) {
                  member.ban({ reason: `Unauthed join, autoban`, }).catch(err => { console.log(err) })
                  console.log(`${member.user.tag}(${member.id}) tried to join ${member.guild} and got autobanned \*\*\*\*\* AUTOBAN`)
                  let ozavcordgen = client.channels.cache.get('888781109754736701')
                  ozavcordgen.send(`${member.user.tag}(${member.id}) tried to join ${member.guild} and got autobanned \*\*\*\*\* AUTOBAN`).catch(err => { console.log(err) })
            }
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
      } catch (err) {
            console.log(err)
      }
})
client.on('inviteCreate', async invite => {
      const newinvites = await invite.guild.fetchInvites();
      guildinvites.set(invite.guild.id, newinvites)
})

client.login(process.env.DISCORD_TOKEN)
