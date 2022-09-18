const mysql = require('mysql2');
const { LogPunishment } = require("../moderationinc")
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
      name: 'unban',
      aliases: ['un-ban'],
      description: 'unbans a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
                  console.log('attempted to unban while ozaibot does not have unban perms')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Ozaibot Does not have permissions to unban in this server.`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) {
                        console.log('attempted to unban while not having enough permissions')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor(15684432)
                              .setDescription(`You do not have access to this command.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
            }
            if (!args[0]) {
                  console.log('stopped, no member arg')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid member.\n\nProper useage is:\n\`unban <member_id>\``)
                  return message.channel.send({ embeds: [errorembed] })
            }
            message.guild.bans.fetch().then(bans => {
                  let member = bans.get(args[0]);
                  if (!member) {
                        console.log('attempted unban on user which is not banned')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor("GREEN")
                              .setDescription(`This member is not currently banned.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
                  message.guild.members.unban(args[0], 'Unbanned by ' + message.author.tag).then(() => {
                        let casenumber = client.currentcasenumber.get(message.guild.id) + 1
                        const returnembed = new Discord.MessageEmbed()
                              .setTitle(`Case #${casenumber}`)
                              .setDescription(`<:check:988867881200652348> <@${args[0]}> has been **un-banned**.`)
                              .setColor("GREEN")
                        message.channel.send({ embeds: [returnembed] })
                  }).catch(err => { console.log(err) });
                  let reason = args.slice(1).join(" ");
                  LogPunishment(message, client, args[0], 2,null, reason, Discord)
            })
      }
}