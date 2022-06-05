const { getPackedSettings } = require('http2');
const mysql = require('mysql2');
const {GetDisplay, GetPunishmentDuration}=require('../moderationinc')

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
        const totaltimeinseconds = await GetPunishmentDuration(args[0])
        if (isNaN(totaltimeinseconds)) return message.channel.send('Invalid time')
        message.channel.send(`${totaltimeinseconds}\nresponse:\n<user> has been muted ${GetDisplay(totaltimeinseconds)}`)
    }
}