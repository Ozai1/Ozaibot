const { unix } = require('moment');
const moment = require('moment');
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
      name: 'checkban',
      aliases: ['totalbans'],
      description: 'checks if a user is banned from a guild and what theyre ban reason is',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'totalbans') return total_bans(message, client, userstatus)
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server. (This also means I cannot check bans.)')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have access to this command.')
            }
            if (!args[0]) return message.channel.send('Ban found on... oh wait')
            message.guild.bans.fetch().then(bans => {
                  let member = bans.get(args[0]);
                  if (bans.size == 0) return message.reply('This server doesnt have any bans lol')
                  if (member == null) {
                        return message.reply('Cannot find an active ban for the given user.')
                  } else {
                        return message.channel.send(`Active ban found on <@${args[0]}> for the reason of: \`${member.reason}\``)
                  }
            })
      }
}

async function total_bans(message, client, userstatus) {
      if (userstatus == 1) {
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.author.send('Ozaibot does not have permission to see bans in this server.')
            await message.guild.bans.fetch().then(bans => {
                  let bancount = 0;
                  bans.forEach(ban => {
                        bancount = bancount + 1;
                  })
                  message.channel.send(`This server has a total of ${bancount} bans.`)
            })

      }
}