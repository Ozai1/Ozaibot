const { unix } = require("moment");
const imissjansomuchithurts = 1420070400000
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
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
      name: 'purge',
      aliases: ['bulkdelete', 'clear', 'delete'],
      description: 'Deletes messages in bulk',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })
            let hasperms = true;
            if (!message.member.permissions.has('MANAGE_CHANNELS')) { hasperms = 'server'; }
            if (message.member.permissions.has('MANAGE_CHANNELS') && !message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) { hasperms = 'channel'; }
            if (message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) { hasperms = true; }
            if (userstatus == 1) { hasperms = true; }
            if (hasperms === true) {
                  let ozaibotperms = false;
                  if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) { ozaibotperms = 'channel'; }
                  } if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) { ozaibotperms = 'server'; }
                  if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                        if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) { ozaibotperms = true; }
                  } if (message.guild.me.permissions.has('MANAGE_MESSAGES')) { ozaibotperms = true; }
                  if (ozaibotperms === true) {
                        let amount = Number(args[0]);
                        if (amount <= 100) {
                              let amountcached = 0;
                              const options = { limit: amount };
                              options.before = message.id;
                              if (!amount) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                              if (isNaN(amount)) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                              if (amount <= 0) return conformationmessage.edit(`${message.author}, You cannot delete 0 or less messages`).catch(err => { console.log(err) });
                              if (amount > 100) return conformationmessage.edit(`${message.author}, You cannot delete more than 1000 messages.`).catch(err => { console.log(err) });
                              await message.channel.messages.fetch(options).then(messages => {
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
                                          if (messageage <= 604740) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins (1 min before a fortnight old) will not be deleted.
                                                messagesincache.push(message2)
                                                amountcached = amountcached + 1;
                                          } else {
                                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                          }
                                    })
                                    message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
                                          console.log(err);
                                          message.reply('There was an error deleting the messages.');
                                          return
                                    }).then(() => {
                                          if (Number(totalmessages) !== Number(args[0])) {
                                                if (amountgreaterthan14days == 0) {
                                                      if (!args[1]) {
                                                            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });
                                                      }
                                                      if (args[1].toLowerCase() !== 'silent') {
                                                            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });
                                                      }
                                                      if (args[1].toLowerCase() === 'silent') {
                                                            conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`)
                                                            setTimeout(() => {
                                                                  conformationmessage.delete()
                                                                  return message.delete()
                                                            }, 5000);
                                                      }
                                                }
                                                if (amountgreaterthan14days !== 0) {
                                                      if (!args[1]) {
                                                            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                                                      }
                                                      if (args[1].toLowerCase() !== 'silent') {
                                                            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                                                      }
                                                      if (args[1].toLowerCase() === 'silent') {
                                                            conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`)
                                                            setTimeout(() => {
                                                                  conformationmessage.delete()
                                                                  return message.delete()
                                                            }, 5000);
                                                      }
                                                }
                                          }
                                          if (amountgreaterthan14days == 0) {
                                                if (!args[1]) {
                                                      return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
                                                }
                                                if (args[1].toLowerCase() !== 'silent') {
                                                      return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
                                                }
                                                if (args[1].toLowerCase() === 'silent') {
                                                      conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`)
                                                      setTimeout(() => {
                                                            conformationmessage.delete()
                                                            return message.delete()
                                                      }, 5000);
                                                }
                                          } if (amountgreaterthan14days !== 0) {
                                                if (!args[1]) {
                                                      return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                                                }
                                                if (args[1].toLowerCase() !== 'silent') {
                                                      return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                                                }
                                                if (args[1].toLowerCase() === 'silent') {
                                                      conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`)
                                                      setTimeout(() => {
                                                            conformationmessage.delete()
                                                            return message.delete()
                                                      }, 5000);
                                                }
                                          }
                                    });
                              })
                        } else {
                              if (!amount) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                              if (isNaN(amount)) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                              if (amount <= 0) return conformationmessage.edit(`${message.author}, You cannot delete 0 or less messages`).catch(err => { console.log(err) });
                              if (amount > 1000) return conformationmessage.edit(`${message.author}, You cannot delete more than 1000 messages.`).catch(err => { console.log(err) });
                              if (amount >= 200) {
                                    let filter = m => m.author.id === message.author.id;
                                    conformationmessage.edit(`Are you sure you want to delete ${amount} messages? \`Y\` / \`N\``).then(() => {
                                          message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(message3 => {
                                                message3 = message3.first();
                                                message3.delete().catch(err => { })
                                                if (message3.content.toUpperCase() == 'YES' || message3.content.toUpperCase() == 'Y') {
                                                      bulkdelete(message, conformationmessage, amount, args)
                                                } else if (message3.content.toUpperCase() == 'NO' || message3.content.toUpperCase() == 'N') {
                                                      return conformationmessage.edit('Cancelled deleting messages.').catch(err => { console.log(err) });
                                                } else {
                                                      return message3.channel.send(`Cancelled: Invalid Response`).catch(err => { console.log(err) });
                                                }
                                          }).catch(collected => {
                                                return conformationmessage.edit('Cancelled deleting messages.').catch(err => { console.log(err) });
                                          });
                                    });
                              } else {
                                    bulkdelete(message, conformationmessage, amount, args)
                              }
                        }
                  } else {
                        if (ozaibotperms === 'channel') { return conformationmessage.edit(`${message.author}, Ozaibot does not have permissions to delete messages in this channel.`).catch(err => { console.log(err) }) }
                        else if (ozaibotperms === 'server') { return conformationmessage.edit(`${message.author}, Ozaibot does not have permissions to delete messages in this server.`).catch(err => { console.log(err) }) }
                  }
            } else {
                  if (hasperms === 'server') { return conformationmessage.edit(`${message.author}, You do not have permissions to use this command.`).catch(err => { console.log(err) }) }
                  else if (hasperms === 'channel') { return conformationmessage.edit(`${message.author}, You do not have permssions to do this. (Only in this channel, either you or your overriding role has manage channels set to false in this channel's overrides.)`).catch(err => { console.log(err) }) }
            }
      }
}
async function bulkdelete(message, conformationmessage, amount, args) {
      let amountcached = 0;
      let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
      let messagesincache2 = []
      let messagesincache3 = []
      let messagesincache4 = []
      let messagesincache5 = []
      let messagesincache6 = []
      let messagesincache7 = []
      let messagesincache8 = []
      let messagesincache9 = []
      let messagesincache10 = []
      let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
      let totalleft = amount;
      let lastmessagefetchedid
      let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
      let janisamazing = true
      conformationmessage.edit('Fetching....')
      while (janisamazing) {
            let options = null;
            if (totalleft >= 100) {
                  options = { limit: 100 };
            } else {
                  options = { limit: totalleft };
            }
            totalleft = totalleft - options.limit
            if (lastmessagefetchedid) {
                  options.before = lastmessagefetchedid;
            } else {
                  options.before = message.id;
            }
            await message.channel.messages.fetch(options).then(messages => {
                  messages.forEach(async (message2) => {
                        totalmessages = totalmessages + 1;
                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                        if (messagetime.length > 10) {
                              messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                        }
                        const messageage = currenttime - messagetime // how old the message is in seconds
                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins (1 min before a fortnight old) will not be deleted.
                              if (!messagesincache[99]) {
                                    messagesincache.push(message2)
                              } else if (!messagesincache2[99]) {
                                    messagesincache2.push(message2)
                              } else if (!messagesincache3[99]) {
                                    messagesincache3.push(message2)
                              } else if (!messagesincache4[99]) {
                                    messagesincache4.push(message2)
                              } else if (!messagesincache5[99]) {
                                    messagesincache5.push(message2)
                              } else if (!messagesincache6[99]) {
                                    messagesincache6.push(message2)
                              } else if (!messagesincache7[99]) {
                                    messagesincache7.push(message2)
                              } else if (!messagesincache8[99]) {
                                    messagesincache8.push(message2)
                              } else if (!messagesincache9[99]) {
                                    messagesincache9.push(message2)
                              } else if (!messagesincache10[99]) {
                                    messagesincache10.push(message2)
                              }

                              amountcached = amountcached + 1;
                        } else {
                              amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                        }
                  })
                  let gey = messages.last()
                  if (gey) {
                        lastmessagefetchedid = messages.last().id;
                  }
                  if (totalleft == 0) {
                        janisamazing = false;
                  }
            })
      }
      let janisawesome = true
      conformationmessage.edit('Deleting...')
      while (janisawesome) {
            if (messagesincache[0]) {
                  await message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache = []
            } else if (messagesincache2[0]) {
                  await message.channel.bulkDelete(messagesincache2).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache2 = []
            } else if (messagesincache3[0]) {
                  await message.channel.bulkDelete(messagesincache3).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache3 = []
            } else if (messagesincache4[0]) {
                  await message.channel.bulkDelete(messagesincache4).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache4 = []
            } else if (messagesincache5[0]) {
                  await message.channel.bulkDelete(messagesincache5).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache5 = []
            } else if (messagesincache6[0]) {
                  await message.channel.bulkDelete(messagesincache6).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache6 = []
            } else if (messagesincache7[0]) {
                  await message.channel.bulkDelete(messagesincache7).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache7 = []
            } else if (messagesincache8[0]) {
                  await message.channel.bulkDelete(messagesincache8).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache8 = []
            } else if (messagesincache9[0]) {
                  await message.channel.bulkDelete(messagesincache9).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache9 = []
            } else if (messagesincache10[0]) {
                  await message.channel.bulkDelete(messagesincache10).catch(err => { // ngl errors shouldnt happen like ever
                        console.log(err);
                        message.reply('There was an error deleting the messages.');
                        return
                  })
                  messagesincache10 = []
            }
            if (!messagesincache[0] && !messagesincache2[0] && !messagesincache3[0] && !messagesincache4[0] && !messagesincache5[0] && !messagesincache6[0] && !messagesincache7[0] && !messagesincache8[0] && !messagesincache9[0] && !messagesincache10[0]) {
                  janisawesome = false;
            }
      }
      if (Number(totalmessages) !== Number(args[0])) {
            if (amountgreaterthan14days == 0) {
                  if (!args[1]) {
                        return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });
                  }
                  if (args[1].toLowerCase() !== 'silent') {
                        return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });
                  }
                  if (args[1].toLowerCase() === 'silent') {
                        conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) }).then(message => { message.delete({ timeout: 4000 }).catch(err => { console.log(err) }) });
                        return message.delete({ timeout: 2000 }).catch(err => { console.log(err) });
                  }
            }
            if (amountgreaterthan14days !== 0) {
                  if (!args[1]) {
                        return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                  }
                  if (args[1].toLowerCase() !== 'silent') {
                        return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                  }
                  if (args[1].toLowerCase() === 'silent') {
                        conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).then(message => { message.delete({ timeout: 4000 }).catch(err => { console.log(err) }) });
                        return message.delete({ timeout: 2000 }).catch(err => { console.log(err) });
                  }
            }
      }
      if (amountgreaterthan14days == 0) {
            if (!args[1]) {
                  return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
            }
            if (args[1].toLowerCase() !== 'silent') {
                  return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
            }
            if (args[1].toLowerCase() === 'silent') {
                  conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).then(message => { message.delete({ timeout: 2000 }).catch(err => { console.log(err) }) });
                  return message.delete({ timeout: 2000 }).catch(err => { console.log(err) });
            }
      } if (amountgreaterthan14days !== 0) {
            if (!args[1]) {
                  return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
            }
            if (args[1].toLowerCase() !== 'silent') {
                  return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
            }
            if (args[1].toLowerCase() === 'silent') {
                  conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).then(message => { message.delete({ timeout: 2000 }).catch(err => { console.log(err) }) });
                  return message.delete({ timeout: 2000 }).catch(err => { console.log(err) });
            }
      }
}