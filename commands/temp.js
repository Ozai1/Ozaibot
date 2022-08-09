const mysql = require('mysql2');

const { GetDisplay, GetPunishmentDuration, GetMemberOrChannel, GetMemberOrRole } = require('../moderationinc')
const util = require('minecraft-server-util')
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

module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        // let str = message.content
        // let pattern = new RegExp("[ozai]");
        // let newParams = "";
        // for (let i = 0; i < str.length; i++) {
        //   newParams += str.substr(i, 1).replace(pattern, '');
        // }
        // message.channel.send(newParams)
        const regex = /[A-Z]/g;
        const found = message.content.match(regex);
        message.channel.send(`FOUND: ${found}`)
    }
}