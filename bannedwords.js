const { unix } = require('moment');
const mysql = require('mysql2');
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
const {LogPunishment, NotifyUser} = require('./moderationinc')

module.exports.check_for_banned_words = async (message, client, Discord) => {
    let thecontent = ` ${message.content} `
    let bannedwords = client.bannedwords.get(message.guild.id)
    if (!bannedwords) return
    bannedwords.forEach(bannedword => {
        let standalone = false
        if (bannedword.startsWith('%')) {
            bannedword = bannedword.slice(1)
            standalone = true
        }
        if (standalone) {
            pattern = new RegExp(` ${bannedword} `, 'g')
        } else {
            pattern = new RegExp(bannedword, 'g')
        }
        if (thecontent.match(pattern)) return banned_word_flagged(message, client, Discord, bannedword)
    })
}

async function banned_word_flagged(message, client, Discord, bannedword) {
    //if (message.member.permissions.has('MANAGE_MESSAGES'))return
    message.delete().catch(err => { console.warn(err) })
    let punishmentmap = client.bannedwordspunishments.get(message.guild.id)
    let punishment = punishmentmap.get(bannedword)
    let warnlevelmap = client.bannedwordswarninglevels.get(message.guild.id)
    let maxwarnlevel = warnlevelmap.get(0)
    let userwarnlevel = warnlevelmap.get(message.author.id)
    let punishwarninglevel = punishment.punishwarninglevel
    let newwarnlevel = punishwarninglevel
    // if (punishment.punishtype) {
    //     // execute_immediate_punishment(message, client, Discord)
    // }
    // else
    // {
    if (userwarnlevel) {
        newwarnlevel = Number(userwarnlevel) + Number(punishwarninglevel)
    } else {
        newwarnlevel = punishwarninglevel
    }
    // }
    if (newwarnlevel > 0) {
        let conformationmessage = await message.channel.send(`${message.author}, you cant say that... Warning Level: ${newwarnlevel}/${maxwarnlevel}`)
    setTimeout(() => {
        conformationmessage.delete().catch(err => { console.log(err) });
    }, 5000);
    }
    if (newwarnlevel > maxwarnlevel) {
        max_warn_level_breached(message, client, Discord)
        warnlevelmap.set(message.author.id, -10000)
    } else {
        warnlevelmap.set(message.author.id, newwarnlevel)
    }
    
    return
}

async function max_warn_level_breached(message, client, Discord) {
    let muteroleid = client.muteroles.get(message.guild.id)
    const muterole = message.guild.roles.cache.get(muteroleid);
    if (!muterole) {
        return
    }
    if (message.guild.me.roles.highest.position <= muterole.position) {
        return
    }
    message.member.roles.add(muterole, { reason: `AUTO-MUTE: Max Infractions Reached.` }).catch(err => {
        console.log(err);
    })
    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
    const timeunban = currenttime + 1800
    let casenumber = client.currentcasenumber.get(message.guild.id) + 1
    let query = "INSERT INTO activebans (userid, adminid, serverid, timeunban, casenumber, length, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let data = [message.author.id, client.user.id, message.guild.id, timeunban, casenumber, 1800, 'mute']
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            message.channel.send('Creating unmute time in database failed. User is still muted but will not be automatically unmuted.')
            return console.log(error)
        }
    })
    let message2 = Object()
    message2.author = client.user
    message2.guild = message.guild;
    message2.channel = undefined;
    LogPunishment(message2, client, message.member.id, 3, 1800, 'AUTO-MUTE: Max Infractions Reached.', Discord, undefined, true)
    console.log(`User mute for max infractions.`)
}

module.exports.check_for_warning_level_decrease = async (client) => {
    setInterval(() => {
        client.bannedwordswarninglevels.forEach((value, key) => { // looping through the guilds
            value.forEach((value2, key2) => { // looping through the users
                if (key2 !== 0) { // 0 is assigned to the maxwarning level so we ignore it
                    if (value2 < 1) { // if their warning level has dropped to 0 or they have been muted and therefor their warning level is stupid low then just delete their shit and let it reset
                        value.delete(key2)
                    } else { // drop their warning level by 1
                        value.set(key2, value2 - 1)
                    }
                }
            })
        })
    }, 1000 * 60 * 10); // 10 mins
}
