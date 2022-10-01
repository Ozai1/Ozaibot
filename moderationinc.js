const { GetAlias, GetTime } = require('./functions')
const { unix } = require('moment');
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

/**
* use GetDisplay for the response message, this function is only used for getting the length of the puinishment
* @param {string} usersarg the whole duration arg for the command, the function handles getting the unit and the amount. 
* @returns {integer} duration of the punishment in seconds
* @error if bad argument paramiters
*/

module.exports.GetPunishmentDuration = async (string) => {
    if (!string) return
    let unitstring = string.replace(/[0-9]/g, '')
    unitstring = unitstring.replace('.', '')
    const unitoftime = GetAlias(unitstring)
    if (!unitoftime) return
    const multiplicationfactor = GetTime(unitoftime);
    let finaltime = string.replace(/[^\d.-]/g, '')
    finaltime = finaltime * multiplicationfactor
    return finaltime
}

/**
* Generates a response messages for returning the amount of time a punishment was executed for
* @param {integer} timeinseconds the length of the punish, in seconds 
* @param {boolean} includeFor to include it saying for or just output the units
* @returns {string} what actual length of time the user has selected. formated like: "for [amount] [unit]", space before "for" and no full stop at the end
* @error if some dumb shit is inputed
*/

const GetDisplay = (timelength, includeFor = false) => {
    if (isNaN(timelength)) return
    if (timelength < 0) return
    let display = ''
    let postfix = ''; //60 3600 86400 604800 2592000
    if (timelength < 60) {
        if (timelength > 1) { postfix = 's' }
        display = ` for **${timelength} second${postfix}**`
    } if (timelength >= 60 && timelength < 3600) {
        if (timelength == 60) {
            display = ` for **1 minute**`
        } else {
            if (timelength > 60 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 60
                howmany = howmany + 1
                if (timelength < 60) {
                    display = ` for **${howmany} minute${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    } if (timelength >= 3600 && timelength < 86400) {
        if (timelength == 3600) {
            display = ` for **1 hour**`
        } else {
            if (timelength > 3600 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 3600
                howmany = howmany + 1
                if (timelength < 3600) {
                    display = ` for **${howmany} hour${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    } if (timelength >= 86400 && timelength < 604800) {
        if (timelength == 86400) {
            display = ` for **1 day**`
        } else {
            if (timelength > 86400 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 86400
                howmany = howmany + 1
                if (timelength < 86400) {
                    display = ` for **${howmany} day${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    } if (timelength >= 604800 && timelength < 2592000) {
        if (timelength == 604800) {
            display = ` for **1 week**`
        } else {
            if (timelength > 604800 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 604800
                howmany = howmany + 1
                if (timelength < 604800) {
                    display = ` for **${howmany} week${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    } if (timelength >= 2592000 && timelength < 31536000) {
        if (timelength == 2592000) {
            display = ` for **1 month**`
        } else {
            if (timelength > 2592000 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 2592000
                howmany = howmany + 1
                if (timelength < 2592000) {
                    display = ` for **${howmany} month${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    } if (timelength >= 31536000) {
        if (timelength == 31536000) {
            display = ` for **1 year**`
        } else {
            if (timelength > 31536000 * 2) { postfix = 's' }
            let stillreducing = true
            let howmany = 0
            while (stillreducing) {
                timelength = Number(timelength) - 31536000
                howmany = howmany + 1
                if (timelength < 31536000) {
                    display = ` for **${howmany} year${postfix}**`
                    stillreducing = false
                    if (!timelength == 0) {
                        display = display.slice(0, -2) + ` and ${GetSecondDisplayUnit(timelength)}**`
                    }
                }
            }
        }
    }
    if (!includeFor) {
        display = display.slice(4)
        display = display.replace(/\*/g, '')
    }
    return display
}

module.exports.GetDisplay = GetDisplay

const GetSecondDisplayUnit = (timelength) => {
    let display = ''
    let postfix = 's'; //60 3600 86400 604800 2592000
    if (timelength < 60) {
        if (timelength == 1) { postfix = '' }
        display = `${timelength} second${postfix}`
    } if (timelength >= 60) {
        if (timelength == 60) { postfix = '' }
        display = `${timelength / 60} minute${postfix}`
    } if (timelength >= 3600) {
        if (timelength == 3600) { postfix = '' }
        display = `${timelength / 3600} hour${postfix}`
    } if (timelength >= 86400) {
        if (timelength == 86400) { postfix = '' }
        display = `${timelength / 86400} day${postfix}`
    } if (timelength >= 604800) {
        if (timelength == 604800) { postfix = '' }
        display = `${timelength / 604800} week${postfix}`
    } if (timelength >= 2592000) {
        if (timelength == 2592000) { postfix = '' }
        display = `${timelength / 2592000} month${postfix}`
    } if (timelength >= 31536000) {
        if (timelength == 2592000) { postfix = '' }
        display = `${timelength / 2592000} year${postfix}`

    }
    if (display.includes('.')) {
        display = display.split('.')
        display[1] = display[1].replace(/[1-9]/g, '')
        display = display[0] + display[1]
    }
    return display
}

/**
* Queues a query to be pushed into the database as soon as the database comes back online. This means that minor outages wont effect the database long term.
* @param {string} Query The string that is the query, EG INSERT INTO poo (hi) VALUES ('seven')
* @param {Array} Data The array of informtion for the query, the Data
* @param {Object} client
*/

module.exports.QueueForDBPush = async (querystring, data, client) => {
    let shit = Object
    shit.query = querystring
    shit.data = data
    client.failedrequests.set(client.failedrequests.length + 1, shit)
    if (!client.isdatabasedown) this.CheckForDatabaseRecovery(client)
}

/**
* If the database has been detected to be offline, this function will check for it to come back online every thirty seconds and lauch the function to update the database when it has come back online
* @param {Object} client
*/

module.exports.CheckForDatabaseRecovery = async (client) => {
    setInterval(() => {
        let query = `SELECT * FROM userstatus`;
        let data = [message.guild.id, casenumber, memberid, message.author.id, Number(Date.now(unix).toString().slice(0, -3)), length, reason, type, logmessage.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                return
            } else {
                for (let i = 0; i < 10; i++) {
                    console.log('**DATABSE BACK ONLINE**')

                }
            }
        });
    }, 30000);
}

/**
* Merges all queries stored in cache into the longterm database
* @param {Object} client
*/

const UpdateDatabase = (client) => {
    let query = ''
    let data = []
    for (let i = 0; i < client.failedrequests.length; i++) {
        query = client.failedrequests[i].key
        data = client.failedrequests[i].key
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                return console.error(error)
            }
        });
    }
    console.log('Updating database...')
}

module.exports.UpdateDatabase = UpdateDatabase
/**
 * Retreves a member from the guild of command origin
 * @param {Object} message Message object
 * @param {Object} client Discord client object
 * @param {string} string The string that is used to find a member
 * @param {Object} Discord Used for embeds
 * @param {boolean} AllowMultipleResults If a name instead of an ID or a mention is supplied it is possible to have multiple members with overlapping names found. This boolean is whether to allow the embed which will allow the admin to select which user out of the users found they intended to target.
 * @param {boolean} AllowOffServer also searches for members outside of the guild, cannot use names
 * @returns {Object} member on success or undefined/cancelled/timed_out on fail (undefined is user error AKA no one found, cancelled means that they cancelled the command and timed out means that they left the embed for more than thirty seconds.)
 */

module.exports.GetMember = async (message, client, string, Discord, AllowMultipleResults = true, includeOffserver = false) => {
    try {
        let member = undefined;
        if (!isNaN(string) && string.length > 17 && string.length < 21) {
            member = message.guild.members.cache.get(string);
            if (includeOffserver) {
                member = client.users.cache.get(string)
                if (member) {
                    return member
                }
                member = await client.users.fetch(string).catch(err => { })
            }
            return member
        }
        if (string.startsWith('<@')) {
            member = message.guild.members.cache.get(string.slice(3, -1)) || message.guild.members.cache.get(string.slice(2, -1))
            if (!member) {
                if (includeOffserver) {
                    member = client.users.cache.get(string.slice(3, -1)) || client.users.cache.get(string.slice(2, -1))
                    if (member) {
                        return member
                    }
                    if (string.includes('!')) {
                        member = await client.users.fetch(string.slice(3, -1)).catch(err => { })
                        return member
                    } else {
                        member = await client.users.fetch(string.slice(2, -1)).catch(err => { })
                        return member
                    }
                }
            }
            return member
        }
        let possibleusers = []
        let pattern = new RegExp(string.toLowerCase(), 'g')
        await message.guild.members.cache.forEach(member => {
            if (member.nickname) {
                if (member.user.tag.toLowerCase().match(pattern) || member.nickname.toLowerCase().match(pattern)) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            } else {
                if (member.user.tag.toLowerCase().match(pattern)) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            }
        })
        if (!possibleusers[0]) {
            return undefined
        } else if (!possibleusers[1]) {
            member = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(6, -1));
            return member
        }
        if (AllowMultipleResults === false) return undefined
        if (possibleusers.length > 9) {
            message.channel.send('To many users found. Please use a more definitive string.')
            return undefined
        }
        let printmessage = possibleusers.filter((a) => a).toString()
        printmessage = printmessage.replace(/,/g, '\n')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members did you mean? Please type out the corrosponding number.')
            .setFooter({ text: 'Type cancel to cancel the search.' })
            .setDescription(`${printmessage}`)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        return await message.channel.send({ embeds: [helpembed] }).then(async confmessage => {
            return await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                if (message2.content.startsWith('cancel')) {
                    message.channel.send('Cancelled.')
                    return 'cancelled'
                }
                if (isNaN(message2.content)) {
                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                    return
                }
                if (message2.content >= possibleusers.length + 1) {
                    message2.channel.send('Failed, that number isnt on the list.')
                    return
                }
                member = message.guild.members.cache.find(member => member.user.tag === possibleusers[message2.content - 1].slice(6, -1));
                if (!member) {
                    message.channel.send('failed for whatever reason')
                    console.error('Was unable to grab member in GetMember after multiple user embed and proper response')
                    return
                }
                return member;
            }).catch(collected => {
                console.log(collected);
                message.channel.send('Timed out.').catch(err => { console.log(err) });
                return
            });
        });
    } catch (err) {
        console.error(err)
        return;
    }
}

/**
 * Retreves a member OR channel from the guild of command origin
 * @param {Object} message Message object
 * @param {Object} client Discord client object
 * @param {string} string The string that is used to find the member or channel
 * @param {Object} Discord Used for embeds
 * @param {boolean} AllowMultipleResults If a name instead of an ID or a mention is supplied it is possible to have multiple members with overlapping names found. This boolean is whether to allow the embed which will allow the admin to select which user out of the users found they intended to target.
 * @param {boolean} AllowOffServer also searches for members outside of the guild, cannot use names
 * @returns {Object} member/channel on success or undefined/cancelled/timed_out on fail (undefined is user error AKA no one found, cancelled means that they cancelled the command and timed out means that they left the embed for more than thirty seconds.)
 */

module.exports.GetMemberOrChannel = async (message, client, string, Discord, AllowMultipleResults = true, includeOffserver = false) => {
    try {
        let member = undefined;
        if (!isNaN(string) && string.length > 17 && string.length < 21) {
            member = message.guild.members.cache.get(string);
            if (member) return member
            if (includeOffserver) {
                member = client.users.cache.get(string)
                if (member) {
                    return member
                }
                member = await client.users.fetch(string).catch(err => { })
                if (member) return member
            }
            member = message.guild.channels.cache.get(string)
            return member
        }
        if (string.startsWith('<@')) {
            member = message.guild.members.cache.get(string.slice(3, -1)) || message.guild.members.cache.get(string.slice(2, -1))
            if (!member) {
                if (includeOffserver) {
                    member = client.users.cache.get(string.slice(3, -1)) || client.users.cache.get(string.slice(2, -1))
                    if (member) {
                        return member
                    }
                    if (string.includes('!')) {
                        member = await client.users.fetch(string.slice(3, -1)).catch(err => { })
                        return member
                    } else {
                        member = await client.users.fetch(string.slice(2, -1)).catch(err => { })
                        return member
                    }
                }
            }
            return member
        }
        if (string.startsWith('<#')) {
            member = message.guild.channels.cache.get(string.slice(2, 1))
            return member
        }
        let possibleusers = []
        await message.guild.members.cache.forEach(member => {
            if (member.nickname) {
                if (member.user.tag.toLowerCase().includes(string.toLowerCase()) || member.nickname.toLowerCase().includes(string.toLowerCase())) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            } else {
                if (member.user.tag.toLowerCase().includes(string.toLowerCase())) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            }
        })
        await message.guild.channels.cache.forEach(channel => {
            if (channel.name.toLowerCase().includes(string.toLowerCase())) {
                if (channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_TEXT') possibleusers.push(`\`#${possibleusers.length + 1}\` \`${channel.name}\``)
            }
        })
        if (!possibleusers[0]) {
            return undefined
        } else if (!possibleusers[1]) {
            member = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(6, -1)) || message.guild.channels.cache.find(channel => channel.name === possibleusers[0].slice(6, -1))
            if (!member) {
                member = message.guild.channels.cache.get()
            }
            return member
        }
        if (AllowMultipleResults === false) return undefined
        if (possibleusers.length > 9) {
            message.channel.send('To many users found. Please use a more definitive string.')
            return undefined
        }
        let printmessage = possibleusers.filter((a) => a).toString()
        printmessage = printmessage.replace(/,/g, '\n')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members/channels did you mean? Please type out the corrosponding number.')
            .setFooter({ text: 'Type cancel to cancel the search.' })
            .setDescription(`${printmessage}`)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        return await message.channel.send({ embeds: [helpembed] }).then(async confmessage => {
            return await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                if (message2.content.startsWith('cancel')) {
                    message.channel.send('Cancelled.')
                    return 'cancelled'
                }
                if (isNaN(message2.content)) {
                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                    return
                }
                if (message2.content >= possibleusers.length + 1) {
                    message2.channel.send('Failed, that number isnt on the list.')
                    return
                }
                member = message.guild.members.cache.find(member => member.user.tag === possibleusers[message2.content - 1].slice(6, -1)) || message.guild.channels.cache.find(channel => channel.name === possibleusers[message2.content - 1].slice(6, -1))
                if (!member) {
                    member =
                        message.channel.send('failed for whatever reason')
                    console.error('Was unable to grab member in GetMember after multiple user embed and proper response')
                    return
                }
                return member;
            }).catch(collected => {
                console.log(collected);
                message.channel.send('Timed out.').catch(err => { console.log(err) });
                return
            });
        });
    } catch (err) {
        console.error(err)
        return;
    }
}

/**
 * Retreves a member OR role from the guild of command origin
 * @param {Object} message Message object
 * @param {Object} client Discord client object
 * @param {string} string The string that is used to find the member or role
 * @param {Object} Discord Used for embeds
 * @param {boolean} AllowMultipleResults If a name instead of an ID or a mention is supplied it is possible to have multiple members with overlapping names found. This boolean is whether to allow the embed which will allow the admin to select which user out of the users found they intended to target.
 * @param {boolean} AllowOffServer also searches for members outside of the guild, cannot use names
 * @returns {Object} member/role on success or undefined/cancelled/timed_out on fail (undefined is user error AKA no one found, cancelled means that they cancelled the command and timed out means that they left the embed for more than thirty seconds.)
 */

module.exports.GetMemberOrRole = async (message, client, string, Discord, AllowMultipleResults = true, includeOffserver = false) => {
    try {
        let member = undefined;
        if (!isNaN(string) && string.length > 17 && string.length < 21) {
            member = message.guild.members.cache.get(string);
            if (member) {
                member.type2 = 'user'
                return member
            }
            if (includeOffserver) {
                member = client.users.cache.get(string)
                if (member) {
                    member.type2 = 'user'
                    return member
                }
                member = await client.users.fetch(string).catch(err => { })
                if (member) {
                    member.type2 = 'user'
                    return member
                }
            }
            member = message.guild.roles.cache.get(string)
            if (!member) return undefined
            member.type2 = 'role'
            return member
        }
        if (string.startsWith('<@')) {
            member = message.guild.members.cache.get(string.slice(3, -1)) || message.guild.members.cache.get(string.slice(2, -1))
            if (!member) {
                if (includeOffserver) {
                    member = client.users.cache.get(string.slice(3, -1)) || client.users.cache.get(string.slice(2, -1))
                    if (member) {
                        member.type2 = 'user'
                        return member
                    }
                    if (string.includes('!')) {
                        member = await client.users.fetch(string.slice(3, -1)).catch(err => { })
                        if (!member) return undefined
                        member.type2 = 'user'
                        return member
                    } else {
                        member = await client.users.fetch(string.slice(2, -1)).catch(err => { })
                        if (!member) return undefined
                        member.type2 = 'user'
                        return member
                    }
                }
            }
            if (!member) return undefined
            member.type2 = 'user'
            return member
        }
        if (string.startsWith('<@&')) {
            member = message.guild.roles.cache.get(string.slice(3, 1))
            if (!member) return undefined
            member.type2 = 'user'
            return member
        }
        let possibleusers = []
        await message.guild.members.cache.forEach(member => {
            if (member.nickname) {
                if (member.user.tag.toLowerCase().includes(string.toLowerCase()) || member.nickname.toLowerCase().includes(string.toLowerCase())) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            } else {
                if (member.user.tag.toLowerCase().includes(string.toLowerCase())) {
                    possibleusers.push(`\`#${possibleusers.length + 1}\` \`${member.user.tag}\``)
                }
            }
        })
        await message.guild.roles.cache.forEach(role => {
            if (role.name.toLowerCase().includes(string.toLowerCase())) {
                possibleusers.push(`\`#${possibleusers.length + 1}\` \`${role.name}\``)
            }
        })
        if (!possibleusers[0]) {
            return undefined
        } else if (!possibleusers[1]) {
            member = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(6, -1))
            if (member) {
                member.type2 = 'user'
                return member
            }
            member = message.guild.roles.cache.find(role => role.name === possibleusers[0].slice(6, -1))
            if (!member) return undefined
            member.type2 = 'role'
            return member
        }
        if (AllowMultipleResults === false) return undefined
        if (possibleusers.length > 9) {
            message.channel.send('To many users found. Please use a more definitive string.')
            return undefined
        }
        let printmessage = possibleusers.filter((a) => a).toString()
        printmessage = printmessage.replace(/,/g, '\n')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members/roles did you mean? Please type out the corrosponding number.')
            .setFooter({ text: 'Type cancel to cancel the search.' })
            .setDescription(`${printmessage}`)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        return await message.channel.send({ embeds: [helpembed] }).then(async confmessage => {
            return await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                if (message2.content.startsWith('cancel')) {
                    message.channel.send('Cancelled.')
                    return 'cancelled'
                }
                if (isNaN(message2.content)) {
                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                    return
                }
                if (message2.content >= possibleusers.length + 1) {
                    message2.channel.send('Failed, that number isnt on the list.')
                    return
                }
                member = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(6, -1))
                if (member) {
                    member.type2 = 'user'
                    return member
                }
                member = message.guild.roles.cache.find(role => role.name === possibleusers[0].slice(6, -1))
                if (!member) {
                    message.channel.send('failed for whatever reason')
                    console.error('Was unable to grab member in GetMember after multiple user embed and proper response')
                    return
                }
                member.type2 = 'role'
                return member
            }).catch(collected => {
                console.log(collected);
                message.channel.send('Timed out.').catch(err => { console.log(err) });
                return
            });
        });
    } catch (err) {
        console.error(err)
        return;
    }
}

