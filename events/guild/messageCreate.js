const mysql = require('mysql2');
require('dotenv').config();
const { LinkDetected } = require('../../antiscamspam')
const { Rcon } = require('rcon-client')
const { exec } = require("child_process");
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
const { check_for_banned_words } = require("../../bannedwords")

allowedrcon = [

    '174095706653458432',// dad
    '757921502820696144',// huntress
    '508847949413875712',// ozai
    '146797644939788288', // rocky
    '378460598696148993', // 8ball
    '736045395221676082', // ghosty
    '957225129400737842', // redeem
    '386516963318562816' // kinkdaddy
]

module.exports = async (Discord, client, message) => {
    if (message.author.bot) return
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
        check_for_banned_words(message, client, Discord)
        if (message.channel.id == '1082526894869729370' || message.channel.id == '1084069271778377828' || message.channel.id == '1165861892233887785') {
            if (message.content.startsWith("!")) return
            if (message.author.id !== '508847949413875712') {
                if (message.content.toLowerCase().startsWith('op') || message.content.toLowerCase().startsWith('deop') || message.content.toLowerCase().startsWith('fill')) {
                    message.channel.permissionOverwrites.edit(message.author.id, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                    return message.channel.send('retard')
                }
            }
            if (message.channel.id == '1165861892233887785') {
                if (message.author.id !== "332182924528975872") return message.reply("u not tavis")
            }
            const rcon = await Rcon.connect({
                host: "112.213.34.137", port: 25575, password: `dLp3v34Y`
            })
            let response = await rcon.send(message.content)
            if (!response) { response = "Successful" }
            message.reply(`**${message.author.tag}** executed **${message.content}\n\nResponse:** ${response}`)
            rcon.end()
        }
        if (message.channel.id == "987189986732412979" || message.channel.id =="1181037684517511239") {
            if (message.content.toLowerCase().startsWith("rcon ")) {
                if (!allowedrcon.includes(message.author.id)) return message.reply("Missing Permissions.")
                if (message.content.includes(`"`)) return message.reply("sorry, commands can't contain any \"s")
                let commandrun = message.content.slice(5)
                exec(`/home/Ozaibot/events/guild/rcon/rcon -a 175.45.181.7:27015 -p awLOgErmAL "${commandrun}"`, (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
                    if (error) {
                        console.log(`exec error: ${error}`);
                        return message.channel.send(`Errored; ${stderrors}`)
                    }
                    if (logs.length > 1028) {
                        logs = logs.slice(logs.length - 1028)
                    }
                    if (!logs) {logs = "No response given."}
                    console.log(`**${message.author.username}** executed \`${commandrun}\`\nResponse:\n\`\`\`${logs}\`\`\``)
                    return message.reply(`**${message.author.username}** executed \`${commandrun}\`\nResponse:\n\`\`\`${logs}\`\`\``)
                });
            }
        }
        if (message.guild.id == '1097198237062025349') {
            if (message.mentions.members.first()) {
                message.guild.channels.cache.get('1106026288763912323').send(`${message.author.tag} pinged ${message.mentions.members.first().user.tag} in ${message.channel.name}`)
            }
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