const mysql = require('mysql2');

require('dotenv').config();
const { GetMember, GetFlagName, NameToFlag } = require("../moderationinc")
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
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You do not have access to this command.')
        if (!args[1]) return message.channel.send('Invalid usage.')
        const member = await GetMember(message, client, args[1], Discord, true, true)
        if (!member) return message.channel.send('Invalid member/role.')
        if (args[0].toLowerCase() === 'list') {
            list_perms(message, client, args, Discord, member)
        } else if (args[0].toLowerCase() === 'allow') {
            allow_perms(message, client, args, Discord, member)
        } else if (args[0].toLowerCase() === 'deny') {
            deny_perms(message, client, args, Discord, member)
        } else {
            return message.channel.send('Invalid usage.')
        }
    }
}

async function list_perms(message, client, args, Discord, member) {
    if (member.user) { // member is a user, not a role
        let negroleperms = client.positiveuserpermissions.get(message.guild.id)
        let posroleperms = client.positiveuserpermissions.get(message.guild.id)
        let positiveperms = []
        let negativeperms = []
        let theperms = posroleperms.get(member.id).split("")
        let theperms2 = negroleperms.get(member.id).split("")
        theperms.forEach(perm => {
            perm = GetFlagName(perm)
            if (!positiveperms.includes(perm)) positiveperms.push(perm)
        })
        theperms2.forEach(perm => {
            perm = GetFlagName(perm)
            if (!negativeperms.includes(perm)) negativeperms.push(perm)
        })
        if (!positiveperms) {
            positiveperms = 'None.'
        } else {
            positiveperms = positiveperms.filter((a) => a).toString()
            positiveperms = positiveperms.replace(/,/g, '`\n`')
        }
        if (!negativeperms) {
            negativeperms = 'None.'
        } else {
            negativeperms = negativeperms.filter((a) => a).toString()
            negativeperms = negativeperms.replace(/,/g, '`\n`')
        }
        const permsembed = new Discord.MessageEmbed()
            .setTitle(`<@${member.id}> - ${member.author.tag}`)
            .setDescription(`**Allowed:**\n${positiveperms}\n\n**Denied:**\n${negativeperms}`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    } else {
        let negroleperms = client.positiverolepermissions.get(message.guild.id)
        let posroleperms = client.positiverolepermissions.get(message.guild.id)
        let positiveperms = []
        let negativeperms = []
        let theperms = posroleperms.get(member.id).split("")
        let theperms2 = negroleperms.get(member.id).split("")
        theperms.forEach(perm => {
            perm = GetFlagName(perm)
            if (!positiveperms.includes(perm)) positiveperms.push(perm)
        })
        theperms2.forEach(perm => {
            perm = GetFlagName(perm)
            if (!negativeperms.includes(perm)) negativeperms.push(perm)
        })
        if (!positiveperms) {
            positiveperms = 'None.'
        } else {
            positiveperms = positiveperms.filter((a) => a).toString()
            positiveperms = positiveperms.replace(/,/g, '`\n`')
        }
        if (!negativeperms) {
            negativeperms = 'None.'
        } else {
            negativeperms = negativeperms.filter((a) => a).toString()
            negativeperms = negativeperms.replace(/,/g, '`\n`')
        }
        const permsembed = new Discord.MessageEmbed()
            .setTitle(`<@&${member.id}> - ${member.name}`)
            .setDescription(`**Allowed:**\n${positiveperms}\n\n**Denied:**\n${negativeperms}`)
            .setColor('BLUE')
        message.channel.send({ embeds: [permsembed] })
    }
}

async function allow_perms(message, client, args, Discord, member) {
    if (member.user) {
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
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
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
    if (member.user) {
        let neguserperms = client.negativeuserpermissions.get(message.guild.id)
        let posuserperms = client.positiveuserpermissions.get(message.guild.id)
        posperms = posuserperms.get(member.id)
        negperms = neguserperms.get(member.id)
        if (posperms) {
            posperms = posperms.split("")
        } else {
            posperms = null
        }
        if (negperms) {
            negperms = negperms.split("")
        } else {
            negperms = null
        }
        let isindb = false
        if (posperms || negperms) {
            isindb = true
        }
        if (posperms) {
            if (posperms.includes(perm)) return message.channel.send('This permission is already allowed for this user/role.')
        }
        if (negperms) {
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
            }else{
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
            if (!posperms){
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
    } else {
        let negroleperms = client.positiverolepermissions.get(message.guild.id)
        let posroleperms = client.positiverolepermissions.get(message.guild.id)
        posperms = posroleperms.get(role.id).split("")
        negperms = negroleperms.get(role.id).split("")
        if (posperms.includes(perm)) return message.channel.send('This permission is already allowed for this user/role.')
        if (negperms.includes(perm)) {

        } else {

        }
    }
}
async function ArrayToString(array) {
    array = array.filter((a) => a).toString()
    array = array.replace(/,/g, '')
    array = array.replace(/ /g, '')
    return array
}