/**
 * Pushes the punishment to the database
 * @param {Object} message Message object
 * @param {Object} client Client object
 * @param {Object} memberid The target of the command's ID
 * @param {integer} type 1:ban, 2:unban, 3:mute, 4:unmute, 5:kick, 6:softban, 7:warn, 8:tempban,
 * @param {integer} length duration of the punishment, if any
 * @param {String} reason reason for the command, inputed by the user
 * @param {Object} Discord discord object
 * @param {integer} casenumber the case number to be logged
 * @param {boolean} pushToDB whether to log it to the database
 */

module.exports.LogPunishment = async (message, client, memberid, type, length, reason, Discord, casenumber, pushtodb = true) => {
    if (!casenumber) {
        casenumber = client.currentcasenumber.get(message.guild.id) + 1
        client.currentcasenumber.set(message.guild.id, casenumber);
    }
    let modlogschannel = client.modlogs.get(message.guild.id)
    modlogschannel = message.guild.channels.cache.get(modlogschannel)
    if (modlogschannel) {
        let theuser = client.users.cache.get(memberid)
        const bannedembed = new Discord.MessageEmbed()
            .setColor(GetPunishColour(type))
            .setTitle(`Case #${casenumber} - ${GetPunishName(type)}`)
            .setTimestamp()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        if (length && reason) {
            bannedembed.setDescription(`**Member:** ${theuser.tag} (${memberid})\n**Duration:** ${GetDisplay(length, false)}\n**Reason:** ${reason}`)
        } if (length && !reason) {
            bannedembed.setDescription(`**Member:** ${theuser.tag} (${memberid})\n**Duration:** ${GetDisplay(length, false)}`)
        } if (reason && !length) {
            bannedembed.setDescription(`**Member:** ${theuser.tag} (${memberid})\n**Reason:** ${reason}`)
        } if (!reason && !length) {
            bannedembed.setDescription(`**Member:** ${theuser.tag} (${memberid})\n`)
        }
        let logmessage = await modlogschannel.send({ embeds: [bannedembed] }).catch(err => {
            console.warn(err)
            console.warn('Mod logs channel could not be sent to.')
        })
        if (pushtodb) {
            let query = `INSERT INTO serverpunishments (serverid, casenumber, userid, adminid, timeexecuted, length, reason, type, logmessageid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let data = [message.guild.id, casenumber, memberid, message.author.id, Number(Date.now(unix).toString().slice(0, -3)), length, reason, type, logmessage.id];
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                    return console.error(error);
                }
            });
        }
    } else {
        if (pushtodb) {
            let query = `INSERT INTO serverpunishments (serverid, casenumber, userid, adminid, timeexecuted, length, reason, type, logmessageid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let data = [message.guild.id, casenumber, memberid, message.author.id, Number(Date.now(unix).toString().slice(0, -3)), length, reason, type, null];
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    if (message.channel) message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.').catch(err => { })
                    return console.error(error);
                }
            });
        }
    }

}
const punishmentnames = new Map()
    .set(1, 'Ban')
    .set(2, 'Un-Ban')
    .set(3, 'Mute')
    .set(4, 'Un-Mute')
    .set(5, 'Kick')
    .set(6, 'Soft-Ban')
    .set(7, 'Warn')
    .set(8, 'Temp-Ban')

