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

const { unix } = require('moment');
const { GetPunishmentDuration } = require('../moderationinc')
module.exports = {
    name: 'raid',
    aliases: [
        'purgeinvite',//action all who used a link
        'whojoined',//all who used a link
        'whoinvited',//who inv a user
        'blacklistinvite',//blacklist
        'unblacklistinvite',//unblacklist
        'allowraidcmds', // duh
        'removeraidcmds' // duh
    ],
    description: 'anti raid functionality for ozaibot',
    async execute(message, client, cmd, args, Discord, userstatus) {

        if (!message.guild) return message.channel.send('This command must be used in a server.')
        //CAUTION HERE
        let hasperms = false;
        query = "SELECT * FROM raidstatus WHERE userid = ? && serverid = ?";
        data = [message.author.id, message.guild.id]
        connection.query(query, data, async function (error, results, fields) {
            if (error) {
                console.log(error)
                return message.channel.send('Error checking your raid command permissions, please try again later.')
            }
            if (userstatus !== 1) {
                if (results == '' || results === undefined) { // User does not have a row.
                } else {
                    userstatus = 3;
                }
            }
            if (cmd === 'whojoined') {
                if (userstatus == 1 || userstatus == 3) {
                if (!args[0]) return message.channel.send('Please give an invite for the bot to use.')
                let query = `SELECT * FROM usedinvites WHERE invitecode = ? && serverid = ?`;
                let data = [args[0], message.guild.id]
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                    }
                    if (results !== `` || results === undefined) {
                        let printstring = [];
                        for (row of results) {
                            let userid = row["userid"]
                            let time = row["time"]
                            printstring.push(userid + time)
                        }
                        for (i = 0; i <= printstring.length; i = i + 1) {
                            let entry = printstring[i]
                            if (entry) {
                                printstring.forEach(entry2 => {
                                    if (entry !== entry2) {
                                        let entryid = entry.slice(0, -10)
                                        let entry2id = entry2.slice(0, -10)
                                        if (entryid == entry2id) {
                                            let entrytime = entry.slice(entry.length - 10)
                                            let entry2time = entry2.slice(entry2.length - 10)
                                            if (entrytime <= entry2time) {
                                                delete printstring[i]
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        let finalarr = []
                        let extra = ''
                        if (finalarr.length > 67) {
                            extra = `plus ${finalarr.length - 67} more.`
                            finalarr.pop(finalarr.length - 67)
                        }
                        printstring.forEach(entry => {
                            finalarr.push(entry.slice(0, -10))
                        })
                        if (!finalarr[0]) {
                            return message.channel.send('No invites found off this link, Ozaibot may have not been in the server at the time of people joining or maybe it was offline. Please validate that this is the correct link.')
                        }
                        let printmessage = finalarr.filter((a) => a).toString()
                        printmessage = printmessage.replace(/,/g, '\n')
                        const helpembed = new Discord.MessageEmbed()
                            .setTitle('These users have joined off the link provided.')
                            .setDescription(printmessage)
                        if (!extra === '') { helpembed.setFooter({ text: extra }) }
                        helpembed.setColor('BLUE')
                        message.channel.send({ embeds: [helpembed] })
                    }
                    
                })
            } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
            } else if (cmd === 'whoinvited') {
                if (userstatus == 1 || userstatus == 3) {
                    if (!args[0]) return message.channel.send('Please give a user.')
                    let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                    if (!member) return message.channel.send('Please give a valid user.')
                    let query = `SELECT * FROM usedinvites WHERE serverid = ? && userid = ?`;
                    let data = [message.guild.id, member.id]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            console.log('backend error for whoinvited')
                            return console.log(error)
                        }
                        if (results !== `` || !results === undefined) {
                            let printstring = [];
                            for (row of results) {
                                let inviterid = row["inviterid"]
                                let time = row["time"]
                                let invitecode = row["invitecode"]
                                let inviter = client.users.cache.get(inviterid)
                                if (!inviter) {
                                    inviter = 'unknownuser'
                                } else {
                                    inviter = inviter.tag
                                }
                                printstring.push(`<t:${time}:R>: ${inviter} (${invitecode})`)
                            }
                            if (!printstring[0]) return message.channel.send('Could not find who invited this user, Ozaibot may have not been in the server at the time or maybe it was offline.')
                            let printmessage = printstring.filter((a) => a).toString()
                            printmessage = printmessage.replace(/,/g, '\n')
                            message.channel.send('Invites were used at and created by:\n' + printmessage)
                        } else {
                            if (!printstring[0]) return message.channel.send('Could not find who invited this user, Ozaibot may have not been in the server at the time or maybe it was offline.')
                        }
                    })
                } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
            } else if (cmd === 'blacklistinvite') {
                if (userstatus == 1 || userstatus == 3) {
                    if (!args[2]) return message.channel.send(`Missing arguments. Usage: \`sm_blacklistinvite <invite> <punishment> <time>\``)
                    if (!args[1] === 'mute' && !args[1] === 'kick' && !args[1] === 'ban') {
                        return message.channel.send('Invalid punishment given, valid punishments are `mute`/`kick`/`ban`')
                    }
                    let properinvite = false;
                    await message.guild.invites.fetch().then(invites => {
                        invites.forEach(invite => {
                            if (invite.code === args[0]) {
                                properinvite = true;
                            }
                        })
                    }).catch(err => { console.log(err) })
                    if (properinvite === true) {
                        const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                        const mutetimeseconds = GetPunishmentDuration(args[2])
                        if (mutetimeseconds) {
                            const timeunban = mutetimeseconds + currenttime
                            if (mutetimeseconds > 604800) return message.channel.send('You may lockdown a link for a maximum of a week.')
                            query = `SELECT * FROM lockdownlinks WHERE invitecode = ? && serverid = ?`;
                            data = [args[0], message.guild.id]
                            connection.query(query, data, function (error, results, fields) {
                                if (error) {
                                    return console.log(error)
                                }
                                if (results == '' || results === undefined) {
                                    let query = "INSERT INTO lockdownlinks (adminid, serverid, invitecode, action, timeremove) VALUES (?, ?, ?, ?, ?)";
                                    let data = [message.author.id, message.guild.id, args[0], args[1], timeunban]
                                    connection.query(query, data, function (error, results, fields) {
                                        if (error) {
                                            console.log('backend error adding a link to blacklist')
                                            return console.log(error)
                                        }
                                        message.channel.send('Link added to blacklist, anyone joining off of it will have the given punishment applied to them.')
                                    })
                                } else {
                                    for (row of results) {
                                        let action = row["action"]
                                        let timeremove = row["timeremove"]
                                        let adminid = row["adminid"]
                                        let admin = client.users.cache.get(adminid)
                                        if (admin) {
                                            admin = admin.tag
                                        } else {
                                            admin = 'Unknownuser'
                                        }
                                        return message.channel.send(`There is already a blacklist on this link that actions ${action}ing, it is to last until <t:${timeremove}> (<t:${timeremove}:R>). It was instated by ${admin}(${adminid}). \nYou can remove the blacklist by using \`sm_unblacklistinvite ${args[0]}\`, then you can add a new blacklist if needed.`)
                                    }

                                }
                            })
                        } else return message.channel.send('Invalid time given. Please refer to `sm_help times` for details on durations.')
                    } else return message.channel.send('Invalid invite code. / That invite was not found in this server')
                } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
            } else if (cmd === 'raid') {
                const helpembed = new Discord.MessageEmbed()
                    .setTitle('Anti Raid')
                    .setDescription(`This is a command set for ozaibot that is built to help with raids.\nIt has a variety of commands including commands that:\n\n\`sm_whoinvited <@user>\`\nShows you what link a user joined off.\n\n\`sm_whojoined <link_code>\`\nShow you all the users who have joined off a link.\n\n\`sm_blacklistinvite <invite_code> <mute/kick/ban> <time>\`\nLock down links so that if they are used to join your server it will automatically apply an action to them.\n\n\`sm_purgeinvite <link_code> <mute/kick/ban>\`\nApply an action to all users who have joined off a link.\nExample: kick everyone who joined off link ABC123 in the last 10 mins. would allow up to a day if needed.\n\nAnd more coming.\n\n\nEdit: I am now happy for people to be using these features if they wish, message me.\nAny time an invite link is required to be inputed you must remove the discord.gg/ at the start.\nIf the link is discord.gg/1qa2ws3ed then proper usage would be: \`sm_blacklistinvite 1qa2ws3ed\``)
                    .setTimestamp()
                    .setFooter({ text: 'Becuase of the powerful and abusable nature of these commands, You will have to get approval from me before the commands become available for use for you/your server.' })
                    .setColor('BLUE')
                message.channel.send({ embeds: [helpembed] });
                return
            } else if (cmd === 'unblacklistinvite') {
                if (userstatus == 1 || userstatus == 3) {
                    if (!args[0]) return message.channel.send('Please give an invite to unblacklist.')
                    query = `SELECT * FROM lockdownlinks WHERE invitecode = ? && serverid = ?`;
                    data = [args[0], message.guild.id]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            return console.log(error)
                        }
                        if (results == '' || results === undefined) { return message.channel.send('No blacklist found for this link.') }
                        for (row of results) {
                            let id = row["id"]
                            let action = row["action"]
                            let timeremove = row["timeremove"]
                            let query = "DELETE FROM lockdownlinks WHERE id = ?";
                            let data = [id]
                            connection.query(query, data, function (error, results, fields) {
                                if (error) {
                                    return console.log(error)
                                }
                                message.channel.send(`Deleted blacklist on invite ${args[0]}. This blacklist had the action of ${action} and was due to last until <t:${timeremove}> (<t:${timeremove}:R>)`)
                            })

                        }

                    })
                } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
            } else if (cmd === 'purgeinvite') {
                if (userstatus == 1 || userstatus == 3) {
                    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                    if (!args[1]) return message.channel.send('Usage: `sm_purgeinvite <invite> <punishment>`')
                    let action = args[1].toLowerCase()
                    if (action !== 'mute' && action !== 'kick' && action !== 'ban') return message.channel.send('The punishment must be either `mute`/`kick`/`ban`.')
                    let query = `SELECT * FROM usedinvites WHERE invitecode = ? && serverid = ? && time > ?`;
                    let data = [args[0], message.guild.id, currenttime - 86400]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            console.log('backend error for checking active bans')
                            return console.log(error)
                        }
                        if (results !== `` || results === undefined) {
                            let printstring = [];
                            for (row of results) {
                                let userid = row["userid"]
                                let time = row["time"]
                                printstring.push(userid + time)
                            }
                            for (i = 0; i <= printstring.length; i = i + 1) {
                                let entry = printstring[i]
                                if (entry) {
                                    printstring.forEach(entry2 => {
                                        if (entry !== entry2) {
                                            let entryid = entry.slice(0, -10)
                                            let entry2id = entry2.slice(0, -10)
                                            if (entryid == entry2id) {
                                                let entrytime = entry.slice(entry.length - 10)
                                                let entry2time = entry2.slice(entry2.length - 10)
                                                if (entrytime <= entry2time) {
                                                    delete printstring[i]
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                            let finalarr = []
                            let finalarrid = []
                            printstring.forEach(entry => {
                                entry = entry.slice(0, -10)
                                finalarr.push(`<@!${entry}>`)
                                finalarrid.push(entry)
                            })
                            if (!finalarr[0]) {
                                return message.channel.send('No invites found off this link, Ozaibot may have not been in the server at the time of people joining or maybe it was offline. Please validate that this is the correct link.')
                            }
                            let printmessage = finalarr.filter((a) => a).toString()
                            printmessage = printmessage.replace(/,/g, '\n')
                            const helpembed = new Discord.MessageEmbed()
                                .setTitle(`These users will have the (${args[1]}) punishment applied to them.`)
                                .setDescription(printmessage)
                                .setFooter({ text: 'Any false bans/kicks/mutes will be on you, it is unlikely that any of these people shouldnt be in this list but you should still be checking. Are you sure you want to continue with this command? Y / N' })
                                .setColor('ORANGE')
                            let filter = m => m.author.id === message.author.id;
                            message.channel.send({ embeds: [helpembed] }).then(() => {
                                message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                                    message2 = message2.first();
                                    if (message2.content.toUpperCase() == 'YES' || message2.content.toUpperCase() == 'Y') {
                                        const conformationmessage = await message.channel.send('Applying punishment to users, this may take a while.')
                                        if (action === 'ban') {
                                            let finalarr2 = []
                                            for (i = 0; i <= finalarr.length; i = i + 1) {
                                                let entry = finalarr[i]
                                                if (entry) {
                                                    let successful = true
                                                    let member = message.guild.members.cache.get(finalarrid[i])
                                                    await message.guild.members.ban(finalarrid[i], { reason: `${message.author.tag} has purged an invite, this is one of the members that was included in the purge.` })
                                                        .catch(err => {
                                                            console.log(err)
                                                            successful = false
                                                        })
                                                    if (successful) {
                                                        if (member) {
                                                            finalarr2.push(entry + ': Banned.')
                                                        } else {
                                                            finalarr2.push(entry + ': Off server banned.')
                                                        }
                                                    } else {
                                                        finalarr2.push(entry + ': Failed to ban.')
                                                    }

                                                }
                                            }
                                            let printmessage = finalarr2.filter((a) => a).toString()
                                            printmessage = printmessage.replace(/,/g, '\n')
                                            const helpembed = new Discord.MessageEmbed()
                                                .setDescription(printmessage)
                                                .setFooter({ text: 'Any fails are most likely due to the bot not having high enough permissions.' })
                                                .setColor('RED')
                                                conformationmessage.edit({content:'Done:', embeds: [helpembed] })
                                        } else if (action === 'kick') {
                                            let finalarr2 = []
                                            for (i = 0; i <= finalarr.length; i = i + 1) {
                                                let entry = finalarr[i]
                                                if (entry) {
                                                    let successful = true
                                                    let inserver = true
                                                    let member = message.guild.members.cache.get(finalarrid[i])
                                                    if (!member) {
                                                        finalarr2.push(entry + ': Not in server.')
                                                        inserver = false
                                                    }
                                                    if (inserver === true) {
                                                        await member.kick({ reason: `${message.author.tag} has purged an invite, this is one of the members that was included in the purge.` }).catch(err => { successful = false })
                                                        if (successful) {
                                                            finalarr2.push(entry + ': Kicked.')
                                                        } else {
                                                            finalarr2.push(entry + ': Failed to kick.')
                                                        }
                                                    }
                                                }
                                            }
                                            let printmessage = finalarr2.filter((a) => a).toString()
                                            printmessage = printmessage.replace(/,/g, '\n')
                                            const helpembed = new Discord.MessageEmbed()
                                                .setDescription(printmessage)
                                                .setFooter({ text: 'Any fails are most likely due to the bot not having high enough permissions.' })
                                                .setColor('RED')
                                            conformationmessage.edit({content:'Done:', embeds: [helpembed] })
                                        } else if (action === 'mute') {
                                            let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                                            let data = ['muterole', message.guild.id]
                                            connection.query(query, data, function (error, results, fields) {
                                                if (error) return console.log(error)
                                                if (results == `` || results === undefined) {
                                                    return conformationmessage.edit('There is no mute role for this server, unable to mute. Use `sm_muterole set @role` or `sm_muterole create` to set a muterole.')
                                                }
                                                for (row of results) {
                                                    let muteroleid = row["details"];
                                                    const muterole = message.guild.roles.cache.get(muteroleid)
                                                    if (!muterole) {
                                                        return conformationmessage.edit('Your servers muterole cannot be located, it may have been deleted.')
                                                    }
                                                    if (message.guild.me.roles.highest.position <= muterole.position) {
                                                        return conformationmessage.edit(`I do not have high enough permissions to add the muterole to people.`)
                                                    }
                                                    let finalarr2 = []
                                                    for (i = 0; i <= finalarr.length; i = i + 1) {
                                                        let entry = finalarr[i]
                                                        if (entry) {
                                                            let successful = true
                                                            let inserver = true
                                                            let member = message.guild.members.cache.get(finalarrid[i])
                                                            if (!member) {
                                                                finalarr2.push(entry + ': Not in server.')
                                                                inserver = false
                                                            }
                                                            if (inserver === true) {
                                                                member.roles.add(muterole).catch(err => { successful = false })
                                                                if (successful) {
                                                                    finalarr2.push(entry + ': Muted.')
                                                                } else {
                                                                    finalarr2.push(entry + ': Failed to mute.')
                                                                }
                                                            }
                                                        }
                                                    }
                                                    conformationmessage.edit('Muted all where ozaibot has enough permissions to mute and they are on the server.')
                                                }
                                            })
                                        }
                                    } else if (message2.content.toUpperCase() == 'NO' || message2.content.toUpperCase() == 'N') {
                                        return message.channel.send('Cancelled.').catch(err => { console.log(err) })
                                    } else {
                                        return message.channel.send(`Cancelled: Invalid Response`).catch(err => { console.log(err) })
                                    }
                                }).catch(collected => {
                                    console.log(collected)
                                    return message.channel.send('Timed out').catch(err => { console.log(err) })
                                });
                            });

                        }
                    })
                } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
            } else if (cmd === 'allowraidcmds') {
                if (userstatus == 1) {
                    if (!args[1]) return message.channel.send('Usage is: `sm_allowraidcmds <user> <serverid>`')
                    let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                    if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                    if (!member) return message.channel.send('Invalid member') // still no member
                    let daguild = client.guilds.cache.get(args[1])
                    if (!daguild) return message.channel.send('Invalid guild / ozaibot not in that guild.')
                    let query = "SELECT * FROM raidstatus WHERE userid = ? && serverid = ?";
                    let data = [member.id, args[1]]
                    connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) { // if they not in db, they get blacklisted
                            query = "INSERT INTO raidstatus (userid, serverid, username) VALUES (?, ?, ?)";
                            data = [member.id, args[1], member.username]
                            connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                                if (error) return console.log(error)
                                message.channel.send(`${member} has been given access to raid commands in ${daguild.name}`)
                                console.log(`${member.tag}(${member.id}) has been given raid cmds by ${message.author.tag}.`)
                                let alllogs = client.channels.cache.get('986882651921190932')
                                if (message.author.id !== '508847949413875712') {
                                    alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been given raid cmds as per the message above, given by ${message.author.tag}`)
                                }
                                return
                            })
                        } else {
                            message.channel.send('This user already has raid cmds in this server.')
                        }
                    })
                } else return message.channel.send('Botadmin required')
            } else if (cmd === 'removeraidcmds') {
                if (userstatus == 1) {
                    if (!args[0]) return message.channel.send('Usage: `sm_removeraidcmds <user> <serverid>`')
                    if (!args[1]) {
                        let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                        if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                        if (!member) return message.channel.send('Invalid member') // still no member
                        let query = "SELECT * FROM raidstatus WHERE userid = ?";
                        let data = [member.id]
                        connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                            if (error) return console.log(error)
                            if (results == ``) {
                                return message.channel.send('This user does not have access to raid commands in any server.')
                            } else {
                                query = "DELETE FROM raidstatus WHERE userid = ?";
                                data = [member.id]
                                connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                                    if (error) return console.log(error)
                                    message.channel.send(`${member} has had their raid permissions removed from all servers.`)
                                    let alllogs = client.channels.cache.get('986882651921190932')
                                    if (message.author.id !== '508847949413875712') {
                                        alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has had raid cmds removed as per the message above, done by ${message.author.tag}`)
                                    }
                                })
                            }
                        })
                        return
                    }
                    let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                    if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                    if (!member) return message.channel.send('Invalid member') // still no member
                    let daguild = client.guilds.cache.get(args[1])
                    if (!daguild) return message.channel.send('Invalid guild / ozaibot not in that guild.')
                    let query = "SELECT * FROM raidstatus WHERE userid = ? && serverid = ?";
                    let data = [member.id, args[1]]
                    connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) {
                            return message.channel.send('This user does not have access to raid commands in this server.')
                        } else {
                            query = "DELETE FROM raidstatus WHERE userid = ? && serverid = ?";
                            data = [member.id, args[1]]
                            connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                                if (error) return console.log(error)
                                message.channel.send(`${member} has had their raid permissions removed from ${daguild.name}.`)
                                let alllogs = client.channels.cache.get('986882651921190932')
                                if (message.author.id !== '508847949413875712') {
                                    alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has had raid cmds removed as per the message above, done by ${message.author.tag}`)
                                }
                            })
                        }
                    })
                } else return message.channel.send('Botadmin required')
            }
        });
    }
}
//MAKE THIS FUCKING SSHHIITT into functions
