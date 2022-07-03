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
const { exec } = require("child_process");
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    aliases: ['restart', 'logs'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '174095706653458432') {
            if (cmd === 'shutdown') {
                await message.react('☑️')
                console.log('Shut down by command')
                exec(`forever stopall`)
                justincasethatdoesntworkthisisafunctionthatwillmakethebotcrash
            } else if (cmd === 'restart') {
                message.delete()
                exec('forever restart 0')
            } else if (cmd === 'logs') {
                exec('forever logs 0', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
                    if (error) {
                        console.log(`exec error: ${error}`);
                        return message.channel.send('Errored; Failed')
                    }
                    logs = logs.replace(/\[90mdata\[39m:undefined\[35mindex.js\[39m:/g, '')
                if (logs.length > 4000) {
                    logs = logs.slice(logs.length - 4000)
                }
                const logsembed = new Discord.MessageEmbed()
                    .setTitle(`Last 4000 characters of logs:`)
                    .setDescription(`${logs}`)
                message.channel.send({ embeds: [logsembed] }).catch(err => { console.log(err) })
                });
            }
        }
    }
}