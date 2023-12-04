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
const { GetMember, LogPunishment, NotifyUser , HasPerms} = require("../moderationinc")
module.exports = {
      name: 'kick',
      aliases: ['k', 'skick'],
      description: 'Kicks a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (cmd === 'skick') return skick(message, args, userstatus, Discord, client)
            if (userstatus !== 1) {
                  let perms = await HasPerms(message, message.member, client, 'e', 'l')
                  if (!message.member.permissions.has("KICK_MEMBERS") && perms !== 1 || perms == 2) {
                      const errorembed = new Discord.MessageEmbed()
                          .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                          .setColor(15684432)
                          .setDescription(`You do not have access to this command.`)
                      return message.channel.send({ embeds: [errorembed] })
                  }
              }
            if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send('Ozaibot does not have kick permissions in this server!')
            if (!args[0]) return message.channel.send('You must add a member to kick.')
            member = await GetMember(message, client, args[0], Discord, true, false);
            if (member === 'cancelled') return
            if (!userstatus == 1) {
                  if (message.guild.ownerId !== message.author.id) {
                        if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) return message.channel.send('You cannot kick someone with higher or the same roles as your own.');
                  }
            }
            if (!member) return message.reply("Invalid member.");
            if (member.id === message.author.id) return message.channel.send('You cant kick yourself!');
            if (!member.kickable) return message.reply("I do not have high enough permissions to kick this member.");
            let reason = args.slice(1).join(" ");
            let casenumber = client.currentcasenumber.get(message.guild.id) + 1
            const returnembed = new Discord.MessageEmbed()
                  .setTitle(`Case #${casenumber}`)
                  .setDescription(`<:check:988867881200652348> ${member} has been **kicked**.`)
                  .setColor("GREEN")
            message.channel.send({ embeds: [returnembed] })
            await NotifyUser(5, message, `You have been kicked from ${message.guild}`, member, reason, 0, client, Discord)
            await message.guild.members.kick(member,  `${reason} - ${message.author.tag} (${message.author.id})`).catch(err => {
                  console.log(err)
                  message.channel.send('Failed to kick')
                  return
            });
            LogPunishment(message, client, member.id, 5, null, reason, Discord,undefined, true)
      }
}
async function skick(message, args, userstatus, Discord, client) {
      if (userstatus == 1) {
            if (!args[0]) return message.member.send('You must add a member to kick.')
            const member = await GetMember(message, client, args[0], Discord, true, false)
            if (member === 'cancelled') return
            if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send('Ozaibot does not have kick permissions in this server!')
            if (!member) return message.author.send('no member ')
            if (!member.kickable) return message.author.send('I do not have high enough permissions for this or theyre not on the server or smth')
            await member.kick().catch(err => {
                  console.log(err)
                  message.author.send('Failed to kick')
                  return
            })
            return
      }
}