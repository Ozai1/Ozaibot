const times = {
    "min": {
        "time": 60,
        "aliases": [
            "m", "minutes", "minute", "min", "mins"
        ],
    },
    "hour": {
        "time": 3600,
        "aliases": [
            "h", "hours", "hour"
        ],
    },
    "day": {
        "time": 16800,
        "aliases": [
            "d", "day", "days"
        ],
    },
    "week": {
        "time": 604800,
        "aliases": [
            "w", "week", "weeks"
        ],
    },
    "month": {
        "time": 2592000,
        "aliases": [
            "mon", "month", "months"
        ],
    }
}

/**
 * Gets time and alias from a string for timed punishments
 * @param {string} string time unit / time unit alias
 * @returns {Object} under object: unitName, time (how long the unit is in seconds), amount
 * @error Returns -1 if a unit of time from the provided string can not be resolved
 */
module.exports.GetTimeAndAlias = (string) => {
    const returnobject = Object
    const unitoftime = string.replace(/[0-9]/g, '');
    for (const key in times) {
        if (times[key].aliases.includes(unitoftime)) returnobject.unitName = key;
    }
    if (times[unitoftime] && times[unitoftime].time) {
        unitoftimeinseconds = times[key].time;
        const amountofunits = string.replace(/\D/g,'');
        returnobject.amount = amountofunits
        returnobject.time = unitoftimeinseconds * Number(amountofunits)
        return returnobject
    }
    return -1;
}

/**
 * Returns the full name of a unit of time's alias
 * @param {string} string time unit / time unit alias
 * @returns {string} full name of time unit 
 */
module.exports.GetAlias = (string) => {
    for (const key in times) if (times[key].aliases.includes(string)) return key;
}

/**
* Gets the amount of time for a unit of time
* @param {string} string unit of time
* @returns {integer} how many seconds makes up the unit of time inputed.
* @error When no unit of time can be found from the supplied string, returns -1.
*/
module.exports.GetTime = (key) => {
    if (times[key] && times[key].time) {
        return times[key].time;
    }
    return -1;
}
module.exports.aliases = times;

/**
 * Retreves a member from the guild of message object
 * @param {Object} message Message object
 * @param {string} string The string that is used to find a member
 * @param {Object} Discord Used for embeds
 * @param {boolean} MustNotHaveMultiResults Whether to allow the embed that asks what user they meant or to just return if multiple members are found
 * @returns {Object} member on success or undefined on fail
 */

module.exports.GetMember = async (message, string, Discord, MustNotHaveMultiResults) => {
    try {
        let member = undefined;
        if (!isNaN(string) && string.length > 17 && string.length < 21) {
            member = await message.guild.members.fetch(string);
            return member
        }
        if (string.startsWith('<@')) {
            let member = message.guild.members.cache.get(string.slice(3, -1)) || message.guild.members.cache.get(string.slice(2, -1))
            if (!member) {
                if (string.includes('!')) {
                    member = await message.guild.members.fetch(string.slice(3, -1))
                    return member
                } else {
                    member = await message.guild.members.fetch(string.slice(2, -1))
                    return member
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