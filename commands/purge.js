const { unix } = require("moment");
const imissjansomuchithurts = 1420070400000
const mysql = require('mysql2');
const { GetDatabasePassword } = require('../hotshit')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: GetDatabasePassword(),
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: 'purge',
    aliases: ['clear', 'prune'],
    description: 'Deletes messages in bulk',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })
        if (!userstatus == 1) {
            if (!message.member.permissionsIn(message.channel).has("MANAGE_MESSAGES")) {
                console.log('You do not have permissions to use this command')
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setColor(15684432)
                    .setDescription(`You do not hvae the permissions required to use this command.`)
                return conformationmessage.edit({ embeds: [errorembed] })
            }
        }
        if (!message.guild.me.permissionsIn(message.channel).has("MANAGE_MESSAGES")) {
            conformationmessage.edit('Ozaibot does not have permissions to delete messages in this channel.')
        }
        let amount = args[0]
        if (!amount) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge\``).catch(err => { console.log(err) });
        if (isNaN(amount)) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
        if (amount <= 0) return conformationmessage.edit(`${message.author}, You cannot delete less than 1 message.`).catch(err => { console.log(err) });
        if (amount > 1000) return conformationmessage.edit(`${message.author}, You cannot delete more than 1000 messages.`).catch(err => { console.log(err) });
        if (isNaN(args[0]) || !args[0]) return conformationmessage.edit('Usage: `sm_purge <amount> <options>`')
        let members = [];
        let silent = false;
        let haslinks = false;
        let hasinvites = false;
        let hasbots = false;
        let hasembeds = false;
        let hasfiles = false;
        let hasusers = false;
        let hasimages = false;
        let haspins = false;
        let hasmentions = false;
        let silentonly = false;
        let membersonly = false;
        let hasstickers = false;
        if (args[1]) {
            args.forEach(async arg => {
                if (arg.toLowerCase() === 'silent') {
                    silent = true;
                    message.delete().catch(err => { console.log(err) })
                } if (arg.toLowerCase() === 'links') {
                    haslinks = true
                } if (arg.toLowerCase() === 'invites') {
                    hasinvites = true
                } if (arg.toLowerCase() === 'bots') {
                    hasbots = true
                } if (arg.toLowerCase() === 'embeds') {
                    hasembeds = true;
                } if (arg.toLowerCase() === 'files') {
                    hasfiles = true
                } if (arg.toLowerCase() === 'users') {
                    hasusers = true
                } if (arg.toLowerCase() === 'images') {
                    hasimages = true
                } if (arg.toLowerCase() === 'pins') {
                    haspins = true
                } if (arg.toLowerCase() === 'mentions') {
                    hasmentions = true
                } if (arg.toLowerCase() === 'stickers') {
                    hasstickers = true
                }
                let member2 = message.guild.members.cache.get(arg.slice(3, -1)) || message.guild.members.cache.get(arg) || message.guild.members.cache.get(arg.slice(2, -1));
                if (member2) {
                    members.push(member2);
                }
            })
            if (!members[0]) {
                members = false;
            }
            if (silent && !members && !haslinks && !hasinvites && !hasbots && !hasembeds && !hasfiles && !hasfiles && !hasimages && !haspins && !hasmentions && !hasstickers) {
                silentonly = true
            }
            if (members && !haslinks && !hasinvites && !hasbots && !hasembeds && !hasfiles && !hasusers && !hasimages && !haspins && !hasmentions && !hasstickers) {
                membersonly = true
            }
            if (amount > 100) {
                if (silent) {
                    setTimeout(() => {
                        conformationmessage.delete().catch(err => { console.log(err) });
                    }, 10000);
                }
                return ExecuteLargeBulkDeleteWithOptions(message, amount, conformationmessage, members, silent, haslinks, hasinvites, hasbots, hasembeds, hasfiles, hasusers, hasimages, hasmentions, haspins, silentonly, membersonly, hasstickers)
            } else {
                if (silent) {
                    setTimeout(() => {
                        conformationmessage.delete().catch(err => { console.log(err) });
                    }, 5000);
                }
                return ExecuteBulkDeleteWithOptions(message, amount, conformationmessage, members, silent, haslinks, hasinvites, hasbots, hasembeds, hasfiles, hasusers, hasimages, hasmentions, haspins, silentonly, membersonly, hasstickers)
            }
        } else {
            if (amount > 100) {
                if (amount < 200) return ExecuteLargeBulkDelete(message, amount, conformationmessage)
                let filter = m => m.author.id === message.author.id;
                await conformationmessage.edit(`Are you sure you want to delete ${amount} messages? \`Y\` / \`N\``).then(async () => {
                    await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                        message2 = message2.first();
                        message2.delete().catch(err => { });
                        if (message2.content.toLowerCase().startsWith('cancel') || message2.content.toLowerCase().startsWith('n')) return conformationmessage.edit('Cancelled.')
                        else if (message2.content.toLowerCase() === 'y' || message2.content.toLowerCase() === 'yes') {
                            return ExecuteLargeBulkDelete(message, amount, conformationmessage)
                        }
                        else return conformationmessage.edit('Cancelled.')
                    }).catch(collected => {
                        console.log(collected);
                        message.channel.send('Timed out.').catch(err => { console.log(err) });
                        return
                    });
                });
            } else {
                return ExecuteBulkDelete(message, amount, conformationmessage)
            }
        }
    }
}

