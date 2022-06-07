const { getPackedSettings } = require('http2');
const mysql = require('mysql2');
const { GetDisplay, GetPunishmentDuration } = require('../moderationinc')

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
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!userstatus == 1) return
        // client.guilds.cache.forEach(guild => {
        //     let query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
        //     let data = ['muterole']
        //     serversdb.query(query, data, async function (error, results, fields) {
        //         if (error) return console.log(error)
        //         let muteroleid = row["details"]
        //         for (row of results) {
        //             let query = `INSERT INTO serverconfigs (serverid, type, details) VALUES (?, ?, ?)`;
        //             let data = [ guild.id, 'muterole', muteroleid];
        //             connection.query(query, data, function (error, results, fields) {
        //                 if (error)
        //                     return console.log(error);
        //                 console.log('query')
        //             });
        //         }
        //     })
        // })
    }
}