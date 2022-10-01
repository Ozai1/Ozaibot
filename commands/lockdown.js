const mysql = require('mysql2');
const {HasPerms } = require("../moderationinc")

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
    name: 'lockdown',
    aliases: ['ld'],
    description: 'changes the @ everyone permission of SEND_MESSAGES to the opposet of what it was before',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (userstatus !== 1) {
            let perms = await HasPerms(message, message.member, client, 'j', 'l')
            if (!message.member.permissions.has("MANAGE_CHANNELS") && perms !== 1 || perms == 2) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`You do not have access to this command.`)
                return message.channel.send({ embeds: [errorembed] })
            }
        }
            if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
                await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }).catch(err => { console.log(err) })
                const msgEmbed = new Discord.MessageEmbed()
                    .setDescription(`Lockdown has ended.`)
                    .setColor('GREEN');
                    message.channel.send({ embeds: [msgEmbed] })
            } else {
                await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).catch(err => { console.log(err) })

                const msgEmbed = new Discord.MessageEmbed()
                    .setDescription(`Lockdown has started.`)
                    .setColor('RED')
                message.channel.send({ embeds: [msgEmbed] })
            }
    }
}