const { unix } = require('moment');
const mysql = require('mysql2');
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = (Discord, client) => {
    return
    const reminderschannel = client.channels.cache.get('921744952537534504')
    console.log('shits online')
    let rating = Math.floor(Math.random() * 2) + 1;
    if (rating == 1) {
        client.user.setPresence({ status: 'dnd' });
        console.log('Set status to DND')
    } else console.log('Set status to Online')
    let query = "SET GLOBAL max_connections = 512";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
    })
    data = []
    client.guilds.cache.forEach(async (guild) => {
        query = `CREATE TABLE IF NOT EXISTS ${guild.id}config(id INT(12) AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255) COLLATE utf8mb4_unicode_ci, details VARCHAR(255) COLLATE utf8mb4_unicode_ci, details2 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details3 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details4 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details5 VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
        serversdb.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
        })
        query = `CREATE TABLE IF NOT EXISTS ${guild.id}punishments(id INT(12) AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(32), serverid VARCHAR(32), adminid VARCHAR(32), timeexecuted VARCHAR(32), timeunban VARCHAR(32), reason VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
        serversdb.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
        })
    })
    console.log('Created tables for new servers')
    console.log(`Signed into ${client.user.tag}`)
    setInterval(() => {
        reminderschannel.send('read through leons dms u dumb fuck <@508847949413875712> https://discord.com/channels/@me/879939122586861619/921743972441931776').catch(err => { console.log(err) })
    }, 43200 * 1000);

        setInterval(() => {
        let query = `SELECT * FROM activebans WHERE timeunban < ?`;
        let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
        connection.query(query, data, function (error, results, fields) {
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
                    var serverid = row["serverid"];
                    var userid = row["userid"];
                    const guild = client.guilds.cache.get(serverid);
                    let member = guild.members.cache.get(userid);
                    if (!member) { member = searchmember(userid, guild) }
                    if (!guild) return console.log(`Attempted to unmute ${userid} in guild ${serverid} but the server was not found`)
                    if (!member) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the user was not found in the server`)
                    query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
                    data = ['muterole']
                    serversdb.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                        if (results == ``) {
                            return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found in db.`)
                        }
                        for (row of results) {
                            let muteroleid = row["details"];
                            const muterole = guild.roles.cache.get(muteroleid)
                            if (!muterole) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was not found.`)
                            if (guild.me.roles.highest.position <= muterole.position) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the mute role was higher in perms than me.`)
                            if (!guild.me.hasPermission('MANAGE_ROLES')) return console.log(`Attempted to unmute ${userid} in guild ${guild}(${guild.id}) but the i no longer have manage roles.`)
                            member.roles.remove(muterole).catch(err => { console.log(err) })
                            console.log(`unmuted ${userid} in ${guild}(${guild.id})`)
                        }
                    })
                }
            }

        })
    }, 2000);
}