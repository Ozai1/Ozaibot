const mysql = require('mysql2')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
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
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1 || message.member.permissions.has('MANAGE_GUILD')) {
            let newprefix = args.slice(0).join(" ")
            if (!args[0]) return message.channel.send('You must add a prefix for the bot to use')
            if (newprefix.length > 10) return message.reply('Please make the prefix less than 10 characters long.')
            if (message.content.toLowerCase().includes('@everyone') || message.content.toLowerCase().includes('@here') || message.content.toLowerCase().includes('<@&')) return message.channel.send('Nah')

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
                    let query = "UPDATE prefixes SET prefix = ? WHERE serverid = ?";
                    let data = [newprefix, message.guild.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    });
                    query = "UPDATE prefixes SET servername = ? WHERE serverid = ?";
                    data = [message.guild.name, message.guild.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    });
                }
            });
            message.channel.send(`Prefix has been set to \`${newprefix}\`.`)
        } else {
            message.channel.send('You do not have the permissions to do this.')
        }
    }
}