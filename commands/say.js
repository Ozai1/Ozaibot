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
    name: 'say',
    description: 'repeats a message',
    aliases: ['embedsay'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (userstatus == 1 || message.member.permissions.has('ADMINISTRATOR')) {
            if (cmd === 'embedsay') {
                if (message.deletable) message.delete().catch(err => { console.log(err) });
                if (!args[0]) return;
                let content = args.slice(0).join(" ");
                const embed = new Discord.MessageEmbed()
                    .setDescription(content)
                    .setColor('#F28FB0')
                message.channel.send({ embeds: [embed] }).catch(err => { })
                return
            }
            if (!userstatus == 1) {
                if (message.content.toLocaleLowerCase().includes('<@&') || message.content.toLocaleLowerCase().includes('@everone') || message.content.toLocaleLowerCase().includes('@here')) return
            }
            if (message.deletable) message.delete().catch(err => { console.log(err) });
            if (!args[0]) return;
            let content = args.slice(0).join(" ");
            if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
            message.channel.send(content).catch(err => { console.log(err) });
            return;
        }
    }
}
