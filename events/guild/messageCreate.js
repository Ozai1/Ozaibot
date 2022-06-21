require('dotenv').config();
const mysql = require('mysql2');
const { Rcon } = require('rcon-client')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: '8pSHlRPaaN6Gw3Kx',
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const rconclient = new Rcon({
    host: '112.213.34.137',
    port: '25575',
    password: 'ZD:*{QsdD"4NV',
});

module.exports = async (Discord, client, message) => {
    /*
    let prefixes = [`003750558849475280916sm_`,];
    let prefixeschecked = false;
    let currentprefix = [];
    */
    if (message.guild) {
        if (message.channel.id == '942735613730357269') {
            message.delete().catch(err => { console.log(err) })
        }
        if (message.channel.id == '943872986530865194') {
            if (message.author.id == '862247858740789269') return
            if (isNaN(message.content)) {
                message.channel.send('This is a counting channel.').then(message => { message.delete({ timeout: 5000 }).catch(err => { console.log(err) }) })
                message.delete().catch(err => { console.log(err) })
            } else {
                let query = "SELECT * FROM chercordcount WHERE userid = ?";
                let data = [0]
                connection.query(query, data, function (error, results, fields) {
                    if (error) return console.log(error)
                    for (row of results) {
                        let count = Number(row["count"])
                        let truecount = count + 1;
                        if (Number(message.content) !== truecount) {
                            message.delete().catch(err => { console.log(err) })
                            query = "SELECT * FROM chercordcount WHERE userid = ?";
                            data = [message.author.id]
                            connection.query(query, data, function (error, results, fields) {
                                if (error) return console.log(error)
                                if (results == '' || results === undefined) {
                                    let insults = [`${message.author} not really sure how you messed that up...\nThe correct number was ${count + 1}, this was your first mistake`, `${message.author} nice one\nThe correct number was ${count + 1}, this was your first mistake`, `${message.author} that isnt quite right\nThe correct number was ${count + 1}, this was your first mistake`, `${message.author} i hope that wassnt intentional\nThe correct number was ${count + 1}, this was your first mistake`, `${message.author} that was not the correct number\nThe correct number was ${count + 1}, this was your first mistake`, `${message.author} incorrect number\nThe correct number was ${count + 1}, this was your first mistake`];
                                    query = "INSERT INTO chercordcount (userid, count) VALUES (?, ?)";
                                    data = [message.author.id, 1]
                                    connection.query(query, data, function (error, results, fields) {
                                        if (error) return console.log(error)
                                    })
                                    let inslult = insults[Math.floor(Math.random() * insults.length)];
                                    message.channel.send(inslult).then(message => { message.delete({ timeout: 5000 }).catch(err => { console.log(err) }) })
                                } else {
                                    for (row of results) {
                                        let mistakes = Number(row["count"])
                                        if (mistakes == 1) {
                                            let insults = [`${message.author} not really sure how you messed that up...\nThe correct number was ${count + 1}, this was your second mistake`, `${message.author} nice one\nThe correct number was ${count + 1}, this was your second mistake`, `${message.author} that isnt quite right\nThe correct number was ${count + 1}, this was your second mistake`, `${message.author} i hope that wassnt intentional\nThe correct number was ${count + 1}, this was your second mistake`, `${message.author} that was not the correct number\nThe correct number was ${count + 1}, this was your second mistake`, `${message.author} incorrect number\nThe correct number was ${count + 1}, this was your second mistake`];
                                            query = "UPDATE chercordcount SET count = ? WHERE userid = ?";
                                            data = [Number(mistakes + 1), message.author.id]
                                            connection.query(query, data, function (error, results, fields) {
                                                if (error) return console.log(error)
                                            });
                                            let inslult = insults[Math.floor(Math.random() * insults.length)];
                                            message.channel.send(inslult).then(message => { message.delete({ timeout: 5000 }).catch(err => { console.log(err) }) })
                                        } else if (mistakes == 2) {
                                            let insults = [`${message.author} not really sure how you messed that up...\nThe correct number was ${count + 1}, this was your third mistake`, `${message.author} nice one\nThe correct number was ${count + 1}, this was your third mistake`, `${message.author} that isnt quite right\nThe correct number was ${count + 1}, this was your third mistake`, `${message.author} i hope that wassnt intentional\nThe correct number was ${count + 1}, this was your third mistake`, `${message.author} that was not the correct number\nThe correct number was ${count + 1}, this was your third mistake`, `${message.author} incorrect number\nThe correct number was ${count + 1}, this was your third mistake`];
                                            query = "UPDATE chercordcount SET count = ? WHERE userid = ?";
                                            data = [Number(mistakes + 1), message.author.id]
                                            connection.query(query, data, function (error, results, fields) {
                                                if (error) return console.log(error)
                                            });
                                            let inslult = insults[Math.floor(Math.random() * insults.length)];
                                            message.channel.send(inslult).then(message => { message.delete({ timeout: 5000 }).catch(err => { console.log(err) }) })
                                        } else {
                                            let insults = [`${message.author} not really sure how you messed that up...\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`, `${message.author} nice one\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`, `${message.author} that isnt quite right\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`, `${message.author} i hope that wassnt intentional\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`, `${message.author} that was not the correct number\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`, `${message.author} incorrect number\nThe correct number was ${count + 1}, this was your ${mistakes + 1}th mistake`];
                                            query = "UPDATE chercordcount SET count = ? WHERE userid = ?";
                                            data = [Number(mistakes + 1), message.author.id]
                                            connection.query(query, data, function (error, results, fields) {
                                                if (error) return console.log(error)
                                            });
                                            let inslult = insults[Math.floor(Math.random() * insults.length)];
                                            message.channel.send(inslult).then(message => { message.delete({ timeout: 5000 }).catch(err => { console.log(err) }) })
                                        }
                                    }
                                }
                            })
                        } else {
                            query = "UPDATE chercordcount SET count = ? WHERE userid = ?";
                            data = [Number(count + 1), 0]
                            connection.query(query, data, function (error, results, fields) {
                                if (error) return console.log(error)
                            });
                        }
                    }
                })
            }
        }
        if (message.channel.id == '984719070022762507') {
            if (message.author.id == client.user.id) return
            if (!message.content.startsWith('norcon') && !message.content.startsWith('sm_')) {
                if (message.author.id == '368587996112486401') {
                    if (message.content.toLowerCase().startsWith('op') || message.content.toLowerCase().startsWith('deop ozai1')) {
                        await message.channel.permissionOverwrites.edit(message.author.id, { SEND_MESSAGES: false }).catch(err => { console.log(err) })
                        message.channel.send('why u do dat')
                        return
                    }
                    if (message.content.toLowerCase().startsWith('gamemode creative')) {
                        message.channel.send('would really rather not creative. the rest of the gamemodes are fine tho')
                        return
                    }
                }
                await rconclient.connect().catch(err => {
                    message.channel.send(`Error detected:\n${err}`)
                })
                let response = await rconclient.send(message.content)
                if (response === '') {
                    response = 'Successful.'
                }
                if (response.length > 2000) {
                    if (response.length > 4000) {
                        let sendingmessage = response.slice(0, -(response.length - 4000))
                        const embed77 = new Discord.MessageEmbed()
                            .setDescription(`${sendingmessage}`)
                        embed77.setFooter({ text: `+${response.length - 4000} characters more` })
                        message.channel.send({ embeds: [embed77] })
                    }
                } else {
                    message.reply(`\n${response}`)
                }
                rconclient.end()
            }
        }
    }
    if (message.author.bot) return
    if (message.channel.name === undefined) {
        if (message.author.id === '862247858740789269') return
        let dmlogs = client.channels.cache.get('986883430388207646');
        const commandembed = new Discord.MessageEmbed()
            .setDescription(`**${message.author.tag} IN DMS \n"**${message.content}**".**`)
            .setTimestamp()
        dmlogs.send({ embeds: [commandembed] });
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
            console.log(`${message.author.tag} in ${message.guild}, ${message.channel.name}: ${message.content.slice(prefix.length)}`)

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
            let args = message.content.slice(prefix.length).split(" ");
            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
            // if (message.guild) {
            //     let alllogs = client.channels.cache.get('986882651921190932');
            //     const commandembed = new Discord.MessageEmbed()
            //         .setDescription(`**${message.guild}** (${message.guild.id})\n ${message.channel} (${message.channel.name} | ${message.channel.id})\n**${message.author.tag}** (${message.author.id})\n"${message.content}".`)
            //         .setTimestamp()
            //     alllogs.send({ embeds: [commandembed] });
            // } else {
            //     let alllogs = client.channels.cache.get('986882651921190932');
            //     const commandembed = new Discord.MessageEmbed()
            //         .setDescription(`**${message.author.tag}** (${message.author.id}) IN DMS\n"${message.content}".`)
            //         .setTimestamp()
            //     alllogs.send({ embeds: [commandembed] });
            // }
            query = "SELECT * FROM userstatus WHERE userid = ?";
            data = [message.author.id]
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
                if (results == '' || results === undefined) { // User does not have a row.
                    var userstatus = false;
                    if (command) command.execute(message, client, cmd, args, Discord, userstatus)
                    return
                } for (row of results) {
                    var userstatus = row["status"];
                } if (userstatus == 0) {
                    return
                } else if (userstatus == 1) {
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
            });
        }
    })
}