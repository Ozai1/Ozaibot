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
      name: 'gmm',
      aliases: [],
      description: 'deletes your message',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (userstatus == 1 || message.member.permissions.has('ADMINISTRATOR')) {
                  if (!args[0]) {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                        return
                  } if (isNaN(args[0])) {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                        return
                  }
                  setTimeout(function () {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                  }, args[0] * 1000);
                  return
            }
      }
}