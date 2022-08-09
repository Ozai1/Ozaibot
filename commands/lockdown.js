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
    name: 'lockdown',
    aliases: ['ld'],
    description: 'changes the @ everyone permission of SEND_MESSAGES to the opposet of what it was before',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (message.member.permissions.has('MANAGE_CHANNELS') || userstatus == 1) {
            if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
                await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }).catch(err => { console.log(err) })
                const msgEmbed = new Discord.MessageEmbed()
                    .setDescription(`lockdown has ended.`)
                    .setColor('GREEN');
                    message.channel.send({ embeds: [msgEmbed] })
            } else {
                await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).catch(err => { console.log(err) })

                const msgEmbed = new Discord.MessageEmbed()
                    .setDescription(`Lockdown has started!`)
                    .setColor('RED');
                message.channel.send({ embeds: [msgEmbed] })
            }
        } else {
            const warningEmbed = new Discord.MessageEmbed()
                .setDescription('You do not have access to this command.')
                .setColor('YELLOW');
            message.channel.send({ embeds: [warningEmbed] })
        }
    }
}