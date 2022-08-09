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

const { GetMember } = require("../moderationinc")
module.exports = {
      name: 'rename',
      aliases: ['nickname', 'setnickname'],
      description: 'sets a users nickname in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.reply('You do not have access to this command.');
            } if (!message.guild.me.permissions.has('MANAGE_NICKNAMES')) return message.channel.send('Ozaibot does not have permissions to change nicknames in this server.');
            if (!args[1]) return message.channel.send('Usage is `sm_rename <@user> <new_name>`');
            let member = await GetMember(message, client, args[0], Discord, true, false)
            if (!member) {
                  return message.channel.send('Invalid member.')
            }
            if (member === 'cancelled') return message.channel.send('Cancelled.')
            let name = args.slice(1).join(" ");
            if (name.length > 32) {
                  return message.channel.send('Name must be less than 32 characters long.')
            }
            if (member.id == client.user.id) return botrename(message, userstatus, name)
            if (message.guild.ownerId !== message.author.id) {
                  if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor(15684432)
                              .setDescription(`You cannot rename this member.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
            }
            if (member.roles.highest.position > message.guild.me.roles.highest.position || member.id == message.guild.ownerId) {
                  return message.channel.send('I cannot rename this member')
            }
            await member.setNickname(name).catch(err => {
                  console.error(err)
                  message.channel.send('Error when renaming, given name was probably to long.')
                  return
            }).then(() => {
                  message.channel.send(`Renamed ${member}.`);
            })
      }
}
const botrename = async (message, userstatus, name) => {
      if (!userstatus == 1) {
            if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.reply('You do not have access to this command.');
      } if (!message.guild.me.permissions.has('CHANGE_NICKNAME')) return message.channel.send('I do not have permissions to change my own nickname.');
      await message.guild.me.setNickname(name).catch(err => { console.log(err) })
      message.channel.send('Set own nickname.')
}