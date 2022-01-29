require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibotservers',
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
    if (message.channel.id == '928962860103630848') {
        if (message.author.id !== '508847949413875712' && message.author.id !== '742612722465636393') {
            if (message.attachments.size > 0 || message.content.includes('https:')) return
            message.delete().catch(err => { console.log(err) })
            message.author.send('Your message must contain an image, video or gif in this channel.').catch(err => { })
        }
    }
    if (message.guild) {
        if (message.author.id == message.guild.me.id) return
        if (message.guild.id == '561393847205101568' || message.guild.id == '911829929962901514') {
            if (message.content.toLowerCase().includes('free discord nitro') || message.content.toLowerCase().includes('personalize your profile') || message.content.toLowerCase().includes('discord nitro for free') || message.content.toLowerCase().includes('share your screen in hd') || message.content.toLowerCase().includes('free nitro') || message.content.toLowerCase().includes('spare nitro') || message.content.toLowerCase().includes('months of discord nitro') || message.content.toLowerCase().includes('nitro for 1 year')) {
                console.log(`${message.member.id} has been muted for potential scam, awaiting approval from mods.\nThe message was: \n\`\`\`\n${message.content}\n\`\`\`\n**DO NOT CLICK ANY LINKS**\nIf this is a scam use \`sm_ban ${message.author.id} 1 scam links\`\nIf this is not a scam use \`sm_unmute ${message.author.id}\` and please report to me the false flag so i can refine the bot.`)
                message.delete().catch(err => { console.log(err) })
                try {
                    let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                    let data = ['muterole']
                    serversdb.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                        if (results == ``) {
                            console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                            return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                        }
                        for (row of results) {
                            let muteroleid = row["details"];
                            const muterole = message.guild.roles.cache.get(muteroleid)
                            let member = message.member
                            if (!muterole) {
                                console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                            }
                            if (message.guild.me.roles.highest.position <= muterole.position) {
                                console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                            }
                            if (!member) {
                                console.log('invalid member')
                                const errorembed = new Discord.MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL())
                                    .setColor(15684432)
                                    .setDescription(`Invalid member.im not sure how we managed to get here but somehow the damn author of the message wassnt found`)
                                return message.channel.send(errorembed)
                            }
                            member.roles.add(muterole).catch(err => {
                                console.log(err)
                                message.channel.send('Failed.')
                            })

                        }
                    })
                    const modchannel = client.channels.cache.get('926782590826987563')
                    modchannel.send(`${message.member} has been muted for potential scam, awaiting approval from mods.\nThe message was: \n\`\`\`\n${message.content}\n\`\`\`\n**DO NOT CLICK ANY LINKS**\nIf this is a scam use \`sm_ban ${message.author.id} 1 scam links\`\nIf this is not a scam use \`sm_unmute ${message.author.id}\` and please report to me the false flag so i can refine the bot.`).catch(err => {console.log(err)})
                    query = "INSERT INTO activebans (userid, serverid, timeunban, type) VALUES (?, ?, ?, ?)";
                    data = [message.member.id, message.guild.id, 9999999999, 'mute']
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            message.channel.send('There was a backend error :/')
                            return console.log(error)
                        }
                        return
                    })
                } catch (err) {
                    console.log(err)
                }
                return
            } else {
                for (i = 0; i <= 7; i = i + 1) {
                    if (message.content.toLowerCase().includes(`nitro for ${i} months`)) {
                        if (message.content.toLowerCase().includes('http')) {
                            console.log(`${message.member.id} has been muted for potential scam, awaiting approval from mods.\nThe message was: \n\`\`\`\n${message.content}\n\`\`\`\n**DO NOT CLICK ANY LINKS**\nIf this is a scam use \`sm_ban ${message.author.id} 1 scam links\`\nIf this is not a scam use \`sm_unmute ${message.author.id}\` and please report to me the false flag so i can refine the bot.`)
                            message.delete().catch(err => { console.log(err) })
                            try {
                                let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                                let data = ['muterole']
                                serversdb.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error)
                                    if (results == ``) {
                                        console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                                    }
                                    for (row of results) {
                                        let muteroleid = row["details"];
                                        const muterole = message.guild.roles.cache.get(muteroleid)
                                        let member = message.member
                                        if (!muterole) {
                                            console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                            return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                        }
                                        if (message.guild.me.roles.highest.position <= muterole.position) {
                                            console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                            return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                        }
                                        if (!member) {
                                            console.log('invalid member')
                                            const errorembed = new Discord.MessageEmbed()
                                                .setAuthor(message.author.tag, message.author.avatarURL())
                                                .setColor(15684432)
                                                .setDescription(`Invalid member.im not sure how we managed to get here but somehow the damn author of the message wassnt found`)
                                            return message.channel.send(errorembed)
                                        }
                                        member.roles.add(muterole).catch(err => {
                                            console.log(err)
                                            message.channel.send('Failed.')
                                        })
                                    }
                                })
                                const modchannel = client.channels.cache.get('926782590826987563')
                                modchannel.send(`${message.member} has been muted for potential scam, awaiting approval from mods.\nThe message was: \n\`\`\`\n${message.content}\n\`\`\`\n**DO NOT CLICK ANY LINKS**\nIf this is a scam use \`sm_ban ${message.author.id} 1 scam links\`\nIf this is not a scam use \`sm_unmute ${message.author.id}\` and please report to me the false flag so i can refine the bot.`).catch(err => {console.log(err)})
                                query = "INSERT INTO activebans (userid, serverid, timeunban, type) VALUES (?, ?, ?, ?)";
                                data = [message.member.id, message.guild.id, 9999999999, 'mute']
                                connection.query(query, data, function (error, results, fields) {
                                      if (error) {
                                            message.channel.send('There was a backend error :/')
                                            return console.log(error)
                                      }
                                      return
                                })
                            } catch (err) {
                                console.log(err)
                            }
                            return
                        }
                    }
                }
            }
        }
    }
    if (message.author.bot) return
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