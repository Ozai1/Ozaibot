const { LogPunishment, NotifyUser } = require('./moderationinc')
const { unix } = require('moment');
module.exports.LinkDetected = async (message, client, Discord) => {
    let spammap = client.antiscamspam.get(message.guild.id)
    let spam = spammap.get(message.author.id)
    if (!spam) {
        let toset = Object
        toset.offences = 1
        toset.massoffences = 1
        toset.lastchannel = message.channel.id
        toset.user = message.author.id
        toset.expiretime = Number(Date.now(unix).toString().slice(0, -3)) + 5
        return spammap.set(message.author.id, toset)
    } else {
        if (spam.expiretime < Number(Date.now(unix).toString().slice(0, -3)) - 5) {
            spam.offences = 1
            spam.massoffences = 1
            spam.lastchannel = message.channel.id
            spam.expiretime = Number(Date.now(unix).toString().slice(0, -3)) + 5
            return spammap.set(message.author.id, spam)
        }
        spam.offences = spam.offences + 1
        if (message.channel.id !== spam.lastchannel) {
            spam.massoffences = spam.massoffences + 1
            spam.lastchannel = message.channel.id
            type = spammap.get('punishtypemass')
            if (spam.massoffences > 4) {
                spam.massoffences = 1
                return MassLinkSpamDetected(message, client, Discord, type)
            }
        }
        spam.lastchannel = message.channel.id
        if (spam.offences > 5) {
            type = spammap.get('punishtype')
            spam.offences = 1
            return LinkSpamDetected(message, client, Discord, type)
        }

        spam.expiretime = Number(Date.now(unix).toString().slice(0, -3)) + 5
        spammap.set(message.author.id, spam)
    }
}

