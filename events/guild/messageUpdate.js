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

module.exports = async (Discord, client, oldmessage, newmessage) => {
    if (!newmessage || !newmessage.content) return
    let message = newmessage
    if (message.channel.name === undefined) {
        if (message.author.id === client.user.id) return
        let dmlogs = client.channels.cache.get('986883430388207646');
        const commandembed = new Discord.MessageEmbed()
            .setDescription(`**${message.author.tag} EDIT IN DMS \n"**${message.content}**".**`)
            .setTimestamp()
        dmlogs.send({ embeds: [commandembed] });
    }
    let prefix = 'sm_';
    if (message.guild) {
        prefix = client.prefixes.get(message.guild.id)
        if (prefix === undefined) {
            prefix = 'sm_'
        }
    }
    if (message.content.toLowerCase().startsWith(prefix)) {
        if (newmessage.embeds && !oldmessage.embeds)return
        console.log(`CHATCMD UPDATE | ${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content.slice(prefix.length)}`)
        let args = message.content.slice(prefix.length).split(" ");
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
        userstatus = client.userstatus.get(message.author.id)
        if (userstatus == 0) return console.log('USER BLACKLISTED, ABORTING')
        if (userstatus === undefined) {
            userstatus = -1
        }
        if (userstatus == 1) {
            if (message.content.includes(';')) { // multi command using ;
                let multicommands = message.content.split(";");
                multicommands.forEach(command => {
                    let message2 = message
                    message2.content = command
                    let args2 = message2.content.slice(prefix.length).split(" ");
                    let cmd2 = args2.shift().toLowerCase();
                    const command2 = client.commands.get(cmd2) || client.commands.find(a => a.aliases && a.aliases.includes(cmd2));
                    if (command2) command2.execute(message2, client, cmd2, args2, Discord, userstatus)
                })
            } else {
                if (command) command.execute(message, client, cmd, args, Discord, userstatus)
            }
        } else {
            if (command) command.execute(message, client, cmd, args, Discord, userstatus)
        }
        logcommand(message)
    }
}

async function logcommand(message) {
    query = "SELECT * FROM totalcmds WHERE userid = ?";
    data = [message.author.id]
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
        if (results == '' || results === undefined) { // User does not have a row.
            let query = "INSERT INTO totalcmds (userid, username, cmdcount) VALUES (?, ?, ?)";
            let data = [message.author.id, message.author.username, 1]
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
            });
        } else {
            for (row of results) {
                cmdcount = Number(row["cmdcount"]) + 1;
            }
            let query = "UPDATE totalcmds SET cmdcount = ? WHERE userid = ?";
            let data = [cmdcount, message.author.id]
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
            });
        }
    })
}