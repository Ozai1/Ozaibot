const mysql = require('mysql2');

require('dotenv').config();
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

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'ok',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '753454519937007696') {
            message.channel.send('youre hot').then(message => { message.edit('pee') })
            return
        } else if (userstatus == 1) {
            message.channel.send('pee')
            return
        } else {
            message.channel.send('poop')
        }
    }
}