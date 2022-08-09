const { LogPunishment, NotifyUser } = require('./moderationinc')
const { unix } = require('moment');
const mysql = require('mysql2');
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
            let length = spammap.get('punishlengthmass')
            if (spam.massoffences > 4) {
                spam.massoffences = -100
                return MassLinkSpamDetected(message, client, Discord, type, length)
            }
        }
        spam.lastchannel = message.channel.id
        if (spam.offences > 5) {
            type = spammap.get('punishtype')
            spam.offences = -100
            let length = spammap.get('punishlength')
            return LinkSpamDetected(message, client, Discord, type, length)
        }

        spam.expiretime = Number(Date.now(unix).toString().slice(0, -3)) + 5
        spammap.set(message.author.id, spam)
    }
}

const LinkSpamDetected = async (message, client, Discord, type, length) => {
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
            let timeunban = 9999999999
            if (length) {
                timeunban = Number(Date.now(unix).toString().slice(0, -3).valueOf()) + length
            } else {
                length = 0
            }
            let casenumber = client.currentcasenumber.get(message.guild.id) + 1
            let query = "INSERT INTO activebans (userid, adminid, serverid, timeunban, casenumber, length, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
            let data = [message.author.id, client.user.id, message.guild.id, timeunban, casenumber, length, 'mute']
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    message.channel.send('Creating unmute time in database failed. User is still muted but will not be automatically unmuted.')
                    return console.log(error)
                }
            })
            let message2 = Object
            message2.author = client.user
            message2.guild = message.member.guild;
            message2.channel = undefined;
            LogPunishment(message2, client, message.member.id, 3, length, 'AUTO-MUTE: Link Spam detected.', Discord)
            NotifyUser(3, message2, `You have been auto-muted in ${message.member.guild}`, message.member, 'AUTO-MUTE: Link Spam detected.', length, client, Discord)
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

const MassLinkSpamDetected = async (message, client, Discord, type, length) => {
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
            let timeunban = 9999999999
            if (length) {
                timeunban = Number(Date.now(unix).toString().slice(0, -3).valueOf()) + length
            } else {
                length = 0
            }
            let casenumber = client.currentcasenumber.get(message.guild.id) + 1
            let query = "INSERT INTO activebans (userid, adminid, serverid, timeunban, casenumber, length, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
            let data = [message.author.id, client.user.id, message.guild.id, timeunban, casenumber, length, 'mute']
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    message.channel.send('Creating unmute time in database failed. User is still muted but will not be automatically unmuted.')
                    return console.log(error)
                }
            })

            let message2 = Object
            message2.author = client.user
            message2.guild = message.member.guild;
            message2.channel = undefined;
            LogPunishment(message2, client, message.member.id, 3, length, 'AUTO-MUTE: Mass Link Spam detected.', Discord)
            NotifyUser(3, message2, `You have been auto-muted in ${message.member.guild}`, message.member, 'AUTO-MUTE: Mass Link Spam detected.', length, client, Discord)
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