const LinkSpamDetected = async (message, client, Discord, type) => {
    console.log(`Link spam detected from user ${message.author.tag} (${message.author.id}) in guild ${message.guild}`)
    if (type) {
        if (type == 1) {
            if (message.guild.me.permissions.has('BAN_MEMBERS') && message.member.bannable) {
                await NotifyUser(1, message, `You have been banned from ${message.guild}`, message.member, 'AUTOBAN: Link Spam detected.', 0, client, Discord)
                await message.guild.members.ban(message.member, { reason: `AUTOBAN: Link Spam detected.` }).catch(err => {
                    console.log(err)
                    message.channel.send('Failed to ban.')
                    return
                })
                message.author = client.user
                LogPunishment(message, client, message.member.id, 1, null, `AUTOBAN: Link Spam detected.`, Discord)
                console.log(`User banned for link spam.`)
            }
        } else if (type == 3) {
            let muteroleid = client.muteroles.get(message.guild.id)
            const muterole = message.guild.roles.cache.get(muteroleid);
            if (!muterole) {
                return
            }
            if (message.guild.me.roles.highest.position <= muterole.position) {
                return
            }
            message.member.roles.add(muterole, { reason: `AUTO-MUTE: Link Spam detected.` }).catch(err => {
                console.log(err);
            })
            let message2 = Object
            message2.author = client.user
            message2.guild = message.member.guild;
            message2.channel = undefined;
            LogPunishment(message2, client, message.member.id, 3, null, 'AUTO-MUTE: Link Spam detected.', Discord)
            NotifyUser(3, message2, `You have been auto-muted in ${message.member.guild}`, message.member, 'AUTO-MUTE: Link Spam detected.', null, client, Discord)
            console.log(`User mute for link spam.`)
        } else if (type == 5) {
            await NotifyUser(5, message, `You have been kicked from ${message.guild}`, message.member, 'AUTOBAN: Link Spam detected.', 0, client, Discord)
            await message.guild.members.kick(message.member, { reason: `AUTOKICK: Link Spam detected.` }).catch(err => {
                console.log(err)
                message.channel.send('Failed to kick.')
                return
            })
            message.author = client.user
            LogPunishment(message, client, message.member.id, 5, null, `AUTOKICK: Link Spam detected.`, Discord)
            console.log(`User kicked for link spam.`)
        } else if (type == 6) {
            await NotifyUser(6, message, `You have been soft-banned from ${message.guild}`, message.member, 'AUTO-SOFTBAN: Link Spam detected.', 0, client, Discord)
            await message.guild.members.ban(message.member, { days: 1, reason: `AUTO-SOFTBAN: Link Spam detected`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            message.guild.members.unban(message.member, `AUTO-SOFTBAN: Link Spam detected.`).catch(err => {
                console.log(err)
                message.channel.send('Failed to un-ban.')
                return
            })
            message.author = client.user
            LogPunishment(message, client, message.member.id, 6, null, `AUTO-SOFTBAN: Link Spam detected.`, Discord)
            console.log(`User soft-banned for link spam.`)
        } else if (type == 7) {
            LogPunishment(message, client, member.id, 7, null, 'AUTO-WARN: Link Spam detected.', Discord)
            NotifyUser(7, message, `You have been warned in ${message.guild}`, member, 'AUTO-WARN: Link Spam detected.', 0, client, Discord)
            console.log(`User warned for link spam.`)
        }
    }
}

const MassLinkSpamDetected = async (message, client, Discord, type) => {
    console.log(`Link spam detected from user ${message.author.tag} (${message.author.id}) in guild ${message.guild}`)
    if (type) {
        if (type == 1) {
            if (message.guild.me.permissions.has('BAN_MEMBERS') && message.member.bannable) {
                await NotifyUser(1, message, `You have been banned from ${message.guild}`, message.member, 'AUTOBAN: Mass Link Spam detected.', 0, client, Discord)
                await message.guild.members.ban(message.member, { reason: `AUTOBAN: Mass Link Spam detected.` }).catch(err => {
                    console.log(err)
                    message.channel.send('Failed to ban.')
                    return
                })
                message.author = client.user
                LogPunishment(message, client, message.member.id, 1, null, `AUTOBAN: Mass Link Spam detected.`, Discord)
                console.log(`User banned for link spam.`)
            }
        } else if (type == 3) {
            let muteroleid = client.muteroles.get(message.guild.id)
            const muterole = message.guild.roles.cache.get(muteroleid);
            if (!muterole) {
                return
            }
            if (message.guild.me.roles.highest.position <= muterole.position) {
                return
            }
            message.member.roles.add(muterole, { reason: `AUTO-MUTE: Mass Link Spam detected.` }).catch(err => {
                console.log(err);
            })
            let message2 = Object
            message2.author = client.user
            message2.guild = message.member.guild;
            message2.channel = undefined;
            LogPunishment(message2, client, message.member.id, 3, null, 'AUTO-MUTE: Mass Link Spam detected.', Discord)
            NotifyUser(3, message2, `You have been auto-muted in ${message.member.guild}`, message.member, 'AUTO-MUTE: Mass Link Spam detected.', null, client, Discord)
            console.log(`User mute for link spam.`)
        } else if (type == 5) {
            await NotifyUser(5, message, `You have been kicked from ${message.guild}`, message.member, 'AUTOBAN: Mass Link Spam detected.', 0, client, Discord)
            await message.guild.members.kick(message.member, { reason: `AUTOKICK: Mass Link Spam detected.` }).catch(err => {
                console.log(err)
                message.channel.send('Failed to kick.')
                return
            })
            message.author = client.user
            LogPunishment(message, client, message.member.id, 5, null, `AUTOKICK: Mass Link Spam detected.`, Discord)
            console.log(`User kicked for link spam.`)
        } else if (type == 6) {
            await NotifyUser(6, message, `You have been soft-banned from ${message.guild}`, message.member, 'AUTO-SOFTBAN: Mass Link Spam detected.', 0, client, Discord)
            await message.guild.members.ban(message.member, { days: 1, reason: `AUTO-SOFTBAN: Link Spam detected`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            message.guild.members.unban(message.member.id, `AUTO-SOFTBAN: Mass Link Spam detected.`).catch(err => {
                console.log(err)
                message.channel.send('Failed to un-ban.')
                return
            })
            message.author = client.user;
            LogPunishment(message, client, message.member.id, 6, null, `AUTO-SOFTBAN: Mass Link Spam detected.`, Discord)
            console.log(`User soft-banned for link spam.`)
        } else if (type == 7) {
            LogPunishment(message, client, member.id, 7, null, 'AUTO-WARN: Mass Link Spam detected.', Discord)
            NotifyUser(7, message, `You have been warned in ${message.guild}`, member, 'AUTO-WARN: Mass Link Spam detected.', 0, client, Discord)
            console.log(`User warned for link spam.`)
        }
    }
}