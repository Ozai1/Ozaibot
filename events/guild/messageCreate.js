const mysql = require('mysql2');
require('dotenv').config();
const { LinkDetected } = require('../../antiscamspam')
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
const { HasPerms } = require("../../moderationinc")
module.exports = async (Discord, client, message) => {
    if (message.author.id !== '940296225947799603') {
        if (message.author.bot) return
    }
    // if (message.content.toLowerCase().startsWith('who is ')){
    //     return message.channel.send('A sick cunt obviously.')
    // }
    if (message.channel.name === undefined) {
        if (message.author.id === client.user.id) return
        let dmlogs = client.channels.cache.get('986883430388207646');
        const commandembed = new Discord.MessageEmbed()
            .setDescription(`**${message.author.tag} IN DMS \n"**${message.content}**".**`)
            .setTimestamp()
        dmlogs.send({ embeds: [commandembed] });
    }
    let prefix = 'sm_';
    if (!message.channel.type == 15) return
    if (message.guild) {
        prefix = client.prefixes.get(message.guild.id)
        if (prefix === undefined) {
            prefix = 'sm_'
        }
        if (message.content.toLowerCase().includes('https://') || message.content.toLowerCase().includes('http://') || message.content.toLowerCase().includes('www.') || message.content.toLowerCase().includes('discord.gg/')) {
            LinkDetected(message, client, Discord)
        }
    }
    if (message.content.toLowerCase().startsWith(prefix) || message.content.toLowerCase().startsWith(` ${prefix}`) || message.content.startsWith('<@862247858740789269>') || message.content.startsWith('<@!862247858740789269>')) {
        if (message.guild) {
            if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
                if (message.member.permissions.has('MANAGE_CHANNELS')) {
                    return message.author.send('I do not have permission to **send messages** in the channel you just sent a command in.\nThis means **i cannot respond to you**.\n\nPlease give me Send Messages permissions so I can work properly. You can do this by editing my role\'s permissions.').catch(err => { })
                } else {
                    return message.author.send('I do not have permission to **send messages** in the channel you just sent a command in.\nThis means **i cannot respond to you**.\n\nPlease contact an administrator to give me permissions to send messages.').catch(err => { })
                }
            } if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")) {
                if (message.member.permissions.has('MANAGE_CHANNELS')) {
                    return message.author.send('I do not have permission to **embed links** in the channel you just sent a command in.\nThis means **i cannot respond to you properly**.\n\nPlease give me Embed link permissions so I can work properly. You can do this by editing my role\'s permissions.').catch(err => { })
                } else {
                    return message.author.send('I do not have permission to **embed links** in the channel you just sent a command in.\nThis means **i cannot respond to you properly**.\n\nPlease contact an administrator to give me permissions to embed links.').catch(err => { })
                }
            }

        }
        let args = undefined
        let cmd = undefined
        let command = undefined
        if (message.content.startsWith('<@')) {
            console.log(`CHATCMD | ${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content.slice(21)}`)
            args = message.content.slice(21).split(" ");
        } else if (message.content.startsWith('<@!')) {
            console.log(`CHATCMD | ${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content.slice(22)}`)
            args = message.content.slice(22).split(" ");
        } else {
            console.log(`CHATCMD | ${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content.slice(prefix.length)}`)
            args = message.content.slice(prefix.length).split(" ");
        }
        if (args[0] === '') {
            args.shift()
        }
        if (!args[0]) return
        cmd = args.shift().toLowerCase();
        command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
        userstatus = client.userstatus.get(message.author.id)
        if (userstatus == 0 && message.author.id !== '508847949413875712') return console.log('USER BLACKLISTED, ABORTING')
        if (userstatus === undefined) {
            userstatus = -1
        }
        if (userstatus == 1) {
            let blocked = await HasPerms(message, message.member, client, 'z')
            if (blocked == 2) return console.log('member has all perms denied, lel. no cmd executed')
        }
        if (userstatus == 1) {
            if (message.content.includes(';')) { // multi command using ;
                let multicommands = message.content.split(";");
                multicommands.forEach(command => {
                    if (!command) return
                    let message2 = message
                    message2.content = command
                    let args2 = undefined
                    if (message2.content.startsWith('<@')) {
                        args2 = message2.content.slice(21).split(" ");
                    } else if (message2.content.startsWith('<@!')) {
                        args2 = message2.content.slice(22).split(" ");
                    } else {
                        args2 = message2.content.slice(prefix.length).split(" ");
                    }
                    if (args2[0] === '') {
                        args2.shift()
                    }
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