/**
 * Returns the proper name of the punishment
 * @param {integer} type The type of punishment in number form
 * @returns {String} name of the punishment
 */

const GetPunishName = (type) => {
    return punishmentnames.get(parseInt(type))
}

module.exports.GetPunishName = GetPunishName

const punishmentnumbers = new Map()
    .set('ban', 1)
    .set('b', 1)
    .set('un-ban', 2)
    .set('unban', 2)
    .set('mute', 3)
    .set('m', 3)
    .set('un-mute', 4)
    .set('unmute', 4)
    .set('kick', 5)
    .set('k', 5)
    .set('soft-ban', 6)
    .set('softban', 6)
    .set('sb', 6)
    .set('warn', 7)
    .set('w', 7)
    .set('tempban', 8)
    .set('temp-ban', 7)
    .set('tb', 7)
/**
 * Returns number assigned to the punishment name given
 * @param {String} string name of the punishment
 * @returns {integer} type The type of punishment in number form
 */

const GetPunishNumber = (type) => {
    return punishmentnumbers.get(type.toLowerCase())
}

module.exports.GetPunishNumber = GetPunishNumber

const punishmentcolours = new Map()
    .set(1, 15684432) // ban
    .set(2, 6732650)  // unban
    .set(3, 16747777) // mute
    .set(4, 6732650)  // unmute
    .set(5, 16747777) // kick
    .set(6, 16747777) // softban
    .set(7, 16771899) // warn
    .set(8, 15684432) // tempban

