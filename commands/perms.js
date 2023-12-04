const mysql = require('mysql2');

require('dotenv').config();
const { GetMember, GetFlagName, NameToFlag, GetMemberOrRole } = require("../moderationinc")
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
    name: 'perms',
    description: 'Shows/sets a user\'s/role\'s permissions within the bot to allow/deny commands',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (!message.member.permissions.has('ADMINISTRATOR') && !userstatus == 1) return message.channel.send('You do not have access to this command.')
        if (!args[0]) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid usage.\n\nProper useage:\n\`perms <member|role> [list|allow|deny|clear] [permission]\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (!args[1]) {
            const member = await GetMemberOrRole(message, client, args[0], Discord, true, true)
            if (!member) return message.channel.send('Invalid member/role.')
            return list_perms(message, client, args, Discord, member, invalidusage = 1)
        }
        const member = await GetMemberOrRole(message, client, args[1], Discord, true, true)
        if (!member) return message.channel.send('Invalid member/role.')
        let argument69420 = args[0].toLowerCase()
        if (args[0] === 'list') {
            list_perms(message, client, args, Discord, member)
        } else if (argument69420 === 'allow') {
            allow_perms(message, client, args, Discord, member)
        } else if (argument69420 === 'deny') {
            deny_perms(message, client, args, Discord, member)
        } else if (argument69420 === 'clear') {
            clear_perms(message, client, args, Discord, member)
        } else if (argument69420 === 'search') {
            search_perms(message, client, args, DIscord, member)
        } else {
            return message.channel.send('Invalid usage.')
        }
    }
}

async function list_perms(message, client, args, Discord, member, invalidusage) {
    if (member.type2 === 'user') { // member is a user, not a role
        let negroleperms = client.negativeuserpermissions.get(message.guild.id)
        let posroleperms = client.positiveuserpermissions.get(message.guild.id)
        let positiveperms = []
        let negativeperms = []
        let theperms = posroleperms.get(member.id)
        let theperms2 = negroleperms.get(member.id)
        if (member.user) {
            usertag = member.user.tag
            avURL = member.user.avatarURL()
        } else {
            usertag = member.tag
            avURL = member.avatarURL()
        }
        if (theperms) {
            theperms = theperms.split("")
            theperms.forEach(perm => {
                perm = GetFlagName(perm)
                if (!positiveperms.includes(perm)) positiveperms.push(`${perm}`)
            })
        } if (theperms2) {
            theperms2 = theperms2.split("")
            theperms2.forEach(perm => {
                perm = GetFlagName(perm)
                if (!negativeperms.includes(perm)) negativeperms.push(`${perm}`)
            })
        }
        if (!positiveperms[0]) {
            positiveperms = 'None.'
        } else {
            positiveperms = positiveperms.filter((a) => a).toString()
            positiveperms = positiveperms.replace(/,/g, '\n')
        }
        if (!negativeperms[0]) {
            negativeperms = 'None.'
        } else {
            negativeperms = negativeperms.filter((a) => a).toString()
            negativeperms = negativeperms.replace(/,/g, '\n')
        }
        const permsembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${usertag} (${member.id})`, iconURL: avURL })
            .setDescription(`**Allowed:**\n${positiveperms}\n\n**Denied:**\n${negativeperms}`)
            .setColor('BLUE')
        if (invalidusage) {
            permsembed.setFooter({ text: 'Proper usage: perms [list|allow|deny|clear] [member|role]' })
        }
        message.channel.send({ embeds: [permsembed] })
    } else {
        let negroleperms = client.negativerolepermissions.get(message.guild.id)
        let posroleperms = client.positiverolepermissions.get(message.guild.id)
        let positiveperms = []
        let negativeperms = []
        let theperms = posroleperms.get(member.id)
        let theperms2 = negroleperms.get(member.id)
        if (theperms) {
            theperms = theperms.split("")
            theperms.forEach(perm => {
                perm = GetFlagName(perm)
                if (!positiveperms.includes(perm)) positiveperms.push(`${perm}`)
            })
        } if (theperms2) {
            theperms2 = theperms2.split("")
            theperms2.forEach(perm => {
                perm = GetFlagName(perm)
                if (!negativeperms.includes(perm)) negativeperms.push(`${perm}`)
            })
        }
        if (!positiveperms[0]) {
            positiveperms = 'None.'
        } else {
            positiveperms = positiveperms.filter((a) => a).toString()
            positiveperms = positiveperms.replace(/,/g, '\n')
        }
        if (!negativeperms[0]) {
            negativeperms = 'None.'
        } else {
            negativeperms = negativeperms.filter((a) => a).toString()
            negativeperms = negativeperms.replace(/,/g, '\n')
        }
        const permsembed = new Discord.MessageEmbed()
            .setDescription(`${member} (${member.name})\n\n**Allowed:**\n${positiveperms}\n\n**Denied:**\n${negativeperms}`)
            .setColor('BLUE')
        if (invalidusage) {
            permsembed.setFooter({ text: 'Proper usage: perms [list|allow|deny|clear] [member|role]' })
        }
        message.channel.send({ embeds: [permsembed] })
    }
}

