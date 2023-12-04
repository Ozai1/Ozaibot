const mysql = require('mysql2');
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
const { unix } = require('moment');
const { LogPunishment, NotifyUser } = require('./moderationinc')
module.exports.PunishmentExpire = async (client, Discord) => {
    THE_THING_THAT_DOES_EVERYTHING_YEET(client, Discord)
}

async function THE_THING_THAT_DOES_EVERYTHING_YEET(client, Discord) {
    setInterval( () => { // 2 second interval
        let query = `SELECT * FROM activebans WHERE timeunban < ?`;
        let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
        connection.query(query, data, async function (error, results, fields) {
            if (error) {
                console.log('backend error for checking active bans')
                return console.log(error)
            }
            if (results !== ``) {
                for (row of results) {
                    query = "DELETE FROM activebans WHERE id = ?";
                    data = [row["id"]]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    })
                    if (row["type"] === 'mute') {
                        var serverid = row["serverid"];
                        var userid = row["userid"];
                        const guild = client.guilds.cache.get(serverid);
                        let member = guild.members.cache.get(userid);
                        let casenumber = row["casenumber"]
                        let adminid = row["adminid"]
                        let duration = row["length"]
                        if (!guild) return console.log(`Attempted to unmute ${userid} in guild ${serverid} but the server was not found`)
                        if (!member) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the user was not found in the server`)
                        query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                        data = ['muterole', guild.id]
                        connection.query(query, data, async function (error, results, fields) {
                            if (error) return console.log(error)
                            if (results == ``) {
                                return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found in db.`)
                            }
                            for (row of results) {
                                let muteroleid = row["details"];
                                const muterole = guild.roles.cache.get(muteroleid)
                                if (!muterole) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found.`)
                                if (guild.me.roles.highest.position <= muterole.position) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was higher in perms than me.`)
                                if (!guild.me.permissions.has('MANAGE_ROLES')) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the i no longer have manage roles.`)
                                member.roles.remove(muterole).catch(err => { console.log(err) })
                                console.log(`unmuted ${userid} in ${guild}(${guild.id})`)
                                let modlogschannel = client.modlogs.get(guild.id)
                                if (!modlogschannel) return
                                let modlogs = guild.channels.cache.get(modlogschannel)
                                if (!modlogs) return
                                let message = Object()
                                message.author = await client.users.fetch(adminid)
                                message.guild = guild
                                message.channel = modlogs
                                LogPunishment(message, client, member.id, 4, duration, 'Automatic Un-Mute', Discord, casenumber, false)
                                NotifyUser(4, message, `You have been un-muted in ${message.guild}`, member, 'Automatic Un-Mute', duration, client, Discord)
                            }
                        })
                    } else if (row["type"] === 'ban') {
                        var serverid = row["serverid"];
                        var userid = row["userid"];
                        const guild = client.guilds.cache.get(serverid);
                        let casenumber = row["casenumber"]
                        let adminid = row["adminid"]
                        let duration = row["length"]
                        if (!guild.me.permissions.has('BAN_MEMBERS')) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the i no longer have manage roles.`)
                        guild.bans.fetch().then(async bans => {
                            let member = bans.get(userid);
                            if (!member) {
                                console.log('attempted unban on user which is not banned')
                                return
                            }
                            guild.members.unban(userid, `Automatic Unban. (case #${casenumber})`).then(() => {
                            }).catch(err => { console.log(err) });
                            console.log(`unbanned ${userid} in ${guild}(${guild.id})`)
                            let modlogschannel = client.modlogs.get(guild.id)
                            if (!modlogschannel) return
                            let modlogs = guild.channels.cache.get(modlogschannel)
                            if (!modlogs) return
                            let message = Object()
                            message.author = await client.users.fetch(adminid)
                            message.guild = guild
                            message.channel = modlogs
                            LogPunishment(message, client, userid, 2, duration, 'Automatic Un-Ban', Discord, casenumber, false)
                        })
                    }
                }
            }
        })
        query = `SELECT * FROM reminders WHERE time < ?`;
        data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                console.log('backend error for checking active bans')
                return console.log(error)
            }
            if (results !== ``) {
                for (row of results) {
                    query = "DELETE FROM reminders WHERE id = ?";
                    data = [row["id"]]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    })
                    var channelid = row["channelid"];
                    let text = row["text"];
                    const channel = client.channels.cache.get(channelid);
                    if (!channel)return console.log('Reminder fail: Channel was not found')
                    channel.send(text).catch(err => console.log(err));
                }
            }
        })
    }, 2000);
}