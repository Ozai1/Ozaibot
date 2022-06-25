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
    name: 'masssay',
    description: 'repeats your message 10 times',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1 || message.author.id == '464441790519443456') {
            let content = args.slice(0).join(" ");
            if (message.deletable) message.delete().catch(err => { console.log(err) });
            if (!args[0]) return
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
            message.channel.send(content);
        }
    }
}