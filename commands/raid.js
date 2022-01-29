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
const { unix } = require('moment');

module.exports = {
    name: 'raid',
    aliases: [
        'purgeinvite',//action all who used a link
        'whojoined',//all who used a link
        'whoinvited',//who inv a user
        'blacklistinvite',//blacklist
        'unblacklistinvite',//unblacklist
        'raidapp'//getting access
    ],
    description: 'anti raid functionality for ozaibot',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('These commands should only be used in a server.')
        //CAUTION HERE
        if (cmd === 'whojoined') {
            if (!args[0]) return message.channel.send('Please give an invite for the bot to use.')
            let query = `SELECT * FROM invites WHERE invitecode = ? && serverid = ?`;
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
                    for (i = 0; i <= printstring.length; i = i + 1) { // loop 100 times
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
                    if (!extra === '') { helpembed.setFooter(extra) }
                    helpembed.setColor('BLUE')
                    message.channel.send(helpembed)
                }
            })
        } else if (cmd === 'whoinvited') {
            if (userstatus == 1 || userstatus == 3) {
                let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                if (!member) return message.channel.send('Please give a valid member.')
                let query = `SELECT * FROM invites WHERE serverid = ? && userid = ?`;
                let data = [message.guild.id, member.id]
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for whoinvited')
                        return console.log(error)
                    }
                    if (results !== `` || results === undefined) {
                        let printstring = [];
                        for (row of results) {
                            let inviterid = row["inviterid"]
                            let time = row["time"]
                            let inviter = client.users.cache.get(inviterid)
                            if (!inviter) {
                                inviter = 'unknownuser'
                            } else {
                                inviter = inviter.tag
                            }
                            printstring.push(`<t:${time}:R>: ${inviter}`)
                        }
                        if (!printstring[0]) return message.channel.send('Ozaibot could not find who invited this user, Ozaibot may have not been in the server at the time or maybe it was offline.')
                        let printmessage = printstring.filter((a) => a).toString()
                        printmessage = printmessage.replace(/,/g, '\n')
                        message.channel.send('Invites were used at and created by:\n' + printmessage)
                    }
                })
            } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
        } else if (cmd === 'blacklistinvite') {
            if (userstatus == 1 || userstatus == 3) {
                if (!args[0]) return message.channel.send('Please give an invite for the bot to use.')
                if (!args[1]) return message.channel.send('Please give an action for the bot to execute on link usage.\nThe actions you may use are `mute/kick/ban`')
                if (!args[1] === 'mute' && !args[1] === 'kick' && !args[1] === 'ban') {
                    return message.channel.send('Invalid action given, valid actions are `mute/kick/ban`')
                }
                if (!args[2]) return message.channel.send('Please add the amount of time this link blacklist should exist.')
                let properinvite = false;
                await message.guild.fetchInvites().then(invites => {
                    invites.forEach(invite => {
                        if (invite.code === args[0]) {
                            properinvite = true;
                        }
                    })
                }).catch(err => { console.log(err) })
                if (properinvite === true) {
                    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                    let timeunban = 9999999999;
                    let mutetimeseconds = null;
                    const validtimes = ['s-sec', 'sec-sec', 'second-sec', 'secs-sec', 'seconds-sec', 'm-min', 'min-min', 'mins-min', 'minute-min', 'minutes-min', 'h-hou', 'hour-hou', 'hours-hou', 'd-day', 'day-day', 'days-day', 'w-wee', 'week-wee', 'weeks-wee', 'mon-mon', 'months-mon']
                    let unitoftime = null;
                    let unitchosenraw = null;
                    const timechosen = args[2];
                    let timechosenpostfixfound = false;
                    validtimes.forEach((potentialtime2) => {
                        const potentialtime = potentialtime2.slice(0, -4)
                        if (timechosenpostfixfound === false) {
                            if (potentialtime === timechosen.slice(timechosen.length - 1)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 1)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                            } else if (potentialtime === timechosen.slice(timechosen.length - 3)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 3)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                            } else if (potentialtime === timechosen.slice(timechosen.length - 4)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 4)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                            } else if (potentialtime === timechosen.slice(timechosen.length - 5)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 5)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                            } else if (potentialtime === timechosen.slice(timechosen.length - 6)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 6)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)
                            } else if (potentialtime === timechosen.slice(timechosen.length - 7)) {
                                unitchosenraw = timechosen.slice(timechosen.length - 7)
                                timechosenpostfixfound = true
                                unitoftime = potentialtime2.slice(potentialtime2.length - 3)

                            }
                        }
                    })
                    if (timechosenpostfixfound === true) {
                        if (unitoftime === 'min') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 60;
                            timeunban = Number(mutetimeseconds + currenttime);
                        } else if (unitoftime === 'hou') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 3600;
                            timeunban = mutetimeseconds + currenttime;
                        } else if (unitoftime === 'day') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 86400;
                            timeunban = Number(mutetimeseconds + currenttime);
                        } else if (unitoftime === 'wee') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 604800;
                            timeunban = Number(mutetimeseconds + currenttime);
                        } else if (unitoftime === 'mon') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 2592000;
                            timeunban = Number(mutetimeseconds + currenttime);
                        } else if (unitoftime === 'sec') {
                            mutetimeseconds = timechosen.slice(0, -unitchosenraw.length);
                            timeunban = Number(mutetimeseconds) + currenttime;
                        }
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
                    } else {
                        return message.channel.send('Invalid time given. `sec/min/hour/day/week`, there are a lot more than that but those are the only units chosable. you may do things like 0.4hour too')
                    }
                } else {
                    return message.channel.send('Invalid invite code. / That invite was not found in this server')
                }
            } else return message.channel.send('You do not have access to anti raid commands. Use `sm_raid` for more info.')
        } else if (cmd === 'raid') {
            const helpembed = new Discord.MessageEmbed()
                .addField(`Anti Raid`, `This is a command set for ozaibot that is built to help with raids.\nIt has a variety of commands including commands that:\n\nShow you who joined off a link\nExample: what link did this person join off?\n\nShow you all the users who have joined off a link.\n\nLock down links so that if they are used to join your server it will automatically apply an action to them.\n\nApply an action to all users who have joined off a link.\nExample: kick everyone who joined off link ABC123 in the last 10 mins. would allow up to a day if needed.\n\nAnd more coming.\n\n\nThis is under development but most of it already works, only needs to be refined to a user friendly level.\n\nEdit: I am now happy for people to start using these features if they wish, you may apply using \`sm_raidapp\`.\nAll of these commands do indeed currently work but i am still adding features and little error catches and the likes.`)
                .setTimestamp()
                .setFooter('Becuase of the powerful and abusable nature of these commands, You will have to get approval from me before the commands become available for use for you/your server.')
                .setColor('BLUE')
            message.channel.send(helpembed);
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
                if (!args[0]) return message.channel.send('Please give an invite for the bot to use.')
                if (!args[1]) return message.channel.send('Please chose a punishment, ban/kick/mute.')
                let action = args[1].toLowerCase()
                if (action !== 'mute' && action !== 'kick' && action !== 'ban') return message.channel.send('The punishment must be either mute/kick/ban.')
                let query = `SELECT * FROM invites WHERE invitecode = ? && serverid = ? && time > ?`;
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
                        for (i = 0; i <= printstring.length; i = i + 1) { // loop 100 times
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
                            .setTitle('These users will have the punishment applied to them.')
                            .setDescription(printmessage)
                            .setFooter('Any false bans/kicks/mutes will be on you, it is unlikely that any of these people shouldnt be in this list but you should still be checking. Are you sure you want to continue with this command? Y / N')
                            .setColor('ORANGE')
                        let filter = m => m.author.id === message.author.id;
                        message.channel.send(helpembed).then(() => {
                            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(async message => {
                                message = message.first();
                                if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                    const conformationmessage = await message.channel.send('Applying punishment to users, this may take a while.')
                                    if (action === 'ban') {
                                        let finalarr2 = []
                                        for (i = 0; i <= finalarr.length; i = i + 1) { // loop 100 times
                                            let entry = finalarr[i]
                                            if (entry) {
                                                let successful = true
                                                let inserver = true
                                                let member = message.guild.members.cache.get(finalarrid[i])
                                                if (!member) {
                                                    await message.guild.members.ban(entry, { reason: `${message.author.tag} has purged an invite, this is one of the members that was included in the purge.` }).catch(err => { successful = false })
                                                    if (successful) {
                                                        finalarr2.push(entry + ': Off server banned.')
                                                    } else {
                                                        finalarr2.push(entry + ': Failed to ban.')
                                                    }
                                                    inserver = false
                                                }
                                                if (inserver = true) {
                                                    await member.ban({ reason: `${message.author.tag} has purged an invite, this is one of the members that was included in the purge.` }).catch(err => { successful = false })
                                                    if (successful) {
                                                        entry = entry + ': Banned.'
                                                    } else {
                                                        entry = entry + ': Failed to ban.'
                                                    }
                                                }
                                            }
                                        }
                                        let printmessage = finalarr2.filter((a) => a).toString()
                                        printmessage = printmessage.replace(/,/g, '\n')
                                        const helpembed = new Discord.MessageEmbed()
                                            .setDescription(printmessage)
                                            .setFooter('Any fails are most likely due to the bot not having high enough permissions.')
                                            .setColor('RED')
                                        conformationmessage.edit('Done:', { embed: helpembed })
                                    } else if (action === 'kick') {
                                        let finalarr2 = []
                                        for (i = 0; i <= finalarr.length; i = i + 1) { // loop 100 times
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
                                            .setFooter('Any fails are most likely due to the bot not having high enough permissions.')
                                            .setColor('RED')
                                        conformationmessage.edit('Done:', { embed: helpembed })
                                    } else if (action === 'mute') {
                                        let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                                        let data = ['muterole']
                                        serversdb.query(query, data, function (error, results, fields) {
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
                                                for (i = 0; i <= finalarr.length; i = i + 1) { // loop 100 times
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
                                } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
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
        } else if (cmd === 'raidapp') {
            let query = `SELECT * FROM applications WHERE userid = ? && serverid = ? && type = ? && status = ?`;
            let data = [message.author.id, message.guild.id, 'raid', 'pending']
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    console.log('backend error for checking active bans')
                    return console.log(error)
                }
                if (results == '' || results === undefined) {
                    if (!args[1]) return message.channel.send('Usage is: `sm_raidapp <reason why you should have raid commands>`')
                    let appchannel = client.channels.cache.get('931071249478742036')
                    const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
                    query = "INSERT INTO applications (userid, serverid, time, type, status, reason) VALUES (?, ?, ?, ?, ?, ?)";
                    data = [message.author.id, message.guild.id, currenttime, 'raid', 'pending', args.slice(0).join(" ")]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            console.log('backend error for checking active bans')
                            return console.log(error)
                        }
                        message.channel.send('Thank you for applying, your response will be returned to you in a private message from the bot as soon as I see the application.')
                    })
                    query = `SELECT * FROM applications WHERE userid = ? && serverid = ? && type = ? && status = ?`;
                    data = [message.author.id, message.guild.id, 'raid', 'pending']
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            console.log('backend error for checking active bans')
                            return console.log(error)
                        }
                        for (row of results) {
                            let id = row["id"]
                            const helpembed = new Discord.MessageEmbed()
                                .setTitle('New raid application.')
                                .addField('Author:', `<@${message.author.id}> | ${message.author.tag} (${message.author.id})`)
                                .addField('Guild', `${message.guild} (${message.guild.id})`)
                                .addField('time', `<t:${currenttime}> (<t:${currenttime}:R>)`)
                                .setDescription(`**Message**:\n${args.slice(0).join(" ")}`)
                                .setFooter(`application #${id}, sm_apprespond ${id} <accept/deny/pending> <message>`)
                                .setColor('BLUE')
                            appchannel.send(helpembed).catch(err => { console.log(err) })
                        }
                    })
                } else return message.channel.send('You already have a raid app in.')

            })
        } else if (cmd === 'allowraidcmds') {
            if (userstatus !== 1) return

            
        } else if (cmd === 'removeraidcmds') {
            if (userstatus !== 1) return

            
        }
    }
}