const { unix } = require("moment");
const DISCORD_EPOCH = 1420070400000
module.exports = {
      name: 'purge',
      aliases: ['bulkdelete', 'clear', 'delete', 'deletemessages'],
      description: 'Deletes messages in bulk',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })
            let amount = Number(args[0]);
            amount = amount + 2;
            let hasperms = true;
            if (!message.member.hasPermission('MANAGE_CHANNELS')) { hasperms = 'server'; }
            if (message.member.hasPermission('MANAGE_CHANNELS') && !message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) { hasperms = 'channel'; }
            if (message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) { hasperms = true; }
            if (userstatus == 1) { hasperms = true; }
            if (hasperms === true) {
                  let ozaibotperms = false;
                  if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) { ozaibotperms = 'channel'; }
                  } if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) { ozaibotperms = 'server'; }
                  if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                        if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) { ozaibotperms = true; }
                  } if (message.guild.me.hasPermission('MANAGE_MESSAGES')) { ozaibotperms = true; }
                  if (ozaibotperms === true) {
                        let amountcached = 0;
                        if (!amount) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                        if (isNaN(amount)) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
                        if (amount <= 2) return conformationmessage.edit(`${message.author}, You cannot delete 0 or less messages`).catch(err => { console.log(err) });
                        if (amount > 100) return conformationmessage.edit(`${message.author}, You cannot delete more than 98 messages.`).catch(err => { console.log(err) });
                        await message.channel.messages.fetch({ limit: amount }).then(messages => {
                              let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
                              let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
                              let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
                              let currenttime = (`${Number((Date.now(unix)))}`).slice(0, -1).slice(0, -1).slice(0, -1) // what the time currently is, cut off all decimal places so we are at seconds
                              messages.forEach(async (message2) => {
                                    totalmessages = totalmessages + 1;
                                    let messagetime = (`${Number(message2.id / 4194304 + DISCORD_EPOCH)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                    if (messagetime.length > 10) {
                                          messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                    }
                                    if (message2.id !== message.id && message2.id !== conformationmessage.id) {
                                          const messageage = currenttime - messagetime // how old the message is in seconds
                                          if (messageage <= 604740) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins will not be deleted.
                                                messagesincache.push(message2)
                                                amountcached = amountcached + 1;
                                          } else {
                                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                          }
                                    }
                              })
                              totalmessages = totalmessages - 2;
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
                              });
                        })
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