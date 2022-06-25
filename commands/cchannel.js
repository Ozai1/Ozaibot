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
      name: 'cchannel',
      description: 'creates a publuc channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  let channelName = args.slice(0).join(' ');
                  message.guild.channels.create(channelName, {
                        type: "text",
                        permissionOverwrites: [
                              {
                                    id: message.guild.roles.everyone,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                              }
                        ],
                  }).catch(err => {
                        console.log(err);
                        message.author.send('Failed to create channel.');
                  })
            }
      }
}