/**
 * Returns the colour of the punishment
 * @param {integer} type The type of punishment in number form
 * @returns {any} colour
 */

const GetPunishColour = (type) => {
    return punishmentcolours.get(parseInt(type))
}

module.exports.GetPunishColour = GetPunishColour

/**
 * Sends a message to the member informing them of whatever is happening
 * @param {integer} type 1:ban, 2:unban, 3:mute, 4:unmute, 5:kick, 6:softban, 7:warn, 8:tempban,
 * @param {Object} message Message object
 * @param {String} title The title of the embed: AKA "X has been banned from Y"
 * @param {Object} member The target of the command's ID
 * @param {String} reason reason for the command, inputed by the user
 * @param {integer} length duration of the punishment, if any
 * @param {Object} client Client object
 * @param {Object} Discord Discord object
 */

module.exports.NotifyUser = async (type, message, title, member, reason, length, client, Discord) => {
    if (client.punishnotification.includes(message.guild.id)) return
    if (!message.guild.members.cache.get(member.id)) return
    const bannedembed = new Discord.MessageEmbed()
        .setColor(GetPunishColour(type))
        .setTitle(`${title}`)
        .setTimestamp()
    if (length && reason) {
        bannedembed.setDescription(`**Actioned by:** ${message.author} ${message.author.tag}\n**Duration:** ${GetDisplay(length, false)}\n**Reason:** ${reason}`)
    } if (length && !reason) {
        bannedembed.setDescription(`**Actioned by:** ${message.author} ${message.author.tag}\n**Duration:** ${GetDisplay(length, false)}`)
    } if (reason && !length) {
        bannedembed.setDescription(`**Actioned by:** ${message.author} ${message.author.tag}\n**Reason:** ${reason}`)
    } if (!reason && !length) {
        bannedembed.setDescription(`**Actioned by:** ${message.author} ${message.author.tag}`)
    }
    await member.send({ embeds: [bannedembed] }).catch(err => { return console.log('Conf message failed to send; users permissions do not allow') })
    console.log('Conf message sent')
}

