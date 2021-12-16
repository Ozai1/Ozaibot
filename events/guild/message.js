require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'ozaibot',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
module.exports = (Discord, client, message) => {
    /*
    let prefixes = [`003750558849475280916sm_`,];
    let prefixeschecked = false;
    let currentprefix = [];
    */
    if (message.author.bot) return
    if ((message.content.toLowerCase().includes('<@!753454519937007696>') && message.content.toLowerCase().includes('chink')) || (message.content.toLowerCase().includes('<@!753454519937007696>') && message.content.toLowerCase().includes('nigga')) || (message.content.toLowerCase().includes('cherry') && message.content.toLowerCase().includes('nigga')) || (message.content.toLowerCase().includes('cherry') && message.content.toLowerCase().includes('chink'))) {
        console.log(`${message.author.tag} flagged for the message: "${message.content}" in ${message.guild} (${message.guild.id}), ${message.channel.name}`)
        let alllogs = client.channels.cache.get('882845463647256637')
        alllogs.send(`<@!508847949413875712>, ${message.author.tag} flagged for the message: "${message.content}" in ${message.guild}, ${message.channel.name}`)
    }
    if (message.channel.type === 'dm') {
        if (message.author.id === '862247858740789269') return
        let dmlogs = client.channels.cache.get('900507984264847361');
        const commandembed = new Discord.MessageEmbed()
            .setDescription(`**${message.author.tag} IN DMS \n"**${message.content}**".**`)
            .setTimestamp()
        dmlogs.send(commandembed);
    }
    let prefix = 'sm_';
    /*
    if (prefixeschecked === false) {
    }
    prefixes.forEach(entry =>  {
    let numberentry = Number(entry.length);
    numberentry = numberentry - 3;
    numberentry = entry.slice(0, -numberentry);//prefix length extracted
    let identry = entry.slice(3)
    identry = identry.slice(0, -numberentry)
    let prefixentry = entry.slice(21)
    console.log(`${prefixentry} ${identry}`)
    if (identry == message.guild.id) {
        prefix = prefixentry
    }
    })
    */
    let query = "SELECT * FROM prefixes WHERE serverid = ?";
    if (message.guild) { // if server
        data = [message.guild.id]
    } else { // if dms
        data = [0000]
    }
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
        for (row of results) {
            prefix = row["prefix"];
        }
        if (message.content.toLowerCase().startsWith(prefix) || message.content.toLowerCase().startsWith(`${prefix}`)) {
            console.log(`${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content}`)

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
                } else if (!(results === ``)) {
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
            let args = message.content.slice(prefix.length).split(" ");
            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
            if (message.guild) {
                let alllogs = client.channels.cache.get('882845463647256637');
                const commandembed = new Discord.MessageEmbed()
                    .setDescription(`**${message.guild}** (${message.guild.id})\n ${message.channel} (${message.channel.name} | ${message.channel.id})\n**${message.author.tag}** (${message.author.id})\n"${message.content}".`)
                    .setTimestamp()
                alllogs.send(commandembed);
            } else {
                let alllogs = client.channels.cache.get('882845463647256637');
                const commandembed = new Discord.MessageEmbed()
                    .setDescription(`**${message.author.tag}** (${message.author.id}) IN DMS\n"${message.content}".`)
                    .setTimestamp()
                alllogs.send(commandembed);
            }
            query = "SELECT * FROM userstatus WHERE userid = ?";
            data = [message.author.id]
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
                if (!results) {
                    var userstatus = false;
                    if (command) command.execute(message, client, cmd, args, Discord, userstatus)
                    return
                } for (row of results) {
                    var userstatus = row["status"];
                } if (userstatus == 0) {
                    return
                } else {
                    if (command) command.execute(message, client, cmd, args, Discord, userstatus)
                }
            });
        }
    })
}