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
      name: 'hidechannel',
      description: 'changes the @ everyone permission for VIEW_CHANNEL to the opposet of its current state',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (message.member.permissions.has('MANAGE_CHANNELS') || userstatus == 1) {
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  message.delete().catch(err => { console.log(err) });
                  if (!message.channel.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')) {
                        const msgEmbed = new Discord.MessageEmbed()
                              .setDescription(`'${message.channel.name}' has been revealed!.`)
                              .setColor('GREEN');
                        message.channel.send(({ embeds: [msgEmbed] })).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                        message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: true }).catch(err => { console.log(err) })
                  } else {
                        const msgEmbed = new Discord.MessageEmbed()
                              .setDescription(`'${message.channel.name}' has been hidden.`)
                              .setColor('RED');
                        message.channel.send({ embeds: [msgEmbed] }).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                        message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                  }
            } else {
                  const msgEmbed = new Discord.MessageEmbed()
                        .setDescription('You do not have access to this command.')
                        .setColor('YELLOW');
                  message.channel.send({ embeds: [msgEmbed] }).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
            }
      }
}