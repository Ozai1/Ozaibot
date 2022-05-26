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
const NoWaitConnection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibot',
    waitForConnections: false,
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
const NoWaitServersDB = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibotservers',
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0
});
const { exec } = require("child_process")
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    aliases: ['restart'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '174095706653458432') {
            if (cmd === 'shutdown') {
                message.react('☑️')
                console.log('Shut down by command')
                exec(`forever stopall`)
                justincasethatdoesntworkthisisafunctionthatwillmakethebotcrash
            } else if (cmd === 'restart') {
                message.delete()
                exec('forever restart 0')
            }
        }
    }
}