const mysql = require('mysql2')

require('dotenv').config();
const connection = mysql.createPool({
      host: '112.213.34.137',
      port: '3306',
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const { GetMember, LogPunishment, NotifyUser, HasPerms } = require("../moderationinc")
module.exports = {
      name: 'unmute',
      aliases: ['muterole', 'unm', 'un-mute'],
      description: 'unmutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (cmd === 'muterole') return mute_role(message, client, args, userstatus, Discord)
            if (userstatus !== 1) {
                  let perms = await HasPerms(message, message.member, client, 'd', 'l')
                  if (!message.member.permissions.has("MANAGE_MESSAGES") && perms !== 1 || perms == 2) {
                      const errorembed = new Discord.MessageEmbed()
                          .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                          .setColor(15684432)
                          .setDescription(`You do not have access to this command.`)
                      return message.channel.send({ embeds: [errorembed] })
                  }
              }
            if (!args[0]) {
                  return message.channel.send('Please give a member.')
            }
            let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
            let data = ['muterole', message.guild.id]
            connection.query(query, data, async function (error, results, fields) {
                  if (error) return console.log(error)
                  if (results == ``) {
                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        if (!userstatus == 1) {
                              if (message.guild.ownerId !== message.author.id) {
                                    if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) return message.channel.send('You cannot unmute someone with the same or higher roles than your own.');
                              }
                        }
                        let member = await GetMember(message, client, args[0], Discord, true, false);
                        if (member === 'cancelled') return
                        if (!member) return message.channel.send("Invalid member.");
                        if (!muterole) return message.channel.send('The mute role for this server could not be found.')
                        if (!member.roles.cache.some(role => role.id == muterole.id)) return message.channel.send('This member is not currently muted.')
                        let casenumber = client.currentcasenumber.get(message.guild.id) + 1
                        let query = "SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?";
                        let data = [member.id, message.guild.id, 'mute']
                        connection.query(query, data, function (error, results, fields) {
                              if (error) {
                                    console.log('backend error for checking active bans')
                                    return console.log(error)
                              }
                              if (results == '') {
                                    if (!member.roles.cache.some(role => role.id == muterole.id)) return message.channel.send('This member is not currently muted.')
                                    member.roles.remove(muterole).catch(err => {
                                          console.log(err)
                                          message.channel.send('Failed.')
                                    }).then(() => {
                                          const returnembed = new Discord.MessageEmbed()
                                                .setTitle(`Case #${casenumber}`)
                                                .setDescription(`<:check:988867881200652348> ${member} has had the muterole removed.`)
                                                .setColor("GREEN")
                                          message.channel.send({ embeds: [returnembed] })
                                          NotifyUser(4, message, `You have been un-muted in ${message.guild}`, member, reason, 0, client, Discord)
                                    })
                              } else {
                                    for (row of results) {
                                          query = "DELETE FROM activebans WHERE id = ?";
                                          data = [row["id"]]
                                          connection.query(query, data, function (error, results, fields) {
                                                if (error) return console.log(error)
                                          })
                                          if (!member.roles.cache.some(role => role.id == muterole.id)) {
                                                const returnembed = new Discord.MessageEmbed()
                                                      .setTitle(`Case #${casenumber}`)
                                                      .setDescription(`<:check:988867881200652348> ${member} has been unmuted. The mute role was not removed as they don't currently have the role.`)
                                                      .setColor("GREEN")
                                                message.channel.send({ embeds: [returnembed] })
                                                NotifyUser(4, message, `You have been un-muted in ${message.guild}`, member, reason, 0, client, Discord)
                                          } else {
                                                member.roles.remove(muterole).catch(err => {
                                                      console.log(err)
                                                      message.channel.send('Failed.')
                                                }).then(() => {
                                                      const returnembed = new Discord.MessageEmbed()
                                                            .setTitle(`Case #${casenumber}`)
                                                            .setDescription(`<:check:988867881200652348> ${member} has been **un-muted**.`)
                                                            .setColor("GREEN")
                                                      message.channel.send({ embeds: [returnembed] })
                                                      NotifyUser(4, message, `You have been un-muted in ${message.guild}`, member, reason, 0, client, Discord)
                                                })
                                          }
                                    }
                              }
                        })
                        let reason = args.slice(1).join(" ");
                        LogPunishment(message, client, member.id, 4, null, reason, Discord)
                  }
            })
      }
}
async function mute_role(message, client, args, userstatus, Discord) {
      if (!userstatus == 1) {
            if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("You do not have enough permissions to use this command.");
      }
      if (!args[0]) {
            const muteroleid = client.muteroles.get(message.guild.id)
            if (!muteroleid) {
                  const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor('BLUE')
                        .setDescription(`This server currently has no mute role set.\n\nSet a mute role using \n\`sm_muterole set [@role/role_id]\`\n\nAlternatively you may create a new mute role using \n\`sm_muterole create\`.\n\nThe mute command currently cannot be used due to the lack of a mute role.`);
                  return message.channel.send({ embeds: [embed] });
            }
            const muterole = message.guild.roles.cache.get(muteroleid);
            const embed = new Discord.MessageEmbed()
                  .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                  .setColor('BLUE')
                  .setDescription(`This server's mute role is currently ${muterole}.\n\nYou may stop the bot using this role with \n\`sm_muterole remove\`.\n\nIf you would like to set a new mute role you can do so using\n\`sm_muterole set [@role/role_id]\`.\n\nIf you remove the mute role and do not set another the mute command will stop working.`);
            return message.channel.send({ embeds: [embed] });
      }
      if (args[0].toLowerCase() !== 'set' && args[0].toLowerCase() !== 'create' && args[0].toLowerCase() !== 'remove') return message.channel.send('Usage is `sm_muterole [set|create|remove] [@role/role_id]`')
      if (args[0].toLowerCase() === 'set') {
            let role = message.guild.roles.cache.get(args[1].slice(3, -1)) || message.guild.roles.cache.get(args[1]);
            if (!role)
                  return message.channel.send('Invalid role.');
            let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid =  ?`;
            let data = ['muterole', message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO serverconfigs (type, details, serverid) VALUES (?, ?, ?)`;
                        let data = ['muterole', role.id, message.guild.id];
                        connection.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                        client.muteroles.set(message.guild.id, role.id)
                  } else {
                        let query = `UPDATE serverconfigs SET details = ? WHERE type = ? && serverid = ?`;
                        let data = [role.id, 'muterole', message.guild.id];
                        connection.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                        client.muteroles.set(message.guild.id, role.id)
                  }
            });
      } else if (args[0].toLowerCase() === 'create') {
            let muterole = await message.guild.roles.create({
                  name: "Muted",
                  permissions: [],
            }).catch(err => {
                  console.log(err);
                  message.channel.send('Failed to create a muted role.');
            });
            await message.guild.channels.fetch()
            await message.guild.channels.cache.forEach(async (channel) => {
                  if (channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                        if (channel) {
                              if (channel.permissionOverwrites) {
                                    await channel.permissionOverwrites.edit(muterole.id, { SEND_MESSAGES: false, ADD_REACTIONS: false, CONNECT: false, SEND_MESSAGES_IN_THREADS: false }).catch(err => { console.log(err) })

                              }
                        }
                  }
            });
            let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
            let data = ['muterole', message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO serverconfigs (type, details, serverid) VALUES (?, ?, ?)`;
                        let data = ['muterole', muterole.id, message.guild.id];
                        connection.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                        client.muteroles.set(message.guild.id, muterole.id)
                  } else {
                        let query = `UPDATE serverconfigs SET details = ? WHERE type = ? && serverid = ?`;
                        let data = [muterole.id, 'muterole', message.guild.id];
                        connection.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                        client.muteroles.set(message.guild.id, muterole.id)
                  }
            });
            message.channel.send(`Created the <@&${muterole.id}> role and set permissions in all channels *that ozaibot has access to editing*. This is now the mute role for Ozaibot.`);
      } else if (args[0].toLowerCase() === 'remove') {
            let query = `SELECT * FROM serverconfigs WHERE type = ?`;
            let data = ['muterole'];
            connection.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        message.channel.send('There is currently no mute role for this server.');
                  } else {
                        let query = `DELETE FROM serverconfigs WHERE type = ? && serverid = ?`;
                        let data = ['muterole', message.guild.id];
                        connection.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Removed the mute role for this server, the role still exists but Ozaibot will no longer use it for the mute command. You will need to set a new mute role in order to be able to mute again.');
                        });
                        client.muteroles.delete(message.guild.id)
                  }
            });
      }
}
