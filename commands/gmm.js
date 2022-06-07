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
 
 
 
module.exports = {
      name: 'gmm',
      aliases: [],
      description: 'deletes your message',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
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