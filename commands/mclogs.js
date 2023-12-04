const mysql = require('mysql2');
const { exec } = require("child_process");
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
    name: 'mclogs',
    description: 'pulls mc logs',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1 && message.guild.id == '905824312185999390') {
            exec('journalctl -u minecraft --since yesterday', /*--no-pager*/(error, stlogs /*this is everything */, logs /*this will be only errors in the logs*/) => {
                if (error) {
                    console.log(`exec error: ${error}`);
                    return message.channel.send('Errored; Failed')
                }
                if (stlogs.length > 4000) {
                    stlogs = stlogs.slice(logs.length - 4000)
                }
                const logsembed = new Discord.MessageEmbed()
                    .setTitle(`logs`)
                    .setDescription(`${stlogs}`)
                message.channel.send({ embeds: [logsembed] }).catch(err => { console.log(err) })
            });
        }
    }
}