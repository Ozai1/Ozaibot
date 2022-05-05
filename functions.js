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
            "d", "day", "days"
        ],
    },
    "month": {
        "time": 2592000,
        "aliases": [
            "mon", "month", "months"
        ],
    }
}
module.exports.getAlias = (string) => {
    for (const key in times) if (times[key].aliases.includes(string)) return key;
}
module.exports.getTime = (key) => {
    if (times[key] && times[key].time) {
        return times[key].time;
    }
    return -1;
}
module.exports.aliases = times;
module.exports.GetMember = async (message, string, Discord) => {
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
        if (possibleusers.length > 9) {
            message.channel.send('To many possible members from that name, use a more definitive string.')
            return undefined
        }
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members did you mean? Please type out the corrosponding number.')
            .setDescription(possibleusers)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        return await message.channel.send({embeds: [helpembed]}).then(async confmessage => {
            return await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                message2.delete().catch(err => { });
                confmessage.delete().catch(err => { });
                if (isNaN(message2.content)) {
                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                    return undefined
                }
                if (message2.content >= possibleusers.length + 1) {
                    message2.channel.send('Failed, that number isnt on the list.')
                    return undefined
                }
                member = message.guild.members.cache.find(member => member.user.tag === possibleusers[message2.content - 1].slice(4, -1));
                if (!member) {
                    message.channel.send('failed for whatever reason')
                    return undefined
                }
                return member;
            }).catch(collected => {
                console.log(collected);
                message.channel.send('Timed out ' + message.author).catch(err => { console.log(err) });
                return undefined
            });
        });
    } catch (err) {
        console.log(err)
    }
}