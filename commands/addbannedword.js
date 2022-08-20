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
//later
module.exports = {
    name: 'addbannedword',
    description: 'Bans a word from being said',
    async execute(message, client, cmd, args, Discord, userstatus) {

    }
}