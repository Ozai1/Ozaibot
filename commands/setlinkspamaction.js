const { link } = require('fs');
const mysql = require('mysql2');
const { GetPunishName, GetPunishNumber, GetPunishmentDuration, GetDisplay } = require('../moderationinc')
require('dotenv').config();
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

module.exports = {
      name: 'setlinkspamaction',
      aliases: ['setmasslinkspamaction'],
      description: 'fvtgjkh',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (!message.member.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('You do not have access to this command.')
            }
            if (!args[0]) {
                  let linkspammap = client.antiscamspam.get(message.guild.id)
                  let massaction = linkspammap.get('punishtypemass')
                  let action = linkspammap.get('punishtype')
                  let masslength = linkspammap.get('punishlengthmass')
                  let length = linkspammap.get('punishlength')
                  let descriptionstring = ''
                  if (action) {
                        descriptionstring = descriptionstring + `**Link Spam Action**:\n\`${GetPunishName(`${action}`)}\``
                        if (length) {
                              descriptionstring = descriptionstring + `${GetDisplay(length, true)}`
                        }
                  } else {
                        descriptionstring = descriptionstring + `**Link Spam Action**:\nNone.`
                  }
                  if (massaction) {
                        descriptionstring = descriptionstring + `\n\n**Mass Link Spam Action**:\n\`${GetPunishName(`${massaction}`)}\``
                        if (masslength) {
                              descriptionstring = descriptionstring + `${GetDisplay(masslength, true)}`
                        }
                  } else {
                        descriptionstring = descriptionstring + `\n\n**Mass Link Spam Action**:\nNone.`
                  }
                  const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setDescription(`${descriptionstring}`)
                        .setColor('BLUE')
                  return message.channel.send({ embeds: [embed] });
            }
            let punishtype = GetPunishNumber(args[0])
            if (!punishtype || punishtype == 2 || punishtype == 4) {
                  console.log('Invalid punishment')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid action chosen.\n\nValid actions:\n\`ban\` \`mute\` \`kick\` \`soft-ban\` \`warn\``)
                  return message.channel.send({ embeds: [errorembed] });
            }
            let muteduration = undefined
            if (punishtype == 3) {
                  if (args[1]) {
                        muteduration = await GetPunishmentDuration(args[1])
                        if (muteduration === Infinity) {
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                                    .setColor(15684432)
                                    .setDescription(`Invalid time.`)
                              return message.channel.send({ embeds: [errorembed] });
                        }
                  }
            }
            if (cmd === 'setmasslinkspamaction') {
                  let current = client.antiscamspam.get(message.guild.id)
                  let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                  let data = ['linkspam', message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error)
                              return console.log(error);
                        if (results == `` || results === undefined) {
                              let query = `INSERT INTO serverconfigs (type, details2, serverid) VALUES (?, ?, ?)`;
                              let data = ['linkspam', punishtype, message.guild.id];
                              connection.query(query, data, function (error, results, fields) {
                                    if (error)
                                          return console.log(error);
                              });
                              if (muteduration) {
                                    let query = `UPDATE serverconfigs SET details4 = ? WHERE type = ? && serverid = ?`;
                                    let data = [muteduration, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlengthmass', muteduration)
                              } else {
                                    let query = `UPDATE serverconfigs SET details4 = ? WHERE type = ? && serverid = ?`;
                                    let data = [null, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlengthmass', null)
                              }
                        } else {
                              let query = `UPDATE serverconfigs SET details2 = ? WHERE type = ? && serverid = ?`;
                              let data = [punishtype, 'linkspam', message.guild.id];
                              connection.query(query, data, function (error, results, fields) {
                                    if (error)
                                          return console.log(error);
                              });
                              if (muteduration) {
                                    let query = `UPDATE serverconfigs SET details4 = ? WHERE type = ? && serverid = ?`;
                                    let data = [muteduration, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlengthmass', muteduration)
                              } else {
                                    let query = `UPDATE serverconfigs SET details4 = ? WHERE type = ? && serverid = ?`;
                                    let data = [null, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlengthmass', null)
                              }
                        }
                  });
                  current.set('punishtypemass', punishtype)
            } else {
                  let current = client.antiscamspam.get(message.guild.id)
                  let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                  let data = ['linkspam', message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error)
                              return console.log(error);
                        if (results == `` || results === undefined) {
                              let query = `INSERT INTO serverconfigs (type, details, serverid) VALUES (?, ?, ?)`;
                              let data = ['linkspam', punishtype, message.guild.id];
                              connection.query(query, data, function (error, results, fields) {
                                    if (error)
                                          return console.log(error);
                              });
                              if (muteduration) {
                                    let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
                                    let data = [muteduration, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlength', muteduration)
                              } else {
                                    let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
                                    let data = [null, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlength', null)
                              }
                        } else {
                              let query = `UPDATE serverconfigs SET details = ? WHERE type = ? && serverid = ?`;
                              let data = [punishtype, 'linkspam', message.guild.id];
                              connection.query(query, data, function (error, results, fields) {
                                    if (error)
                                          return console.log(error);
                              });
                              if (muteduration) {
                                    let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
                                    let data = [muteduration, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlength', muteduration)
                              } else {
                                    let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
                                    let data = [null, 'linkspam', message.guild.id];
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error)
                                                return console.log(error);
                                    });
                                    current.set('punishlength', null)
                              }
                        }
                  });
                  current.set('punishtype', punishtype)
            }
            const returnembed = new Discord.MessageEmbed()
                  .setDescription(`<:check:988867881200652348> Action set to **${GetPunishName(punishtype)}**.`)
                  .setColor("GREEN")
            message.channel.send({ embeds: [returnembed] })
      }
}