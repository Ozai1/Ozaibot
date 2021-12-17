const { unix } = require('moment');
const mysql = require('mysql2')
const serversdb = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
let numberfound = false;
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
module.exports = {
      name: 'mute',
      aliases: ['muteuser', 'silence', 'm', 'mute-user', 'muterole', 'mute-role'],
      description: 'mutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (cmd === 'muterole') return mute_role(message, cmd, args, userstatus, Discord)
            if (!userstatus == 1) {
                  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You don't have the permissions.");
                  if (message.guild.ownerID !== message.author.id) {
                        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot mute someone with higher or the same roles as your own.');
                  }
            } if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole']
            serversdb.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
                  if (results == ``) {
                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                        if (member) {
                              if (member.id === message.author.id) return message.channel.send('You can\'t mute yourself.');
                              if (message.guild.ownerID !== message.author.id) {
                                    if (member.id == message.guild.ownerID) return message.channel.send('You cannot mute the owner of the server.')
                                    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot mute someone with higher or the same roles as your own.');
                              }
                        } if (!muterole) return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                        if (message.guild.me.roles.highest.position <= muterole.position) return message.channels.send('I do not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                        if (!member) return message.channel.send("Invalid member");
                        member.roles.add(muterole).catch(err => {
                              console.log(err)
                              message.channel.send('Failed.')
                        })
                        let timeunban = 9999999999;
                        let reason = args.slice(2).join(" ")
                        let display = '';
                        let mutetimeseconds = null;
                        if (args[1]) {
                              const validtimes = ['m-min', 'min-min', 'mins-min', 'minute-min', 'minutes-min', 'h-hou', 'hour-hou', 'hours-hou', 'd-day', 'day-day', 'days-day', 'w-wee', 'week-wee', 'weeks-wee', 'mon-mon', 'months-mon']
                              let unitoftime = null;
                              let unitchosenraw = null;
                              const timechosen = args[1];
                              let timechosenpostfixfound = false;
                              validtimes.forEach((potentialtime2) => {
                                    const potentialtime = potentialtime2.slice(0, -4)
                                    if (timechosenpostfixfound === false) {
                                          if (potentialtime === timechosen.slice(timechosen.length - 1)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 1)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                                          } else if (potentialtime === timechosen.slice(timechosen.length - 3)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 3)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                                          } else if (potentialtime === timechosen.slice(timechosen.length - 4)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 4)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                                          } else if (potentialtime === timechosen.slice(timechosen.length - 5)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 5)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                                          } else if (potentialtime === timechosen.slice(timechosen.length - 6)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 6)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                                          } else if (potentialtime === timechosen.slice(timechosen.length - 7)) {
                                                unitchosenraw = timechosen.slice(timechosen.length - 7)
                                                timechosenpostfixfound = true
                                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)

                                          }
                                    }
                              })
                              if (timechosenpostfixfound === true) {
                                    if (unitoftime === 'min') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 60;
                                          timeunban = mutetimeseconds + currenttime;
                                    } else if (unitoftime === 'hou') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 3600;
                                          timeunban = mutetimeseconds + currenttime;
                                    } else if (unitoftime === 'day') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 86400;
                                          timeunban = mutetimeseconds + currenttime;
                                    } else if (unitoftime === 'wee') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 604800;
                                          timeunban = mutetimeseconds + currenttime;
                                    } else if (unitoftime === 'mon') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 2592000;
                                          timeunban = mutetimeseconds + currenttime;
                                    }
                                    let postfix = 's';
                                    if (mutetimeseconds < 60) {
                                          if (mutetimeseconds == 0) { postfix = '' }
                                          display = ` for ${mutetimeseconds} second${postfix}`
                                    } if (mutetimeseconds >= 60) {
                                          if (mutetimeseconds == 60) { postfix = '' }
                                          display = ` for ${mutetimeseconds / 60} minute${postfix}`
                                    } if (mutetimeseconds >= 3600) {
                                          if (mutetimeseconds == 3600) { postfix = '' }
                                          display = ` for ${mutetimeseconds / 3600} hour${postfix}`
                                    } if (mutetimeseconds >= 86400) {
                                          if (mutetimeseconds == 86400) { postfix = '' }
                                          display = ` for ${mutetimeseconds / 86400} day${postfix}`
                                    } if (mutetimeseconds >= 604800) {
                                          if (mutetimeseconds == 604800) { postfix = '' }
                                          display = ` for ${mutetimeseconds / 604800} week${postfix}`
                                    } if (mutetimeseconds >= 2592000) {
                                          if (mutetimeseconds == 2592000) { postfix = '' }
                                          display = ` for ${mutetimeseconds / 2592000} month${postfix}`
                                    }
                              } else {
                                    reason = args.slice(1).join(" ")
                                    display = '';
                              }
                        } else {
                              reason = args.slice(1).join(" ")
                              display = '';
                        }
                        message.channel.send(`${member} has been muted${display}.`)
                        query = "INSERT INTO activebans (userid, serverid, timeunban, type) VALUES (?, ?, ?, ?)";
                        data = [member.id, message.guild.id, timeunban, 'mute']
                        connection.query(query, data, function (error, results, fields) {
                              if (error) {
                                    message.channel.send('There was a backend error :/')
                                    return console.log(error)
                              }
                              return
                        })
                        if (mutetimeseconds === null) return
                        console.log('setthetimeout')
                        setTimeout(() => {
                              let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                              let data = ['muterole']
                              serversdb.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                                    if (results == ``) {
                                          return console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                                    }
                                    for (row of results) {
                                          let muteroleid = row["details"];
                                          const muterole = message.guild.roles.cache.get(muteroleid)
                                          if (!muterole) return console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                          if (message.guild.me.roles.highest.position <= muterole.position) return console.log('I do not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                          if (!message.guild.me.hasPermission('MANAGE_ROLES')) return console.log('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');
                                          member.roles.remove(muterole).catch(err => { console.log(err) })
                                          console.log('Unmuted for previous mute on same life')
                                          query = "SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?";
                                          data = [member.id, message.guild.id, 'mute']
                                          connection.query(query, data, function (error, results, fields) {
                                                if (error) {
                                                      console.log('backend error for checking active bans')
                                                      return console.log(error)
                                                }
                                                for (row of results) {
                                                      query = "DELETE FROM activebans WHERE id = ?";
                                                      data = [row["id"]]
                                                      connection.query(query, data, function (error, results, fields) {
                                                            if (error) return console.log(error)
                                                      })
                                                }
                                          })
                                    }
                              })
                        }, mutetimeseconds * 1000);
                  }
            })
      }
}
const stopthething = () => {
      numberfound = true;
}
async function mute_role(message, cmd, args, userstatus, Discord) {
      if (!userstatus == 1) {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have enough permissions to use this command.");
      }
      if (!args[0]) {
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        const embed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('BLUE')
                              .setDescription(`This server currently has no mute role set.\n\nSet a mute role using \n\`sm_muterole set [@role/role_id]\`\n\nAlternatively you may create a new mute role using \n\`sm_muterole create\`.\n\nThe mute command currently cannot be used due to the lack of a mute role.`);
                        return message.channel.send(embed);
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid);
                        const embed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('BLUE')
                              .setDescription(`This server's mute role is currently ${muterole}.\n\nYou may stop the bot using this role with \n\`sm_muterole remove\`.\n\nIf you would like to set a new mute role you can do so using\n\`sm_muterole set [@role/role_id]\`.\n\nIf you remove the mute role and do not set another the mute command will stop working.`);
                        return message.channel.send(embed);

                  }
            });
            return;
      }
      if (args[0].toLowerCase() !== 'set' && args[0].toLowerCase() !== 'create' && args[0].toLowerCase() !== 'remove') return message.channel.send('Usage is `sm_muterole [set|create|remove] [@role/role_id]`')
      if (args[0].toLowerCase() === 'set') {
            let role = message.guild.roles.cache.get(args[1].slice(3, -1)) || message.guild.roles.cache.get(args[1]);
            if (!role)
                  return message.channel.send('Invalid role.');
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO ${message.guild.id}config (type, details) VALUES (?, ?)`;
                        let data = ['muterole', role.id];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                  } else {
                        let query = `UPDATE ${message.guild.id}config SET details = ? WHERE type = ?`;
                        let data = [role.id, 'muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                  }
            });


      } else if (args[0].toLowerCase() === 'create') {
            let muterole = await message.guild.roles.create({
                  data: {
                        name: "Muted",
                        permissions: [],
                  },
            }).catch(err => {
                  console.log(err);
                  message.channel.send('Failed to create a muted role.');
            });
            await message.guild.channels.cache.forEach(async (channel, id) => {
                  if (channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                        await channel.updateOverwrite(muterole, {
                              SEND_MESSAGES: false,
                              ADD_REACTIONS: false,
                              CONNECT: false,
                              SEND_MESSAGES_IN_THREADS: false,
                        });
                  }
            });
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO ${message.guild.id}config (type, details) VALUES (?, ?)`;
                        let data = ['muterole', muterole.id];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                  } else {
                        let query = `UPDATE ${message.guild.id}config SET details = ? WHERE type = ?`;
                        let data = [muterole.id, 'muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                  }
            });
            message.channel.send('Created the muted role and set permissions in all channels *that ozaibot has access to editing*. This is now the mute role for Ozaibot.');
      } else if (args[0].toLowerCase() === 'remove') {
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        message.channel.send('There is currently no mute role for this server.');
                  } else {
                        let query = `DELETE FROM ${message.guild.id}config WHERE type = ?`;
                        let data = ['muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Removed the mute role for this server, the role still exists but Ozaibot will no longer use it for the mute command. You will need to set a new mute role in order to be able to mute again.');
                        });
                  }
            });
      }
}