const { unix } = require('moment');
const mysql = require('mysql2');
const { GetMember, GetDisplay, GetPunishmentDuration } = require("../moderationinc")
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

module.exports = {
      name: 'mute',
      aliases: ['m'],
      description: 'mutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has("MANAGE_CHANNELS")) {
                        console.log("You don't have the permissions.")
                        return message.channel.send("You don't have the permissions.");
                  }
                  if (message.guild.ownerID !== message.author.id) {
                        if (message.member.roles.highest.position <= member.roles.highest.position) {
                              console.log('You cannot mute someone with higher or the same roles as your own.')
                              return message.channel.send('You cannot mute someone with higher or the same roles as your own.');
                        }
                  }
            } if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
                  console.log('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.')
                  return message.channel.send('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');

            }
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole']
            serversdb.query(query, data, async function (error, results, fields) {
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
                        return message.channel.send({ embeds: [errorembed] })
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        if (!muterole) {
                              console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                              return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                        }
                        if (message.guild.me.roles.highest.position <= muterole.position) {
                              console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                              return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                        }
                        let member = await GetMember(message, args[0], Discord, false);
                        if (!member) {
                              console.log('invalid member')
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                                    .setColor(15684432)
                                    .setDescription(`Invalid member.\n\nProper useage is:\n\`mute <@member|member_id> <time> <reason>\``)
                              return message.channel.send({ embeds: [errorembed] })
                        }
                        if (member.id === message.author.id) {
                              console.log('attempted self mute, canceling')
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                                    .setColor(15684432)
                                    .setDescription(`You cannot mute yourself.`)
                              return message.channel.send({ embeds: [errorembed] })
                        }
                        if (message.guild.ownerID !== message.author.id) {
                              if (member.id == message.guild.ownerID || member.permissions.has('ADMINISTRATOR')) {
                                    console.log('attempted mute against administrator, canceling')
                                    const errorembed = new Discord.MessageEmbed()
                                          .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                                          .setColor(15684432)
                                          .setDescription(`You cannot mute members with Administrator Permissions.`)
                                    return message.channel.send({ embeds: [errorembed] })
                              }
                              if (message.author.id !== '508847949413875712') {
                                    if (message.member.roles.highest.position <= member.roles.highest.position) {
                                          console.log('attempted mute against someone of higher rank, canceling')
                                          const errorembed = new Discord.MessageEmbed()
                                                .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                                                .setColor(15684432)
                                                .setDescription(`You cannot mute members with higher or the same permissions as your own.`)
                                          return message.channel.send({ embeds: [errorembed] })
                                    }
                              }
                        }
                        if (member.roles.cache.some(role => role.id == muterole.id)) {
                              console.log('attempted mute against someone already muted, canceling')
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                                    .setColor(15684432)
                                    .setDescription(`This member is already muted.`)
                              return message.channel.send({ embeds: [errorembed] })
                        }
                        member.roles.add(muterole).catch(err => {
                              console.log(err)
                              console.log('Failed; unable to add muterole to member')
                              return message.channel.send('Failed; unable to add muterole to member')
                        })
                        const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                        const muteduration = await GetPunishmentDuration(args[1])
                        let reason = args.slice(1).join(" ");
                        let display = ''
                        let timeunban = 9999999999;
                        if (muteduration) {
                              timeunban = muteduration + currenttime
                              display = GetDisplay(muteduration)
                        } else {
                              reason = args.slice(2).join(" ");
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
                        if (!muteduration || muteduration == 0) return
                        if (muteduration < 86400) {
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
                                                if (!message.guild.me.permissions.has('MANAGE_ROLES')) return console.log('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');
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
                              }, muteduration * 1000);
                        }
                  }
            });
      }
}