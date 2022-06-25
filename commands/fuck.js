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
    name: 'fuck',
    description: '',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!args[0]) return message.channel.send('You must ping someone to, yk, yeah')
        let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]);
        if (!member) return message.channel.send('So youre just gonna fuck the air?')
        cats = [`Hey hey, ${message.author} is getting a little spicy with ${member}.... This could be interesting`, `these two are about to do some questionable things! Lets give them some space.`, `Well this is going to be interesting between ${message.member} & ${member}`];
        var random = cats[Math.floor(Math.random() * cats.length)];
        message.channel.send(random)
    }
}
