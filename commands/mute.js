const { unix } = require('moment');
const mysql = require('mysql2');
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = {
      name: 'mute',
      aliases: ['muteuser', 'silence', 'm', 'mute-user'],
      description: 'mutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!userstatus == 1) {
                  if (!message.member.hasPermission("MANAGE_CHANNELS")) {
                        console.log("You don't have the permissions.")
                        return message.channel.send("You don't have the permissions.");
                  }
                  if (message.guild.ownerID !== message.author.id) {
                        if (message.member.roles.highest.position <= member.roles.highest.position) {
                              console.log('You cannot mute someone with higher or the same roles as your own.')
                              return message.channel.send('You cannot mute someone with higher or the same roles as your own.');
                        }
                  }
            } if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
                  console.log('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.')
                  return message.channel.send('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');

            }
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole']
            serversdb.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
                  if (results == ``) {
                        console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  }
                  if (!args[0]) {
                        console.log('Add a member arguement.')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor(15684432)
                              .setDescription(`Add a member arguement.\n\nProper useage is:\n\`mute <@member|member_id> <time> <reason>\``)
                        return message.channel.send(errorembed)
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                        if (member) {
                              if (member.id === message.author.id) {
                                    console.log('You can\'t mute yourself.')
                                    return message.channel.send('You can\'t mute yourself.');
                              }
                              if (message.guild.ownerID !== message.author.id) {
                                    if (member.id == message.guild.ownerID || member.hasPermission('ADMINISTRATOR')) {
                                          console.log('You cannot mute a member with administrator permissions')
                                          return message.channel.send('You cannot mute a member with administrator permissions')
                                    }
                                    if (message.author.id !== '508847949413875712') {
                                          if (message.member.roles.highest.position <= member.roles.highest.position) {
                                                console.log('You cannot mute someone with higher or the same roles as your own.')
                                                return message.channel.send('You cannot mute someone with higher or the same roles as your own.');
                                          }
                                    }
                              }
                        } if (!muterole) {
                              console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                              return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                        }
                        if (message.guild.me.roles.highest.position <= muterole.position) {
                              console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                              return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                        }
                        if (!member) {
                              console.log('invalid member')
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL())
                                    .setColor(15684432)
                                    .setDescription(`Invalid member.\n\nProper useage is:\n\`mute <@member|member_id> <time> <reason>\``)
                              return message.channel.send(errorembed)
                        }
                        if (member.roles.cache.has(muterole.id)) {
                              console.log('This member is already muted.')
                              return message.channel.send('This member is already muted.')
                        }
                        member.roles.add(muterole).catch(err => {
                              console.log(err)
                              message.channel.send('Failed.')
                        })
                        const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                        let timeunban = 9999999999;
                        let reason = args.slice(2).join(" ")
                        let display = '';
                        let mutetimeseconds = null;
                        if (args[1]) {
                              const validtimes = ['s-sec', 'sec-sec', 'second-sec', 'secs-sec', 'seconds-sec', 'm-min', 'min-min', 'mins-min', 'minute-min', 'minutes-min', 'h-hou', 'hour-hou', 'hours-hou', 'd-day', 'day-day', 'days-day', 'w-wee', 'week-wee', 'weeks-wee', 'mon-mon', 'months-mon']
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
                                          timeunban = Number(mutetimeseconds + currenttime);
                                    } else if (unitoftime === 'hou') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 3600;
                                          timeunban = mutetimeseconds + currenttime;
                                    } else if (unitoftime === 'day') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 86400;
                                          timeunban = Number(mutetimeseconds + currenttime);
                                    } else if (unitoftime === 'wee') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 604800;
                                          timeunban = Number(mutetimeseconds + currenttime);
                                    } else if (unitoftime === 'mon') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 2592000;
                                          timeunban = Number(mutetimeseconds + currenttime);
                                    } else if (unitoftime === 'sec') {
                                          mutetimeseconds = timechosen.slice(0, -unitchosenraw.length);
                                          timeunban = Number(mutetimeseconds) + currenttime;
                                    }
                                    let postfix = 's'; //60 3600 86400 604800 2592000
                                    if (mutetimeseconds < 60) {
                                          if (mutetimeseconds == 1) { postfix = '' }
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
                        console.log(`user has been muted${display}.`)
                        if (mutetimeseconds === null) return
                        if (mutetimeseconds < 86400) {
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
                                                console.log(`User ${member.id} unmuted for mute from same life in ${message.guild}(${message.guild.id})`)
                                                query = "SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?";
                                                data = [member.id, message.guild.id, 'mute']
                                                connection.query(query, data, function (error, results, fields) {
                                                      if (error) {
                                                            console.log('backend error for checking active bans')
                                                            return console.log(error)
                                                      }
                                                      for (row of results) {
                                                            query = "DELETE FROM activebans WHERE id = ?";
                                                            data = [[row['id']]]
                                                            connection.query(query, data, function (error, results, fields) {
                                                                  if (error) return console.log(error)
                                                            })
                                                      }
                                                })
                                          }
                                    })
                              }, mutetimeseconds * 1000);
                        }
                  }
            });
      }
}
async function findUserByName(message, client, args, Discord) {

}