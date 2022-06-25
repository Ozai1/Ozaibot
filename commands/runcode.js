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
    name: 'runcode',
    description: 'repeats a message',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id !== '508847949413875712') return message.channel.send('absolutely not')
            eval(`${args.slice(0).join(" ")}`).catch(err => {
                const helpembed = new Discord.MessageEmbed()
                .setTitle('error spat')
if (err) {
helpembed.setDescription(err)
}
                helpembed.setColor('BLUE')
            message.channel.send({embeds: [helpembed]})
            });
    }
}