const PermissionFlags = new Map()
    .set('a', 'Ban')
    .set('b', 'Un-Ban')
    .set('c', 'Mute')
    .set('d', 'Un-Mute')
    .set('e', 'Kick')
    .set('f', 'Soft-Ban')
    .set('g', 'Warn')
    .set('h', 'Edit-Case')
    .set('i', 'Purge')
    .set('j', 'Lockdown')
    .set('k', 'Search/Case-Info')
    .set('l', 'Moderation Command Usage')
    .set('m', 'Administration Command Usage')
    .set('n', 'Fun Command Usage')
    .set('o', 'Utility Command Usage')
    .set('p', 'General Command Usage')
    .set('q', 'Any Command Usage')
    .set('z', 'All-Permissions')

//User > Role
//Allow > Deny
//if a user has permissions set on their account, that is absolute, roles are ignored for that permission.,
//if a user has two roles, one positive and one negative, positive will take persidence over negative.
//AKA if @everyone has negative for mute, @mods positive will take over and allow the command.

module.exports.GetFlagName = (flag) => {
    return PermissionFlags.get(flag)
}

const FlagNames = new Map()
    .set('ban', 'a')
    .set('un-ban', 'b')
    .set('unban', 'b')
    .set('mute', 'c')
    .set('un-mute', 'd')
    .set('unmute', 'd')
    .set('kick', 'e')
    .set('softban', 'f')
    .set('soft-ban', 'f')
    .set('warn', 'g')
    .set('edit-case', 'h')
    .set('editcase', 'h')
    .set('reason', 'h')
    .set('purge', 'i')
    .set('lockdown', 'j')
    .set('search', 'k')
    .set('case', 'k')
    .set('case-info', 'k')
    .set('search/case-info', 'k')
    .set('moderation', 'l')
    .set('administration', 'm')
    .set('fun', 'n')
    .set('utility', 'o')
    .set('general', 'p')
    .set('any', 'q')
    .set('all', 'z')
    .set('all-permissions', 'z')

