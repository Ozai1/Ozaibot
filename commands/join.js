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
      name: 'join',
      description: 'makes the bot join a channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
                  if (args[0]) {
                        let channeljoin = client.channels.cache.get(args[0]);
                        if (!channeljoin) return message.channel.send('Invalid channel.');
                        if (!channeljoin.joinable) return message.reply('Ozaibot cannot join that channel');
                        if (!channeljoin.type === 'voice') return message.channel.send('That isnt even a voice channel idiot');
                        channeljoin.join()
                        return
                  }
                  if (!message.member.voice.channel) return message.channel.send("Please connect to a voice channel!");
                  if (message.member.voice.channel.joinable) {
                        message.member.voice.channel.join().catch()
                  } else return message.reply('Ozaibot cannot join that channel.')
            }
      }
}