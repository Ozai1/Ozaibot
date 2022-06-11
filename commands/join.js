const mysql = require('mysql2');
const {GetDatabasePassword} = require('../hotshit')
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: GetDatabasePassword(),
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