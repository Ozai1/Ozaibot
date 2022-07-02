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
    name: 'masssaydel',
    description: 'repeats the message 10 times and then deletes it',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1) {
            let content = args.slice(0).join(" ");
            if (message.author.id == '464441790519443456') {
                if (message.content.includes('<@&') || message.content.toLowerCase().includes('@everyone')|| message.content.toLowerCase().includes('@here')) return
            } if (message.deletable) message.delete()
            if (!args[0]) return
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
        }
    }
}