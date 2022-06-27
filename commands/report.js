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

module.exports = {
    name: 'report',
    description: 'allerts me of an issue with ozaibot',
    async execute(message, client, cmd, args, Discord, userstatus) {
        message.channel.send(`HELLO CLIENT>TESTING = ${client.testthing}`)
    }
}