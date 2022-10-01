const mysql = require('mysql2');
const { GetMember } = require("../moderationinc")
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
      name: 'pm',
      description: 'dms a user through the bot',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  const confmessage = await message.channel.send('Sending...');
                  if (!args[1]) return message.channel.send('Usage: `sm_pm <user> <message>`')
                  let member = await GetMember(message, client, args[0], Discord, true, true)
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member'); // still no member
                  if (!args[0]) return;
                  let content = args.slice(1).join(" ");
                  if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.');

                  try {
                        await member.send(content)
                        confmessage.edit('Sent.')
                  } catch (error) {
                        console.log('member not DMable')
                        return confmessage.edit('User cannot be DMed')

                  }
            } else {
                  message.channel.send('You do not have access to this command.')
            }
      }
}