async function ExecuteBulkDeleteWithOptions(message, amount, conformationmessage, members, HasLinks, HasInvites, HasBots, HasEmbeds, HasFiles, HasUsers, HasImages, HasMentions, Includepins, silentonly, membersonly, hasstickers) {
    let amountcached = 0;
    const options = { limit: amount };
    options.before = message.id;
    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
    await message.channel.messages.fetch(options).then(messages => {
        let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
        let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
        messages.forEach(async (message2) => {
            if (message2.pinned && !membersonly) {
                if (Includepins) {
                    let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                    if (messagetime.length > 10) {
                        messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                    }
                    const messageage = currenttime - messagetime // how old the message is in seconds
                    if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                        messagesincache.push(message2)
                        amountcached = amountcached + 1;
                    } else {
                        amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                    }
                }
            } else {
                if (silentonly) {
                    let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                    if (messagetime.length > 10) {
                        messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                    }
                    const messageage = currenttime - messagetime // how old the message is in seconds
                    if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                        messagesincache.push(message2)
                        amountcached = amountcached + 1;
                    } else {
                        amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                    }
                }
                if (members) {
                    members.forEach(member => {
                        if (message2.author.id == member.id) {
                            if (membersonly) {
                                let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                if (messagetime.length > 10) {
                                    messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                }
                                const messageage = currenttime - messagetime // how old the message is in seconds
                                if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                    messagesincache.push(message2)
                                    amountcached = amountcached + 1;
                                } else {
                                    amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                }
                            } else {
                                if (HasLinks) {
                                    let message2content = message2.content.toLowerCase()
                                    if (message2content.includes('http:/') || message2content.includes('www.') || message2content.includes('.com') || message2content.includes('https:/')) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasInvites) {
                                    if (message2.content.toLowerCase().includes('discord.gg/')) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasBots) {
                                    if (message2.author.bot) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasEmbeds) {
                                    if (message2.embeds.length > 0) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasFiles) {
                                    if (message2.attachments) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasUsers) {
                                    if (!message2.author.bot) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (HasImages) {
                                    if (message2.attachments) {
                                        message2.attachments.forEach(attachment => {
                                            if (!messagesincache.includes(message2)) {
                                                if (attachment.contentType) {
                                                    if (attachment.contentType.startsWith('image')) {
                                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                                        if (messagetime.length > 10) {
                                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                                        }
                                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                                            messagesincache.push(message2)
                                                            amountcached = amountcached + 1;
                                                        } else {
                                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                                if (HasMentions) {
                                    if (message.mentions) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                                if (hasstickers) {
                                    if (message2.stickers.size > 0) {
                                        let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                        if (messagetime.length > 10) {
                                            messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                        }
                                        const messageage = currenttime - messagetime // how old the message is in seconds
                                        if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                            messagesincache.push(message2)
                                            amountcached = amountcached + 1;
                                        } else {
                                            amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                        }
                                    }
                                }
                            }
                        }
                    })
                } else {
                    if (HasSilent && !silentonly) {
                        message.delete().catch(err => { console.log(err) });
                        setTimeout(() => {
                            conformationmessage.delete().catch(err => { console.log(err) });
                        }, 5000);
                    }
                    if (HasLinks) {
                        let message2content = message2.content.toLowerCase()
                        if (message2content.includes('http:/') || message2content.includes('www.') || message2content.includes('.com') || message2content.includes('https:/')) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasInvites) {
                        if (message2.content.toLowerCase().includes('discord.gg/')) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasBots) {
                        if (message2.author.bot) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasEmbeds) {
                        if (message2.embeds.length > 0) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasFiles) {
                        if (message2.attatchments) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasUsers) {
                        if (!message2.author.bot) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (HasImages) {
                        if (message2.attachments) {
                            message2.attachments.forEach(attachment => {
                                if (!messagesincache.includes(message2)) {
                                    if (attachment.contentType) {
                                        if (attachment.contentType.startsWith('image')) {
                                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                            if (messagetime.length > 10) {
                                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                            }
                                            const messageage = currenttime - messagetime // how old the message is in seconds
                                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                                messagesincache.push(message2)
                                                amountcached = amountcached + 1;
                                            } else {
                                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                    if (HasMentions) {
                        if (message2.mentions.members.first()) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                    if (hasstickers) {
                        if (message2.stickers.size > 0) {
                            let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                            if (messagetime.length > 10) {
                                messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                            }
                            const messageage = currenttime - messagetime // how old the message is in seconds
                            if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                messagesincache.push(message2)
                                amountcached = amountcached + 1;
                            } else {
                                amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                            }
                        }
                    }
                }
            }
        })
        message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
            console.log(err);
            message.reply('There was an error deleting the messages.');
            return
        }).then(() => {
            if (amountgreaterthan14days == 0) {
                return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
            } if (amountgreaterthan14days !== 0) {
                return conformationmessage.edit(`Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
            }
        });
    })
}

async function ExecuteBulkDelete(message, amount, conformationmessage) {
    let amountcached = 0;
    const options = { limit: amount };
    options.before = message.id;
    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
    await message.channel.messages.fetch(options).then(messages => {
        let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
        let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
        let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
        messages.forEach(async (message2) => {
            totalmessages = totalmessages + 1;
            if (!message2.pinned) {
                let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                if (messagetime.length > 10) {
                    messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                }
                const messageage = currenttime - messagetime // how old the message is in seconds
                if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                    messagesincache.push(message2)
                    amountcached = amountcached + 1;
                } else {
                    amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                }
            }
        })
        message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
            console.log(err);
            message.reply('There was an error deleting the messages.');
            return
        }).then(() => {
            if (Number(totalmessages) !== amount) {
                if (amountgreaterthan14days == 0) {
                    return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });

                }
                if (amountgreaterthan14days !== 0) {
                    return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
                }
            }
            if (amountgreaterthan14days == 0) {
                return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });

            } if (amountgreaterthan14days !== 0) {
                return conformationmessage.edit(`Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
            }
        });
    })
}

async function ExecuteLargeBulkDeleteWithOptions(message, amount, conformationmessage, members, HasLinks, HasInvites, HasBots, HasEmbeds, HasFiles, HasUsers, HasImages, HasMentions, Includepins, silentonly, membersonly, hasstickers) {
    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
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
                if (message2.pinned && !membersonly) {
                    if (Includepins) {
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
                    }
                } else {
                    if (silentonly) {
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
                    }
                    if (members) {
                        members.forEach(member => {
                            if (message2.author.id == member.id) {
                                if (membersonly) {
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
                                } else {
                                    if (HasSilent && !silentonly) {
                                        message.delete().catch(err => { console.log(err) });
                                        setTimeout(() => {
                                            conformationmessage.delete().catch(err => { console.log(err) });
                                        }, 5000);
                                    }
                                    if (HasLinks) {
                                        let message2content = message2.content.toLowerCase()
                                        if (message2content.includes('http:/') || message2content.includes('www.') || message2content.includes('.com') || message2content.includes('https:/')) {
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
                                        }
                                    }
                                    if (HasInvites) {
                                        if (message2.content.toLowerCase().includes('discord.gg/')) {
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
                                        }
                                    }
                                    if (HasBots) {
                                        if (message2.author.bot) {
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
                                        }
                                    }
                                    if (HasEmbeds) {
                                        if (message2.embeds.length > 0) {
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
                                        }
                                    }
                                    if (HasFiles) {
                                        if (message2.attachments) {
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
                                        }
                                    }
                                    if (HasUsers) {
                                        if (!message2.author.bot) {
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
                                        }
                                    }
                                    if (HasImages) {
                                        if (message2.attachments) {
                                            let imagefound = false;
                                            message2.attachments.forEach(attachment => {
                                                if (imagefound = false) {
                                                    if (attachment.contentType) {
                                                        if (attachment.contentType.startsWith('image')) {
                                                            imagefound = true
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
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                    if (HasMentions) {
                                        if (message.mentions) {
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
                                        }
                                    }
                                    if (hasstickers) {
                                        if (message2.stickers.size > 0) {
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
                                        }
                                    }
                                }
                            }
                        })
                    } else {

                        if (HasLinks) {
                            let message2content = message2.content.toLowerCase()
                            if (message2content.includes('http:/') || message2content.includes('www.') || message2content.includes('.com') || message2content.includes('https:/')) {
                                let messagetime = (`${Number(message2.id / 4194304 + imissjansomuchithurts)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                if (messagetime.length > 10) {
                                    messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                }
                                const messageage = currenttime - messagetime // how old the message is in seconds
                                if (messageage <= 604740) { // is the message older than 2 weeks? any messages 1 min before a fortnight old will not be deleted.
                                    messagesincache.push(message2)
                                    amountcached = amountcached + 1;
                                } else {
                                    amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                }
                            }
                        }
                        if (HasInvites) {
                            if (message2.content.toLowerCase().includes('discord.gg/')) {
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
                            }
                        }
                        if (HasBots) {
                            if (message2.author.bot) {
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
                            }
                        }
                        if (HasEmbeds) {
                            if (message2.embeds.length > 0) {
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
                            }
                        }
                        if (HasFiles) {
                            if (message2.attatchments) {
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
                            }
                        }
                        if (HasUsers) {
                            if (!message2.author.bot) {
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
                            }
                        }
                        if (HasImages) {
                            if (message2.attachments) {
                                let imagefound = false;
                                message2.attachments.forEach(attachment => {
                                    if (imagefound = false) {
                                        if (attachment.contentType) {
                                            if (attachment.contentType.startsWith('image')) {
                                                imagefound = true
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
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        if (HasMentions) {
                            if (message2.mentions.members.first()) {
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
                            }
                        }
                        if (hasstickers) {
                            if (message2.stickers.size > 0) {
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

                            }
                        }
                    }
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
    if (amountgreaterthan14days == 0) {
        return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
    } if (amountgreaterthan14days !== 0) {
        return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
    }
}

async function ExecuteLargeBulkDelete(message, amount, conformationmessage) {
    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
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
    if (Number(totalmessages) !== amount) {
        if (amountgreaterthan14days == 0) {
            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted.`).catch(err => { console.log(err) });
        }
        if (amountgreaterthan14days !== 0) {
            return conformationmessage.edit(`${message.author}, Only ${totalmessages} messages were found, ${amountcached} messages were deleted and ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
        }
    }
    if (amountgreaterthan14days == 0) {
        return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages.`).catch(err => { console.log(err) });
    } if (amountgreaterthan14days !== 0) {
        return conformationmessage.edit(`${message.author}, Deleted ${amountcached} messages, ${amountgreaterthan14days} messages were older than 14 days and could not be deleted.`).catch(err => { console.log(err) });
    }
}