async function allow_perms(message, client, args, Discord, member) {
    if (member.type2 === 'user') {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of users of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    } else {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.position) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of roles of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    }
    if (!args[2]) return message.channel.send('Please give a command/module to allow.')
    let perm = NameToFlag(args[2])
    if (!perm) return message.channel.send('Invalid permission.')
    let posperms = []
    let negperms = []
    if (member.type2 === 'user') {
        let neguserperms = client.negativeuserpermissions.get(message.guild.id)
        let posuserperms = client.positiveuserpermissions.get(message.guild.id)
        posperms = posuserperms.get(member.id)
        negperms = neguserperms.get(member.id)
        if (posperms) {
            posperms = posperms.split("")
        } else {
            posperms = []
        }
        if (negperms) {
            negperms = negperms.split("")
        } else {
            negperms = []
        }
        let isindb = false
        if (posperms[0] || negperms[0]) {
            isindb = true
        }
        if (posperms) {
            if (posperms.includes(perm)) return message.channel.send('This permission is already allowed for this user/role.')
        }
        if (negperms[0]) {
            if (negperms.includes(perm)) {
                for (let i = 0; i < negperms.length; i++) {
                    if (negperms[i] === perm) {
                        delete negperms[i]
                    }
                }
                posperms.push(perm)
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                let data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                posuserperms.set(member.id, posperms)
                neguserperms.set(member.id, negperms)
            } else {
                posperms.push(perm)
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                if (isindb) {
                    let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                    let data = [posperms, message.guild.id, member.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                } else {
                    let query = `INSERT INTO permissions (serverid, id2, type, positive) VALUES (?, ?, ?, ?)`;
                    let data = [message.guild.id, member.id, 'u', posperms];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                }
                posuserperms.set(member.id, posperms)
            }
        }
        else {
            if (!posperms) {
                posperms = []
            }
            posperms.push(perm)
            posperms = posperms.filter((a) => a).toString()
            posperms = posperms.replace(/,/g, '')
            posperms = posperms.replace(/ /g, '')
            if (isindb) {
                let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                let data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            } else {
                let query = `INSERT INTO permissions (serverid, id2, type, positive) VALUES (?, ?, ?, ?)`;
                let data = [message.guild.id, member.id, 'u', posperms];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            }
            posuserperms.set(member.id, posperms)
        }
        const permsembed = new Discord.MessageEmbed()
            .setDescription(`<:check:988867881200652348> Granted ${member} the **${GetFlagName(perm)}** permission.`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    } else {
        let neguserperms = client.negativerolepermissions.get(message.guild.id)
        let posuserperms = client.positiverolepermissions.get(message.guild.id)
        posperms = posuserperms.get(member.id)
        negperms = neguserperms.get(member.id)
        if (posperms) {
            posperms = posperms.split("")
        } else {
            posperms = []
        }
        if (negperms) {
            negperms = negperms.split("")
        } else {
            negperms = []
        }
        let isindb = false
        if (posperms[0] || negperms[0]) {
            isindb = true
        }
        if (posperms) {
            if (posperms.includes(perm)) return message.channel.send('This permission is already allowed for this user/role.')
        }
        if (negperms[0]) {
            if (negperms.includes(perm)) {
                for (let i = 0; i < negperms.length; i++) {
                    if (negperms[i] === perm) {
                        delete negperms[i]
                    }
                }
                posperms.push(perm)
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                let data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                posuserperms.set(member.id, posperms)
                neguserperms.set(member.id, negperms)
            } else {
                posperms.push(perm)
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                if (isindb) {
                    let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                    let data = [posperms, message.guild.id, member.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                } else {
                    let query = `INSERT INTO permissions (serverid, id2, type, positive) VALUES (?, ?, ?, ?)`;
                    let data = [message.guild.id, member.id, 'r', posperms];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                }
                posuserperms.set(member.id, posperms)

            }
        }
        else {
            if (!posperms) {
                posperms = []
            }
            posperms.push(perm)
            posperms = posperms.filter((a) => a).toString()
            posperms = posperms.replace(/,/g, '')
            posperms = posperms.replace(/ /g, '')
            if (isindb) {
                let query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                let data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            } else {
                let query = `INSERT INTO permissions (serverid, id2, type, positive) VALUES (?, ?, ?, ?)`;
                let data = [message.guild.id, member.id, 'r', posperms];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            }
            posuserperms.set(member.id, posperms)
        }
        const permsembed = new Discord.MessageEmbed()
            .setDescription(`<:check:988867881200652348> Granted ${member} the **${GetFlagName(perm)}** permission.`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    }
}

async function deny_perms(message, client, args, Discord, member) {
    if (member.type2 === 'user') {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of users of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    } else {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.position) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of roles of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    }
    if (!args[2]) return message.channel.send('Please give a command/module to allow.')
    let perm = NameToFlag(args[2])
    if (!perm) return message.channel.send('Invalid permission.')
    let negperms = []
    let posperms = []
    if (member.type2 === 'user') {
        let posuserperms = client.positiveuserpermissions.get(message.guild.id)
        let neguserperms = client.negativeuserpermissions.get(message.guild.id)
        negperms = neguserperms.get(member.id)
        posperms = posuserperms.get(member.id)
        if (negperms) {
            negperms = negperms.split("")
        } else {
            negperms = []
        }
        if (posperms) {
            posperms = posperms.split("")
        } else {
            posperms = []
        }
        let isindb = false
        if (negperms[0] || posperms[0]) {
            isindb = true
        }
        if (negperms) {
            if (negperms.includes(perm)) return message.channel.send('This permission is already denied for this user/role.')
        }
        if (posperms[0]) {
            if (posperms.includes(perm)) {
                for (let i = 0; i < posperms.length; i++) {
                    if (posperms[i] === perm) {
                        delete posperms[i]
                    }
                }
                negperms.push(perm)
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                let data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                posuserperms.set(member.id, posperms)
                neguserperms.set(member.id, negperms)
            } else {
                negperms.push(perm)
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                if (isindb) {
                    let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                    let data = [negperms, message.guild.id, member.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                } else {
                    let query = `INSERT INTO permissions (serverid, id2, type, negative) VALUES (?, ?, ?, ?)`;
                    let data = [message.guild.id, member.id, 'u', negperms];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                }
                neguserperms.set(member.id, negperms)

            }
        }
        else {
            if (!negperms) {
                negperms = []
            }
            negperms.push(perm)
            negperms = negperms.filter((a) => a).toString()
            negperms = negperms.replace(/,/g, '')
            negperms = negperms.replace(/ /g, '')
            if (isindb) {
                let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                let data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            } else {
                let query = `INSERT INTO permissions (serverid, id2, type, negative) VALUES (?, ?, ?, ?)`;
                let data = [message.guild.id, member.id, 'u', negperms];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            }
            neguserperms.set(member.id, negperms)
        }
        const permsembed = new Discord.MessageEmbed()
            .setDescription(`<:check:988867881200652348> Denied ${member} the **${GetFlagName(perm)}** permission.`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    } else {
        let neguserperms = client.negativerolepermissions.get(message.guild.id)
        let posuserperms = client.positiverolepermissions.get(message.guild.id)
        posperms = posuserperms.get(member.id)
        negperms = neguserperms.get(member.id)
        if (posperms) {
            posperms = posperms.split("")
        } else {
            posperms = []
        }
        if (negperms) {
            negperms = negperms.split("")
        } else {
            negperms = []
        }
        let isindb = false
        if (posperms[0] || negperms[0]) {
            isindb = true
        }
        if (negperms) {
            if (negperms.includes(perm)) return message.channel.send('This permission is already denied for this user/role.')
        }
        if (posperms[0]) {
            if (posperms.includes(perm)) {
                for (let i = 0; i < posperms.length; i++) {
                    if (posperms[i] === perm) {
                        delete posperms[i]
                    }
                }
                negperms.push(perm)
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                posperms = posperms.filter((a) => a).toString()
                posperms = posperms.replace(/,/g, '')
                posperms = posperms.replace(/ /g, '')
                let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                let data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                query = `UPDATE permissions SET positive = ? WHERE serverid = ? && id2 = ?`;
                data = [posperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
                posuserperms.set(member.id, posperms)
                neguserperms.set(member.id, negperms)
            } else {
                negperms.push(perm)
                negperms = negperms.filter((a) => a).toString()
                negperms = negperms.replace(/,/g, '')
                negperms = negperms.replace(/ /g, '')
                if (isindb) {
                    let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                    let data = [negperms, message.guild.id, member.id];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                } else {
                    let query = `INSERT INTO permissions (serverid, id2, type, negative) VALUES (?, ?, ?, ?)`;
                    let data = [message.guild.id, member.id, 'r', negperms];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) {
                            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                            return console.error(error);
                        }
                    });
                }
                neguserperms.set(member.id, posperms)

            }
        }
        else {
            if (!negperms) {
                negperms = []
            }
            negperms.push(perm)
            negperms = negperms.filter((a) => a).toString()
            negperms = negperms.replace(/,/g, '')
            negperms = negperms.replace(/ /g, '')
            if (isindb) {
                let query = `UPDATE permissions SET negative = ? WHERE serverid = ? && id2 = ?`;
                let data = [negperms, message.guild.id, member.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            } else {
                let query = `INSERT INTO permissions (serverid, id2, type, negative) VALUES (?, ?, ?, ?)`;
                let data = [message.guild.id, member.id, 'r', negperms];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                        return console.error(error);
                    }
                });
            }
            neguserperms.set(member.id, negperms)
        }
        const permsembed = new Discord.MessageEmbed()
            .setDescription(`<:check:988867881200652348> Denied ${member} the **${GetFlagName(perm)}** permission.`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    }
}

async function clear_perms(message, client, args, Discord, member) {
    if (member.type2 === 'user') {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of users of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    } else {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.position) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of roles of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    }
    if (member.type2 === 'user') {
        let posuserperms = client.positiveuserpermissions.get(message.guild.id)
        let neguserperms = client.negativeuserpermissions.get(message.guild.id)
        posuserperms.delete(member.id)
        neguserperms.delete(member.id)
    } else {
        let posuserperms = client.positiverolepermissions.get(message.guild.id)
        let neguserperms = client.negativerolepermissions.get(message.guild.id)
        posuserperms.delete(member.id)
        neguserperms.delete(member.id)
    }

    let query = `DELETE FROM permissions WHERE serverid = ? && id2 = ?`;
    let data = [message.guild.id, member.id];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
            return console.error(error);
        }
    });
    const permsembed = new Discord.MessageEmbed()
        .setDescription(`<:check:988867881200652348> Cleared all ${member}'s permssions.`)
        .setColor('BLUE')
    message.channel.send({ embeds: [permsembed] })
}

async function clear_perms(message, client, args, Discord, member) {
    if (member.type2 === 'user') {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of users of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    } else {
        if (message.guild.ownerId !== message.author.id) {
            if (userstatus !== 1) {
                if (message.member.roles.highest.position <= member.position) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot interact with the permissions of roles of higher rank than your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
    }
    if (member.type2 === 'user') {
        let posuserperms = client.positiveuserpermissions.get(message.guild.id)
        let neguserperms = client.negativeuserpermissions.get(message.guild.id)
        posuserperms.delete(member.id)
        neguserperms.delete(member.id)
    } else {
        let posuserperms = client.positiverolepermissions.get(message.guild.id)
        let neguserperms = client.negativerolepermissions.get(message.guild.id)
        posuserperms.delete(member.id)
        neguserperms.delete(member.id)
    }

    let query = `DELETE FROM permissions WHERE serverid = ? && id2 = ?`;
    let data = [message.guild.id, member.id];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
            return console.error(error);
        }
    });
    const permsembed = new Discord.MessageEmbed()
        .setDescription(`<:check:988867881200652348> Cleared all ${member}'s permssions.`)
        .setColor('BLUE')
    message.channel.send({ embeds: [permsembed] })
}