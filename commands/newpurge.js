const { unix } = require("moment");
const imissjansomuchithurts = 1420070400000
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
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
module.exports = {
    name: 'newpurge',
    aliases: [],
    description: 'Deletes messages in bulk',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })

        if (!args[0]) return conformationmessage.edit(`${message.author}, Usage is \`sm_purge <amount>\``).catch(err => { console.log(err) });
        let amount = Number(args[0]);
        if (!args[1] || args[1].toLowerCase() === 'silent') {

        } else {

        }

    }
}