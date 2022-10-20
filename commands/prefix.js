const mysql = require('mysql2')
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
    name: 'prefix',
    aliases: ['setprefix'],
    description: 'sets the bots prefix for a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (userstatus == 1 || message.member.permissions.has('MANAGE_GUILD')) {
            let newprefix = args.slice(0).join(" ")
            if (!args[0]) return message.channel.send('You must add a prefix for the bot to use')
            if (newprefix.length > 100) return message.reply('Please make the prefix less than 100 characters long.')
            if (message.content.toLowerCase().includes('@everyone') || message.content.toLowerCase().includes('@here') || message.content.toLowerCase().includes('<@&')) return message.channel.send('Prefixes must not contain everyone, here or role mentions.')
            client.prefixes.set(message.guild.id, newprefix)
            let query = "SELECT * FROM prefixes WHERE serverid = ?";
            let data = [message.guild.id]
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
                if (results == '' || results === undefined) { // creates row
                    let query = "INSERT INTO prefixes (serverid, prefix, servername) VALUES (?, ?, ?)";
                    let data = [message.guild.id, newprefix, message.guild.name]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    });
                } else if (!(results === ``)) { //edits row
                    let query = "UPDATE prefixes SET prefix = ?, servername = ? WHERE serverid = ?";
                    let data = [newprefix, message.guild.name, message.guild.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    });
                }
            });
            message.channel.send(`Prefix has been set to \`${newprefix}\`.`)
        } else {
            message.channel.send('You do not have access to this command.')
        }
    }
}