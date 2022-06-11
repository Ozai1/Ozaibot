const { GetAlias, GetTime } = require('./functions')

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
* @returns {string} what actual length of time the user has selected. formated like: "for [amount] [unit]", space before "for" and no full stop at the end
* @error if some dumb shit is inputed
*/

module.exports.GetDisplay = (timelength) => {
    if (isNaN(timelength)) return
    if (timelength < 0) return
    let display = ''
    let postfix = 's'; //60 3600 86400 604800 2592000
    if (timelength < 60) {
        if (timelength == 1) { postfix = '' }
        display = ` for ${timelength} second${postfix}`
    } if (timelength >= 60) {
        if (timelength == 60) { postfix = '' }
        display = ` for ${timelength / 60} minute${postfix}`
    } if (timelength >= 3600) {
        if (timelength == 3600) { postfix = '' }
        display = ` for ${timelength / 3600} hour${postfix}`
    } if (timelength >= 86400) {
        if (timelength == 86400) { postfix = '' }
        display = ` for ${timelength / 86400} day${postfix}`
    } if (timelength >= 604800) {
        if (timelength == 604800) { postfix = '' }
        display = `for ${timelength / 604800} week${postfix}`
    } if (timelength >= 2592000) {
        if (timelength == 2592000) { postfix = '' }
        display = ` for ${timelength / 2592000} month${postfix}`
    }
    return display
}

/**
 * Retreves a member from the guild of command origin
 * @param {Object} message Message object
 * @param {string} string The string that is used to find a member
 * @param {Object} Discord Used for embeds
 * @param {boolean} MustNotHaveMultiResults Whether to allow the embed that asks what user they meant or to just return if multiple members are found
 * @param {boolean} includeOffserver also searches for members outside of the guild with fetch requests
 * @returns {Object} member on success or undefined on fail
 */
module.exports.GetMember = async (message, string, Discord, MustNotHaveMultiResults = false, includeOffserver = false) => {
    try {
        let member = undefined;
        if (!isNaN(string) && string.length > 17 && string.length < 21) {
            member = message.guild.members.cache.get(string);
            if (member) {
                return member
            }
            if (includeOffserver) {
                member = message.guild.members.fetch(string);
            }
            if (member) {
                return member
            }
        }
        if (string.startsWith('<@')) {
            let member = message.guild.members.cache.get(string.slice(3, -1)) || message.guild.members.cache.get(string.slice(2, -1))
            if (!member) {
                if (includeOffserver) {
                    if (string.includes('!')) {
                        member = await message.guild.members.fetch(string.slice(3, -1))
                        return member
                    } else {
                        member = await message.guild.members.fetch(string.slice(2, -1))
                        return member
                    }
                }
            }
            return member
        }
        let possibleusers = []
        message.guild.members.cache.forEach(member => {
            if (member.user.tag.toLowerCase().includes(string.toLowerCase())) {
                possibleusers.push(`\`#${possibleusers.length + 1} ${member.user.tag}\``)
            }
        })
        if (!possibleusers[0]) {
            return undefined
        } else if (!possibleusers[1]) {
            member = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(4, -1));
            return member
        }
        if (MustNotHaveMultiResults === true || possibleusers.length > 9) return undefined
        let printmessage = possibleusers.filter((a) => a).toString()
        printmessage = printmessage.replace(/,/g, '\n')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members did you mean? Please type out the corrosponding number.')
            .setFooter('Type cancel to cancel the search.')
            .setDescription(`${printmessage}`)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        return await message.channel.send({ embeds: [helpembed] }).then(async confmessage => {
            return await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                message2.delete().catch(err => { });
                confmessage.delete().catch(err => { });
                if (message2.content.startsWith('cancel')) {
                    message.channel.send('Cancelled.')
                    return
                }
                if (isNaN(message2.content)) {
                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                    return
                }
                if (message2.content >= possibleusers.length + 1) {
                    message2.channel.send('Failed, that number isnt on the list.')
                    return
                }
                member = message.guild.members.cache.find(member => member.user.tag === possibleusers[message2.content - 1].slice(4, -1));
                if (!member) {
                    message.channel.send('failed for whatever reason')
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
        console.log(err)
        return;
    }
}