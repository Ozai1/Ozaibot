const { unix } = require('moment');
const moment = require('moment');
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
 
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
 
module.exports = {
      name: 'checkban',
      aliases: ['checkbans', 'isbanned', 'user', 'userinfo', 'who', 'whois', 'ui', 'totalbans', 'bancount'],
      description: 'checks if a user is banned from a guild and what theyre ban reason is',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'user' || cmd === 'userinfo' || cmd === 'who' || cmd === 'whois' || cmd === 'ui') return user_command(message, args, Discord, client)
            if (cmd === 'totalbans' || cmd === 'bancount') return total_bans(message, client, userstatus)
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server. (This also means I cannot check bans.)')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('Missing permissions.')
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
async function user_command(message, args, Discord, client) {
      if (!args[0]) {
            if (message.guild) {
                  let member = message.guild.members.cache.get(message.author.id)
                  let user = client.users.cache.get(message.author.id)
                  const joinedatunix = Number(moment(member.joinedAt).unix())
                  const createdatunix = Number(moment(user.createdAt).unix())
                  const uiembed = new Discord.MessageEmbed()
                        .setTitle(`${user.tag}`)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                  if (user.bot) {
                        uiembed.setDescription('Is a bot')
                  }
                  uiembed.addField('ID', user.id)
                        .addField('Highest rank', member.roles.highest)
                        .addField('Joined server at', `\`${moment(member.joinedAt).format('DD MMM YYYY, H:MM')}\`, <t:${joinedatunix}:R>`)
                        .addField('Created account at', `\`${moment(member.user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                        .setFooter(`requested by ${message.author.tag}`)
                        .setTimestamp()
                        .setColor(member.displayHexColor);
                  message.channel.send({embeds: [uiembed]})
            } else {
                  let user = client.users.cache.get(message.author.id)
                  const createdatunix = Number(moment(user.createdAt).unix())
                  const uiembed = new Discord.MessageEmbed()
                        .setTitle(`${user.tag}`)
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                  if (user.bot) {
                        uiembed.setDescription('Is a bot.')
                  }
                  uiembed.addField('ID', user.id)
                        .addField('Created account at', `\`${moment(user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                        .setFooter(`requested by ${message.author.tag}`)
                        .setTimestamp()
                        .setColor(240116);
                  message.channel.send({embeds: [uiembed]})
            }
      } else {
            let membertype = 'member'
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1)) || message.mentions.members.first();
            let user = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0]) || client.users.cache.get(args[0].slice(2, -1)) || message.mentions.users.first();
            if (!member) {
                  membertype = 'user'
                  if (!user) {
                        user = await client.users.fetch(args[0])
                        if (!user) return message.channel.send('Invalid user.')
                  }
            }
            if (membertype === 'member') {
                  const joinedatunix = Number(moment(member.joinedAt).unix())
                  const createdatunix = Number(moment(user.createdAt).unix())
                  const uiembed = new Discord.MessageEmbed()
                        .setTitle(`${user.tag}`)
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                  if (user.bot) {
                        uiembed.setDescription('Is a bot')
                  }
                  uiembed.addField('ID', user.id)
                        .addField('Highest rank', member.roles.highest)
                        .addField('Joined server at', `\`${moment(member.joinedAt).format('DD MMM YYYY, H:MM')}\`, <t:${joinedatunix}:R>`)
                        .addField('Created account at', `\`${moment(member.user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                        .setFooter(`requested by ${message.author.tag}`)
                        .setTimestamp()
                        .setColor(member.displayHexColor);
                  message.channel.send({embeds: [uiembed]})
            } else {
                  const createdatunix = Number(moment(user.createdAt).unix())
                  const uiembed = new Discord.MessageEmbed()
                        .setTitle(`${user.tag}`)
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                  if (user.bot) {
                        uiembed.setDescription('Is a bot.')
                  }
                  uiembed.addField('ID', user.id)
                        .addField('Created account at', `\`${moment(user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                        .setFooter(`requested by ${message.author.tag}`)
                        .setTimestamp()
                        .setColor(240116);
                  message.channel.send({embeds: [uiembed]})
            }
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