module.exports.NameToFlag = (name) => {
    return FlagNames.get(name.toLowerCase())
}
/**
 * checks if a user has permissions for an action
 * @param {Object} message Message object
 * @param {Object} member The target of the command's ID
 * @param {Object} client
 * @param {Letter} flag The permission you are validating | Ban A | Unban B | Mute C | Unmute D | Kick E | Softban F | Warn G | Edit-Case/reason H | Purge I | LockDown J | Search/Case K | 
 * @param {Letter} module The module that the command comes from. Moderation L | Administration M | Fun N | Utility O | General P | any Q | All/Root Z
 * @returns {Integer} 0 = null (neither Allowed or denied) | 1 = allowed | 2 = denied
 */

module.exports.HasPerms = async (message, member, client, flag, module) => {
    if (member.id == member.guild.ownerId) return 1
    let posuserperms = client.positiveuserpermissions.get(message.guild.id)
    let neguserperms = client.negativeuserpermissions.get(message.guild.id)
    let posperms = posuserperms.get(member.id)
    let negperms = neguserperms.get(member.id)
    if (posperms) {
        if (posperms.includes('z')) return 1
    }
    if (negperms) {
        if (negperms.includes('z')) return 2
    }
    if (posperms) {
        if (posperms.includes(flag)) return 1
    } if (negperms) {
        if (negperms.includes(flag)) return 2
    }
    if (posperms) {
        if (posperms.includes(module)) return 1
    }
    if (negperms) {
        if (negperms.includes(module)) return 2
    }
    let negroleperms = client.negativerolepermissions.get(message.guild.id)
    let posroleperms = client.positiverolepermissions.get(message.guild.id)
    let hasfoundfalse = false
    let hasfoundfalsemodule = false
    let hasfoundtrue = false
    let hasfoundtruemodule = false
    let posperms2 = undefined
    let negperms2 = undefined
    await member.roles.cache.forEach(role => {
        posperms2 = posroleperms.get(role.id)
        negperms2 = negroleperms.get(role.id)
        if (posperms2) {
            if (posperms2.includes(flag)) hasfoundtrue = true
            if (posperms2.includes(module)) hasfoundtruemodule = true
            if (posperms2.includes('z')) hasfoundtrue = true
        } if (negperms2) {
            if (negperms2.includes(flag)) hasfoundfalse = true
            if (negperms2.includes(module)) hasfoundfalsemodule = true
            if (negperms2.includes('z')) hasfoundfalse = true
        }
    })
    if (hasfoundtrue) return 1
    if (hasfoundfalse) return 2
    if (hasfoundtruemodule) return 1
    if (hasfoundfalsemodule) return 2
    return 0
}