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
const { exec } = require("child_process");
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    aliases: ['restart', 'logs', 'errors'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '174095706653458432') {
            if (cmd === 'shutdown') {
                await message.react('☑️')
                console.log('\n\n\n\nShut down by command || SHUTDOWN')
                exec('forever stop 1')
                exec('forever stop 2')
                exec('forever stop 3')
                exec('forever stop 4')
                exec('forever stop 5')
                exec('forever stop 6')
                exec('forever stop 7')
                exec('forever stop 8')
                exec('forever stop 9')
                exec('forever stop 10')
                justincasethatdoesntworkthisisafunctionthatwillmakethebotcrash
            } else if (cmd === 'restart') {
                message.delete()
                console.log('\nRestarted by command | RESTART')
                exec('forever restart 1')
            } else if (cmd === 'logs') {
                exec('forever logs 1', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
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
            } else if (cmd === 'errors') {
                exec('forever logs 1 --plain', (error, stdlogs /*this is everything */, logs /*this will be only errors in the logs*/) => {
                    if (error) {
                        console.log(`exec error: ${error}`);
                        return message.channel.send('Errored; Failed')
                    }
                    logs = logs.replace(/\[90mdata\[39m:undefined\[35mindex.js\[39m:/g, '')
                    if (logs.length > 4000) {
                        logs = logs.slice(logs.length - 4000)
                    }
                    const logsembed = new Discord.MessageEmbed()
                        .setTitle(`Recent errors:`)
                        .setDescription(`${logs}`)
                    message.channel.send({ embeds: [logsembed] }).catch(err => { console.log(err) })
                });
            }
        }
    }
}