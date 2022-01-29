const { unix } = require("moment");
const DISCORD_EPOCH = 1420070400000
let nextbumptime = '';
let lastbumptime = '';
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
const imissjansomuchithurts = 1420070400000
const convertSnowflakeToDate = (snowflake, epoch = DISCORD_EPOCH) => {
      nextbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      nextbumptime = Number(nextbumptime) + 7200
      lastbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      return
}
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
module.exports = {
      name: 'test',
      aliases: ['nextbump', 'currenttime', 'a', 'clearvent', 'massping', 'massmessage', 'serverpurge', 'apprespond', 'msgl', 'drag', 'ghostjoin', 'deletemessage', 'oldpurgeall'],
      description: 'whatever the fuck i am testing at the time',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'nextbump') return next_bump(message)
            if (cmd === 'currenttime') return current_time(message)
            if (cmd === 'a') return repeat_message(message, args, userstatus)
            if (cmd === 'clearvent') return delete_vent(message, client, Discord)
            if (cmd === 'massping') return mass_message(message, args, userstatus)
            if (cmd === 'serverpurge') return server_wide_purge(message, args, userstatus)
            if (cmd === 'apprespond') return application_respond(message, args, userstatus, client)
            if (cmd === 'msgl') return message_length(message, args)
            if (cmd === 'drag') return drag_user(message, args, userstatus, Discord)
            if (cmd === 'ghostjoin') return ghost_join(message, userstatus, client)
            if (cmd === 'deletemessage') return delete_message(message, args, client, userstatus)
            if (cmd === 'oldpurgeall') return chat_crawler(message, userstatus, client)
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
            for (i = 0; i <= messagesincache.length; i = i + 1) { // loop 100 times
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
            if (!message.guild.me.hasPermission('ADMINISTRATOR')) return message.author.send('I dont have admin perms in that server');
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
                  } else if (!possiblechannels[0]) {
                        return message.author.send('Could not find a channel with that name or a channel that has that in its name.')
                  }
                  if (possiblechannels.length > 9) message.channel.send('To many possible channels from that name, use a more definitive string.')
                  const helpembed = new Discord.MessageEmbed()
                        .setTitle('Which of these channels did you mean? Please type out the corrosponding number.')
                        .setDescription(possiblechannels)
                        .setFooter('Hi Jan')
                        .setColor('BLUE')
                  let filter = m => m.author.id === message.author.id;
                  await message.channel.send(helpembed).then(confmessage => {
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
      return message.channel.send(message.content.length - 8).catch(err => { console.log(err) })
}
async function mass_message(message, args, userstatus) {
      if (userstatus == 1) {
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
      if (!message.member.hasPermission('MANAGE_CHANNELS')) { hasperms = 'server'; }
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
async function delete_vent(message, client, Discord) {
      if (message.guild.id == '912403495993368576') {
            if (message.channel.id == '912530042846871612') {
                  message.delete().catch(err => { console.log(err) })
                  const options = { limit: 100 };
                  options.before = message.id;
                  await message.channel.messages.fetch(options).then(messages => {
                        let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
                        let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
                        let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
                        messages.forEach(async (message2) => {
                              if (message2.author.id == message.author.id) {
                                    totalmessages = totalmessages + 1;
                                    let messagetime = (`${Number(message2.id / 4194304 + DISCORD_EPOCH)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                    if (messagetime.length > 10) {
                                          messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                    }
                                    const messageage = currenttime - messagetime // how old the message is in seconds
                                    if (messageage <= 604740) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins (1 min before a fortnight old) will not be deleted.
                                          messagesincache.push(message2)
                                    } else {
                                          amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                    }
                              }
                        })
                        message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
                              console.log(err);
                              message.reply('There was an error deleting the messages.').catch(err => { console.log(err) })
                              return
                        }).then(() => {
                              message.channel.send('Deleted all of your messages out of the last 100 messages in this channel. Thank you for venting, I hope you are well!').then(message => { message.delete({ timeout: 10000 }).catch(err => { console.log(err) }) }).catch(err => { console.log(err) })
                        })
                  })
            } else return message.channel.send('This command can only be used in <#912530042846871612>.').catch(err => { console.log(err) })
      }


}