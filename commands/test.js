const { relativeTimeRounding } = require("moment");
const { unix } = require("moment");
const DISCORD_EPOCH = 1420070400000
let nextbumptime = '';
let lastbumptime = '';
const imissjansomuchithurts = 1420070400000
const convertSnowflakeToDate = (snowflake, epoch = DISCORD_EPOCH) => {
      nextbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      nextbumptime = Number(nextbumptime) + 7200
      lastbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      return
}
const mysql = require('mysql2');
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
      name: 'test',
      aliases: ['steamid','lemonpurge', 'slashcommands', 'youare', 'sql', 'botperms', 'myperms', 'nextbump', 'currenttime', 'a', 'massping', 'massmessage', 'serverpurge', 'apprespond', 'msgl', 'drag', 'ghostjoin', 'deletemessage', 'oldpurgeall', 'role'],
      description: 'whatever the fuck i am testing at the time',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'nextbump') return next_bump(message)
            if (cmd === 'currenttime') return current_time(message)
            if (cmd === 'a') return repeat_message(message, args, userstatus)
            if (cmd === 'massping') return mass_message(message, args, userstatus)
            if (cmd === 'serverpurge') return server_wide_purge(message, args, userstatus)
            if (cmd === 'apprespond') return application_respond(message, args, userstatus, client)
            if (cmd === 'msgl') return message_length(message, args)
            if (cmd === 'drag') return drag_user(message, args, userstatus, Discord)
            if (cmd === 'ghostjoin') return ghost_join(message, userstatus, client)
            if (cmd === 'deletemessage') return delete_message(message, args, client, userstatus)
            if (cmd === 'oldpurgeall') return chat_crawler(message, userstatus, client)
            if (cmd === 'role') return chercord_role(message, args)
            if (cmd === 'youare') return youare(message, args, userstatus)
            if (cmd === 'myperms') return my_perms(message, userstatus, Discord)
            if (cmd === 'botperms') return bot_perms(message, userstatus, Discord)
            if (cmd === 'sql') return self_sql(message, args)
            if (cmd === 'slashcommands') return slash_command_invite(message)
            if (cmd === 'lemonpurge') return purge_of_racial_slurs(message, userstatus)
            if (cmd === 'steamid') return convert_steam_id(message, args);
            if (userstatus == 1) {
            }
      }
}
async function convert_steam_id(message, args) {
      if (!args[0]) return message.channel.send('U needa add the steamid');
      message.channel.send(`#${args[0].replace(/:/g, '_')}`)
}
async function purge_of_racial_slurs(message, userstatus) {
      if (userstatus == 1) {
            let amountfound = 0;
            message.channel.send('Starting the search...').then(message => {

            });
            let lastmessagefetchedid = undefined;
            let janisamazing = true;
            while (janisamazing) {
                  let options = null;
                  options = { limit: 100 };
                  if (lastmessagefetchedid) {
                        options.before = lastmessagefetchedid;
                  } else {
                        options.before = message.id;
                  }
                  await message.channel.messages.fetch(options).then(messages => {
                        messages.forEach(async message2 => {
                              if (message2.content.toLowerCase().includes('nig')) {
                                    await message2.delete().catch(err => { console.log(err) })
                                    amountfound = amountfound + 1;
                              }
                        })
                        if (messages.length == 0) {
                              janisamazing = false;
                              return message.channel.send(`Done, ${amountfound} messages deleted.`)
                        }
                        if (!messages.last()) {
                              janisamazing = false;
                              return message.channel.send(`Done, ${amountfound} messages deleted.`)
                        }
                        lastmessagefetchedid = messages.last().id;
                  })
            }
      }
}
async function slash_command_invite(message) {
      if (message.channel.type === 'dm') {
            message.channel.send(`Have an administrator reinvite ozaibot with this link to enable slash commands in your server:\nhttps://discord.com/api/oauth2/authorize?client_id=862247858740789269&permissions=30030425343&scope=bot%20applications.commands`)
            return
      }
      message.channel.send(`Have an administrator reinvite ozaibot with this link to enable slash commands in your server:\nhttps://discord.com/api/oauth2/authorize?client_id=862247858740789269&permissions=30030425343&scope=bot%20applications.commands&guild_id=${message.guild.id}`)
}
async function self_sql(message, args) {
      if (message.author.id == '508847949413875712') {
            if (args[0].toLowerCase() === 'tables') {
                  return message.channel.send(`this needs to be manually updated :sob:
            activebans
            applications
            chercordcount
            chercordrole
            chercordver
            usedinvites
            lockdownlinks
            prefixes
            privservers
            totalcmds
            userstatus
            whitelist
            activeinvites
            `)
            } else if (!args[0]) return message.channel.send('Add an arg')
            query = args.slice(0).join(" ");
            data = []
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log(error)
                        return message.channel.send('Errored\n' + error)
                  } else {
                        message.channel.send('Successful.')
                  }
            })
      } else {
            let shitpostmessage = await message.channel.send('Successful: Dropped all tables in 0.030 seconds.')
      }
}
async function my_perms(message, userstatus, Discord) {
      if (userstatus == 1) {
            let printtext = '';
            if (message.member.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('You have administrator permissions.')
            }
            if (message.member.permissions.has('BAN_MEMBERS')) {
                  printtext = printtext + 'Ban\n';
            }
            if (message.member.permissions.has('KICK_MEMBERS')) {
                  printtext = printtext + 'Kick\n';
            }
            if (message.member.permissions.has('MANAGE_CHANNELS')) {
                  printtext = printtext + 'Manage Channels\n';
            }
            if (message.member.permissions.has('MANAGE_GUILD')) {
                  printtext = printtext + 'Manage Server\n';
            }
            if (message.member.permissions.has('MANAGE_MESSAGES')) {
                  printtext = printtext + 'Manage Messages\n';
            }
            if (message.member.permissions.has('MANAGE_ROLES')) {
                  printtext = printtext + 'Manage Roles\n';
            }
            if (message.member.permissions.has('CREATE_INSTANT_INVITE')) {
                  printtext = printtext + 'Create Invites\n';
            }
            if (message.member.permissions.has('SEND_MESSAGES')) {
                  printtext = printtext + 'Send Messages\n';
            }
            if (message.member.permissions.has('VIEW_AUDIT_LOG')) {
                  printtext = printtext + 'View Audit Log\n';
            }
            if (message.member.permissions.has('ADD_REACTIONS')) {
                  printtext = printtext + 'Add Reactions\n';
            }
            if (message.member.permissions.has('EMBED_LINKS')) {
                  printtext = printtext + 'Embed Links\n';
            }
            if (message.member.permissions.has('ATTACH_FILES')) {
                  printtext = printtext + 'Attach Files\n';
            }
            if (message.member.permissions.has('READ_MESSAGE_HISTORY')) {
                  printtext = printtext + 'Read Message History\n';
            }
            if (message.member.permissions.has('MENTION_EVERYONE')) {
                  printtext = printtext + 'Mention @ everyone, @ here and all roles\n';
            }
            if (message.member.permissions.has('USE_EXTERNAL_EMOJIS')) {
                  printtext = printtext + 'Use External Emojis\n';
            }
            if (message.member.permissions.has('CONNECT')) {
                  printtext = printtext + 'Connect to Channels\n';
            }
            if (message.member.permissions.has('SPEAK')) {
                  printtext = printtext + 'Speak in Channels\n';
            }
            if (message.member.permissions.has('MUTE_MEMBERS')) {
                  printtext = printtext + 'Voice Mute\n';
            }
            if (message.member.permissions.has('DEAFEN_MEMBERS')) {
                  printtext = printtext + 'Voice Deafen\n';
            }
            if (message.member.permissions.has('MOVE_MEMBERS')) {
                  printtext = printtext + 'Voice Drag and Disconnect\n';
            }
            if (message.member.permissions.has('CHANGE_NICKNAME')) {
                  printtext = printtext + 'Rename Self\n';
            }
            if (message.member.permissions.has('MANAGE_NICKNAMES')) {
                  printtext = printtext + 'Rename Others\n';
            }
            if (message.member.permissions.has('MANAGE_WEBHOOKS')) {
                  printtext = printtext + 'Manage WebHooks\n';
            }
            if (message.member.permissions.has('MANAGE_EMOJIS')) {
                  printtext = printtext + 'Manage Emojis';
            }
            const permsembed = new Discord.MessageEmbed()
                  .setTitle('List of permissions that are set to true.')
                  .setDescription(printtext)
                  .setTimestamp()
            return message.channel.send(permsembed)
      }
}
async function bot_perms(message, userstatus, Discord) {
      if (userstatus == 1) {
            let printtext = '';
            if (message.guild.me.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('I have administrator permissions.')
            }
            if (message.guild.me.permissions.has('BAN_MEMBERS')) {
                  printtext = printtext + 'Ban\n';
            }
            if (message.guild.me.permissions.has('KICK_MEMBERS')) {
                  printtext = printtext + 'Kick\n';
            }
            if (message.guild.me.permissions.has('MANAGE_CHANNELS')) {
                  printtext = printtext + 'Manage Channels\n';
            }
            if (message.guild.me.permissions.has('MANAGE_GUILD')) {
                  printtext = printtext + 'Manage Server\n';
            }
            if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                  printtext = printtext + 'Manage Messages\n';
            }
            if (message.guild.me.permissions.has('MANAGE_ROLES')) {
                  printtext = printtext + 'Manage Roles\n';
            }
            if (message.guild.me.permissions.has('CREATE_INSTANT_INVITE')) {
                  printtext = printtext + 'Create Invites\n';
            }
            if (message.guild.me.permissions.has('SEND_MESSAGES')) {
                  printtext = printtext + 'Send Messages\n';
            }
            if (message.guild.me.permissions.has('VIEW_AUDIT_LOG')) {
                  printtext = printtext + 'View Audit Log\n';
            }
            if (message.guild.me.permissions.has('ADD_REACTIONS')) {
                  printtext = printtext + 'Add Reactions\n';
            }
            if (message.guild.me.permissions.has('EMBED_LINKS')) {
                  printtext = printtext + 'Embed Links\n';
            }
            if (message.guild.me.permissions.has('ATTACH_FILES')) {
                  printtext = printtext + 'Attach Files\n';
            }
            if (message.guild.me.permissions.has('READ_MESSAGE_HISTORY')) {
                  printtext = printtext + 'Read Message History\n';
            }
            if (message.guild.me.permissions.has('MENTION_EVERYONE')) {
                  printtext = printtext + 'Mention @ everyone, @ here and all roles\n';
            }
            if (message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
                  printtext = printtext + 'Use External Emojis\n';
            }
            if (message.guild.me.permissions.has('CONNECT')) {
                  printtext = printtext + 'Connect to Channels\n';
            }
            if (message.guild.me.permissions.has('SPEAK')) {
                  printtext = printtext + 'Speak in Channels\n';
            }
            if (message.guild.me.permissions.has('MUTE_MEMBERS')) {
                  printtext = printtext + 'Voice Mute\n';
            }
            if (message.guild.me.permissions.has('DEAFEN_MEMBERS')) {
                  printtext = printtext + 'Voice Deafen\n';
            }
            if (message.guild.me.permissions.has('MOVE_MEMBERS')) {
                  printtext = printtext + 'Voice Drag and Disconnect\n';
            }
            if (message.guild.me.permissions.has('CHANGE_NICKNAME')) {
                  printtext = printtext + 'Rename Self\n';
            }
            if (message.guild.me.permissions.has('MANAGE_NICKNAMES')) {
                  printtext = printtext + 'Rename Others\n';
            }
            if (message.guild.me.permissions.has('MANAGE_WEBHOOKS')) {
                  printtext = printtext + 'Manage WebHooks\n';
            }
            if (message.guild.me.permissions.has('MANAGE_EMOJIS')) {
                  printtext = printtext + 'Manage Emojis';
            }
            const permsembed = new Discord.MessageEmbed()
                  .setTitle('List of permissions that are set to true.')
                  .setDescription(printtext)
                  .setTimestamp()
            return message.channel.send(permsembed)
      }
}
async function youare(message, args, userstatus) {
      if (message.guild.id == '942731536770428938') {
            const kamrole = message.guild.roles.cache.get('951030382919299072')
            if (!kamrole) return message.channel.send('No kamrole found')
            if (userstatus !== 1) {
                  if (!message.member.roles.cache.has('951030382919299072')) return message.channel.send('You must have the kamukura role to identify people.')
            }
            if (!args[0]) return message.channel.send('add ping `sm_youare @user`')
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.channel.send('no member')
            const unknrole = message.guild.roles.cache.get('948788992961306695')
            message.channel.send(`Hello ${member}!`)
            setTimeout(() => {
                  member.roles.remove(unknrole)
                  let query = `INSERT INTO chercordver (userid, username, serverid) VALUES (?, ?, ?)`;
                  let data = [member.id, member.user.username, message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error) {
                              return console.log(error)
                        }
                        return
                  })
            }, 2000);
      } else if (message.guild.id == '806532573042966528') {
            const queenrole = message.guild.roles.cache.get('806533084442263552')
            const adminrole = message.guild.roles.cache.get('933455230950080642')
            const unvrole = message.guild.roles.cache.get('922514880102277161')
            if (!queenrole || !adminrole || !unvrole) return message.channel.send('Either the Queen bitchass, the Admin role or the unverified role has been removed therefor the permissions for this command have been changed and the command cannot be used properly.')
            if (userstatus !== 1) {
                  if (!message.member.roles.cache.has('806533084442263552') && !message.member.roles.cache.has('933455230950080642') && !userstatus == 1) return message.channel.send('You must have the kamukura role to identify people.')
            }
            if (!args[0]) return message.channel.send('Add a member. Usage: `sm_youare @user`')
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.channel.send('Invalid member.')
            message.channel.send(`Hello ${member}!`)
            setTimeout(() => {
                  member.roles.remove(unvrole)
                  let query = `INSERT INTO chercordver (userid, username, serverid) VALUES (?, ?, ?)`;
                  let data = [member.id, member.user.username, message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error) {
                              return console.log(error)
                        }
                        return
                  })
            }, 2000);
      }
}
async function chercord_role(message, args) {
      if (message.guild.id !== '942731536770428938' && message.guild.id !== '806532573042966528' && message.guild.id !== '980786048210718770') return message.channel.send('This command is intended for a private server only.')
      if (message.guild.id == '806532573042966528') {
            let boosterrole = message.guild.roles.cache.get('907043792648032347')
            if (!boosterrole) return message.channel.send('Could not find booster role.')
            if (message.guild.id !== '980786048210718770')
                  if (!message.member.roles.cache.has('907043792648032347') && !message.member.roles.cache.has('933455230950080642') && !message.member.roles.cache.has('806533084442263552') && !userstatus == 1) return message.channel.send('The ability to edit & create your own role is for server boosters only.')
      }
      if (!args[0]) {
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, async function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        let blossomrole = null;
                        if (message.guild.id == '942731536770428938') {
                              blossomrole = message.guild.roles.cache.get('942791591725252658')
                        } else if (message.guild.id == '806532573042966528') {
                              blossomrole = message.guild.roles.cache.get('907043792648032347')
                        }
                        if (message.guild.id !== '980786048210718770') {
                              if (!blossomrole) message.channel.send('Could not find the blossom role if this is cherry cord or the server booster role if this is rainy, this is fatal to the command.')
                              let newrole = await message.guild.roles.create({
                                    name: message.author.tag,
                                    position: blossomrole + 1,
                              }).catch(err => {
                                    console.log(err);
                                    message.channel.send('Failed to create a role.');
                              });
                              message.guild.members.cache.get(message.author.id).roles.add(newrole)
                              query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                              data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) {
                                          console.log('backend error for checking active bans')
                                          return console.log(error)
                                    }
                                    message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                              })
                        } else {
                              let newrole = await message.guild.roles.create({
                                    name: message.author.tag,
                              }).catch(err => {
                                    console.log(err);
                                    message.channel.send('Failed to create a role.');
                              });
                              message.guild.members.cache.get(message.author.id).roles.add(newrole)
                              query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                              data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) {
                                          console.log('backend error for checking active bans')
                                          return console.log(error)
                                    }
                                    message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                              })
                        }
                  } else {
                        for (row of results) {
                              let oldroleid = row["roleid"];
                              let oldrole = message.guild.roles.cache.get(oldroleid)
                              if (oldrole) {
                                    message.member.roles.add(oldrole)
                                    message.channel.send('You already have a role! You have been given it back, try not lose it again!')
                              } else {
                                    let filter = m => m.author.id === message.author.id;
                                    message.channel.send(`Your role seems to have been deleted, would you like a new one to be made? \`y\`/\`n\``).then(() => {
                                          message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message => {
                                                message = message.first();
                                                if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                                      query = `DELETE FROM chercordrole WHERE userid = ? && serverid = ?`;
                                                      data = [message.author.id, message.guild.id]
                                                      connection.query(query, data, async function (error, results, fields) {
                                                            if (error) {
                                                                  console.log('backend error for checking active bans')
                                                                  return console.log(error)
                                                            }
                                                      })
                                                      if (message.guild.id !== '980786048210718770') {
                                                            if (!blossomrole) message.channel.send('Could not find the blossom role if this is cherry cord or the server booster role if this is rainy, this is fatal to the command.')
                                                            let newrole = await message.guild.roles.create({
                                                                  name: message.author.tag,
                                                                  position: blossomrole + 1,
                                                            }).catch(err => {
                                                                  console.log(err);
                                                                  message.channel.send('Failed to create a role.');
                                                            });
                                                            message.guild.members.cache.get(message.author.id).roles.add(newrole)
                                                            query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                                                            data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                                                            connection.query(query, data, function (error, results, fields) {
                                                                  if (error) {
                                                                        console.log('backend error for checking active bans')
                                                                        return console.log(error)
                                                                  }
                                                                  message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                                                            })
                                                      } else {
                                                            let newrole = await message.guild.roles.create({
                                                                  name: message.author.tag,
                                                            }).catch(err => {
                                                                  console.log(err);
                                                                  message.channel.send('Failed to create a role.');
                                                            });
                                                            message.guild.members.cache.get(message.author.id).roles.add(newrole)
                                                            query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                                                            data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                                                            connection.query(query, data, function (error, results, fields) {
                                                                  if (error) {
                                                                        console.log('backend error for checking active bans')
                                                                        return console.log(error)
                                                                  }
                                                                  message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                                                            })
                                                      }
                                                } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                                      message.channel.send('Ok')
                                                } else {
                                                      message.channel.send('Invalid response, `y`/`n` required.')
                                                }
                                          }).catch(collected => {
                                                message.channel.send('Timed out').then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                                          });
                                    });
                              }
                        }
                  }
            })
      } else if (args[0].toLowerCase() === 'color' || args[0].toLowerCase() === 'colour') {
            if (!args[1]) return message.channel.send('might wanna add a color.')
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        message.channel.send('You do not currently have a role. Please make one using `sm_role`!!')
                  } else {
                        for (row of results) {
                              let roleid = row["roleid"]
                              let usersrole = message.guild.roles.cache.get(roleid)
                              if (!usersrole) return message.channel.send('It seems like you have a role but it was deleted. Use `sm_role` to generate a new one.')
                              if (args[1].startsWith('#')) {
                                    if (args[1] === '#FFC2CC') return message.channel.send('Sorry, that is the only color which I wont allow.')
                                    usersrole.edit({ color: args[1] }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'green') {
                                    usersrole.edit({ color: '#00FF00' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'red') {
                                    usersrole.edit({ color: '#FF0000' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'blue') {
                                    usersrole.edit({ color: '#0000FF' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'brown') {
                                    usersrole.edit({ color: '#964B00' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'pink') {
                                    usersrole.edit({ color: '#FFC0CB' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'lightblue') {
                                    usersrole.edit({ color: '#ADD8E6' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'lightgreen') {
                                    usersrole.edit({ color: '#90ee90' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'orange') {
                                    usersrole.edit({ color: '#FFA500' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'purple') {
                                    usersrole.edit({ color: '#A020F0' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              }
                        }
                  }
            })
      } else if (args[0].toLowerCase() === 'name') {
            if (!args[1]) return message.channel.send('might wanna add a name.')
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        message.channel.send('You do not currently have a role. Please make one using `sm_role`!!')
                  } else {
                        for (row of results) {
                              let roleid = row["roleid"]
                              let usersrole = message.guild.roles.cache.get(roleid)
                              if (!usersrole) return message.channel.send('It seems like you have a role but it was deleted. Use `sm_role` to generate a new one.')
                              usersrole.edit({ name: args.slice(1).join(" ") }).catch(err => { console.log(err) })
                              message.channel.send('Role name edited.')
                        }
                  }
            })
      }
}
async function chat_crawler(message, userstatus, client) {
      if (userstatus == 1) {
            const confmessage = await message.channel.send('OK, this will take ages.')
            let messagesincache = []
            const options = { limit: 100 };
            options.before = message.id;
            await message.channel.messages.fetch(options).then(messages => {
                  messages.forEach(message2 => {
                        messagesincache.push(message2)
                  });
            })
            confmessage.edit('deleteing...')
            for (i = 0; i <= messagesincache.length; i = i + 1) {
                  setTimeout(() => {
                        if (!messagesincache[0]) return confmessage.edit('done')
                        message.channel.messages.delete(messagesincache[0]).catch(err => { console.log(err) })
                        messagesincache.shift()
                  }, i + 1 * 1000);
            }
      }
}
/* User error embed for cmds
                          const bannedembed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('RED')
                              .setDescription(`Invalid member argurment.\n\nProper useage is:\n`mute <member>``)
                        message.channel.send(bannedembed)
                        */
async function delete_message(message, args, client, userstatus) {
      if (userstatus == 1) {
            if (!args[0]) return message.author.send('add a message link idiot')
            let channel = client.channels.cache.get(args[0].slice(48, -19))
            if (!channel) return message.author.send('could not find that channel, invalid link or the bot isnt in that server')
            let message2 = await channel.messages.fetch(args[0].slice(67));
            if (!message2) return message.author.send('could not find that message, channel was found though')
            message.react('✅').catch(err => { console.log(err) });
            message2.delete().catch(err => {
                  console.log(err);
                  message.author.send('could not delete the message, it was found though');
            })
      }
}
async function ghost_join(message, userstatus, client) {
      if (userstatus == 1 || message.author.id == '770117907412811817') {
            const newmember = message.mentions.members.first()
            if (!newmember) return
            let katcordgen = client.channels.cache.get('806532573042966530');
            if (!katcordgen) return console.log('kat cord general not found');
            let welcomemessages = [`welcome to rainy day kat-fe ${newmember}! <@&933185109094465547>`];
            let rating = Math.floor(Math.random() * welcomemessages.length);
            katcordgen.send(welcomemessages[rating]).catch(err => { console.log(err) });
      }
}
async function drag_user(message, args, userstatus, Discord) {
      if (userstatus == 1) {
            if (!message.guild.me.permissions.has('ADMINISTRATOR')) return message.author.send('I dont have admin perms in that server');
            if (!args[0]) return message.author.send('Usage: sm_drag <channel> <user|vc>');

            let channel = message.guild.channels.cache.get(args[0].slice(2, -1)) || message.guild.channels.cache.get(args[0]);
            let possiblechannels = [];
            if (!channel) {
                  message.guild.channels.cache.forEach(channel => {
                        if (channel.type === 'voice') {
                              if (channel.name.toLowerCase().includes(args[0].toLowerCase())) {
                                    possiblechannels.push(`#${possiblechannels.length} ${channel.name}`)
                              }
                        }
                  })
                  if (!possiblechannels[0]) {
                        return message.author.send('Could not find a channel with that name or a channel that has that in its name.')
                  }
                  if (!possiblechannels[1]) {
                        let channel2 = message.guild.channels.cache.find(channel => channel.name === possiblechannels[0].slice(3));
                        if (!channel2 || channel2.type === 'text' || channel2.type === 'category' || channel2.type === 'dm') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                        if (!args[1]) {
                              message.member.voice.setChannel(channel2).catch(err => { console.log(err) });
                        } else if (args[1].toLowerCase() === 'vc') {
                              message.member.voice.channel.members.forEach(member => {
                                    if (member.voice.channel) {
                                          member.voice.setChannel(channel2).catch(err => { console.log(err) })
                                    }
                              })
                              return
                        } else {
                              args.forEach(singlearg => {
                                    let member = message.guild.members.cache.get(singlearg.slice(3, -1)) || message.guild.members.cache.get(singlearg) || message.guild.members.cache.get(singlearg.slice(2, -1));
                                    if (member) {
                                          member.voice.setChannel(channel2).catch(err => { console.log(err) });
                                    }
                              })
                        }
                        return
                  }
                  if (possiblechannels.length > 9) message.channel.send('To many possible channels from that name, use a more definitive string.')
                  const helpembed = new Discord.MessageEmbed()
                        .setTitle('Which of these channels did you mean? Please type out the corrosponding number.')
                        .setDescription(possiblechannels)
                        .setFooter('Hi Jan')
                        .setColor('BLUE')
                  let filter = m => m.author.id === message.author.id;
                  await message.channel.send({ embeds: [helpembed] }).then(confmessage => {
                        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                              message2 = message2.first();
                              message2.delete().catch(err => { })
                              confmessage.delete().catch(err => { })
                              if (isNaN(message2.content)) return message2.channel.send('Failed, you are supposed to pick one of the channels #-numbers.')
                              if (message2.content >= possiblechannels.length) return message2.channel.send('Failed, that number isnt on the list.')
                              let channel2 = message2.guild.channels.cache.find(channel => channel.name === possiblechannels[message2.content].slice(3));
                              if (!channel2 || channel2.type === 'text' || channel2.type === 'category' || channel2.type === 'dm') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                              if (!args[1]) {
                                    message2.member.voice.setChannel(channel2).catch(err => { console.log(err) });
                              } else if (args[1].toLowerCase() === 'vc') {
                                    message2.member.voice.channel.members.forEach(member => {
                                          if (member.voice.channel) {
                                                member.voice.setChannel(channel2).catch(err => { console.log(err) })
                                          }
                                    })
                                    return
                              } else {
                                    args.forEach(singlearg => {
                                          let member = message2.guild.members.cache.get(singlearg.slice(3, -1)) || message.guild.members.cache.get(singlearg) || message.guild.members.cache.get(singlearg.slice(2, -1));
                                          if (member) {
                                                member.voice.setChannel(channel2).catch(err => { console.log(err) });
                                          }
                                    })
                              }
                              return
                        }).catch(collected => {
                              console.log(collected)
                              return message.channel.send('Timed out').catch(err => { console.log(err) })
                        });
                  });
            } else {
                  if (channel.type === 'text' || channel.type === 'category' || channel.type === 'dm') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                  if (!args[1]) {
                        message.member.voice.setChannel(channel).catch(err => { console.log(err) });
                  } else if (args[1].toLowerCase() === 'vc') {
                        message.member.voice.channel.members.forEach(member => {
                              if (member.voice.channel) {
                                    member.voice.setChannel(channel).catch(err => { console.log(err) })
                              }
                        })
                        return
                  } else {
                        args.forEach(singlearg => {
                              let member = message.guild.members.cache.get(singlearg.slice(3, -1)) || message.guild.members.cache.get(singlearg) || message.guild.members.cache.get(singlearg.slice(2, -1));
                              if (member) {
                                    member.voice.setChannel(channel).catch(err => { console.log(err) });
                              }
                        })
                  }
            }
      }
}
async function message_length(message) {
      return message.channel.send(`${message.content.length - 8}`).catch(err => { console.log(err) })
}
async function mass_message(message, args, userstatus) {
      if (userstatus == 1) {
            if (message.author.id == '493201183297634305') {
                  return message.member.kick().catch(err => {
                        console.log(err)
                        message.author.send('Failed to kick')
                        return
                  })
            }
            if (!args[0]) return message.channel.send('U must add an arg')
            let content = args.slice(0).join(" ");
            if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
            if (message.guild.id == '750558849475280916' || message.guild.id == '698722297229344928') {
                  message.guild.channels.cache.forEach(async (channel, id) => {
                        if (channel.type === 'text') {
                              channel.send(content).then(message => { message.delete() })
                        }
                  })

            }
            for (i = 0; i <= 10; i = i + 1) {
                  let channel = await message.guild.channels.create('poo', { type: "text", })
                  setTimeout(() => {
                        channel.delete()
                  }, 10000);
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
                  channel.send(content)
            }
      }
}
async function application_respond(message, args, userstatus, client) {
      if (userstatus == 1) {
            let query = `SELECT * FROM applications WHERE id = ?`;
            let data = [args[0]]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) return message.channel.send("that application does not exist yet")
                  for (row of results) {
                        if (row["status"] === 'deny' || row["status"] === 'accept') return message.channel.send('This app has already been responded to')
                        let user = client.users.cache.get(row["userid"])
                        let type = row["type"]
                        let serverid = row["serverid"]
                        let response = args[1].toLowerCase()
                        if (!response === 'accept' && !response === 'deny' && !response === 'pending') return message.channel.send('Usage is `sm_apprespond accept/deny/pending message')
                        if (!user) message.channel.send('User no longer shares any servers with the bot but response saved in db.')
                        if (user) {
                              if (response === 'pending') {
                                    if (args[2]) {
                                          user.send(`Your ${type} application has been set to ${args[1]}\nYou have been left this reason:\n"${args.slice(2).join(" ")}"`).catch(err => { message.channel.send('Was not able to send messages: recever has setting set to no pms') })
                                          message.channel.send('response sent')
                                    } else {
                                          user.send(`Your ${type} application has been set to ${args[1]}`).catch(err => { message.channel.send('Was not able to send messages: recever has setting set to no pms') })
                                          message.channel.send('response sent')
                                    }
                              } else {
                                    if (args[2]) {
                                          user.send(`Your ${type} application has been set to ${args[1]}ed\nYou have been left this reason:\n"${args.slice(2).join(" ")}"`).catch(err => { message.channel.send('Was not able to send messages: recever has setting set to no pms') })
                                          message.channel.send('response sent')
                                    } else {
                                          user.send(`Your ${type} application has been set to ${args[1]}ed`).catch(err => { message.channel.send('Was not able to send messages: recever has setting set to no pms') })
                                          message.channel.send('response sent')
                                    }
                              }

                        }
                        let query = "UPDATE applications SET status = ? WHERE userid = ? && serverid = ? && type = ? && status = ?";
                        let data = [args[1], user.id, serverid, 'raid', 'pending']
                        connection.query(query, data, function (error, results, fields) {
                              if (error) {
                                    message.channel.send('error updating row')
                                    return console.log(error)
                              }

                        })
                  }
            })
      }
}
async function server_wide_purge(message, args, userstatus) {
      if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
      const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })
      let hasperms = true;
      if (!message.member.permissions.has('MANAGE_CHANNELS')) { hasperms = 'server'; }
      if (message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) { hasperms = true; }
      if (userstatus == 1) { hasperms = true; }
      if (hasperms === true) {
            let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.channel.send('Please mention a member so the bot knows whos messages to delete')
            let amountcached = 0;
            await message.guild.channels.cache.forEach(async (channel, id) => {
                  if (channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES') && channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL') && channel.permissionsFor(message.guild.me).has('READ_MESSAGES') && channel.permissionsFor(message.guild.me).has('READ_MESSAGE_HISTORY')) {
                        await channel.messages.fetch({ limit: 100 }).then(messages => {
                              let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
                              let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
                              let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
                              messages.forEach(async (message2) => {
                                    totalmessages = totalmessages + 1;
                                    let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                    if (messagetime.length > 10) {
                                          messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                    }
                                    const messageage = currenttime - messagetime // how old the message is in seconds
                                    if (messageage <= 86400) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins (1 min before a fortnight old) will not be deleted.
                                          if (message2.author.id == member.id) {
                                                messagesincache.push(message2)
                                                amountcached = amountcached + 1;
                                          }
                                    } else {
                                          amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                    }
                              })
                              channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
                                    console.log(err);
                                    return
                              })
                        })
                  }
            })
            conformationmessage.edit(`${message.author}, Compleat. All recent messages from this user in channels ozaibot has access to will be removed.`).catch(err => { console.log(err) });


      } else {
            conformationmessage.edit('You do not have access to this command.').catch(err => { console.log(err) });
      }

}
async function next_bump(message) {
      let foundtruebump = false;
      await message.channel.messages.fetch({ limit: 50 }).then(messages => {
            messages.forEach(async (message) => {
                  message.embeds.forEach((embed) => {
                        if (foundtruebump === false) {
                              if (embed.description.includes('Bump done! :thumbsup:\n')) {
                                    foundtruebump = true;
                                    console.log('successful bump found, stopping...')
                                    convertSnowflakeToDate(message.id, DISCORD_EPOCH)
                                    let timeleftsecs = (`${nextbumptime - currenttime}`)
                                    if (!timeleftsecs.includes('-')) {
                                          timeleftmins = (`${timeleftsecs / 60}`).split(".")
                                          message.channel.send(`The last bump was at <t:${lastbumptime}>. The next bump will be possible at <t:${nextbumptime}> which is in ${timeleftmins[0]} mins / ${timeleftsecs} seconds.`)
                                    } else {
                                          message.channel.send(`The last bump was at <t:${lastbumptime}>. The next bump is possible now.`)
                                    }
                                    return
                              }
                        }
                  })
            })
      })
      if (foundtruebump === false) {
            message.channel.send('No bump found in the last 50 messages.')
      }
}
async function current_time(message) {
      const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
      message.channel.send(`${currenttime}, <t:${currenttime}>, <t:${currenttime}:R>`)
}
async function repeat_message(message, args, userstatus) {
      if (userstatus == 1) {
            if (!args[1]) return
            if (isNaN(args[0])) return
            const howmany = Number(args[0])
            let howmanysent = 0;
            let messagestogo = true;
            let content = args.slice(1).join(" ");
            while (messagestogo) {
                  await message.channel.send(`message #${howmanysent + 1}: ${content}`)
                  howmanysent = howmanysent + 1;
                  if (howmanysent >= howmany) {
                        messagestogo = false;
                        return
                  }
            }
      }
}
