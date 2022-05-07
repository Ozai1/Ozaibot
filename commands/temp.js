module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        //if (!userstatus == 1) return
        if (!args[0]) return message.channel.send('Add a users *name* for me to lock on to')
        let possibleusers = [];
        message.guild.members.cache.forEach(member => {
            if (member.user.tag.toLowerCase().includes(args[0].toLowerCase())) {
                possibleusers.push(`#${possibleusers.length} ${member.user.tag}`)
            }
        })
        if (!possibleusers[0]) {
            return message.channel.send('Could not find a member with that name or a channel that has that in its name.')
        } else if (!possibleusers[1]) {
            let member2 = message.guild.members.cache.find(member => member.user.tag === possibleusers[0].slice(3));
            if (!member2) return message.author.send('No member fo');
            message.channel.send(`Member found is ${member2.user.tag}, ${member2.id}`)
            return
        } 
        if (possibleusers.length > 9) return message.channel.send('To many possible members from that name, use a more definitive string.')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Which of these members did you mean? Please type out the corrosponding number.')
            .setDescription(possibleusers)
            .setColor('BLUE')
        let filter = m => m.author.id === message.author.id;
        await message.channel.send(helpembed).then(confmessage => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                message2 = message2.first();
                message2.delete().catch(err => { });
                confmessage.delete().catch(err => { });
                if (isNaN(message2.content)) return message2.channel.send('Failed, you are supposed to pick one of the channels #-numbers.')
                if (message2.content >= possibleusers.length) return message2.channel.send('Failed, that number isnt on the list.')
                let member2 = message2.guild.members.cache.find(member => member.user.tag === possibleusers[message2.content].slice(3));
                if (!member2) return message.channel.send('failed for whatever reason')
                return message.channel.send(`memebr found was ${member2.user.tag}, ${member2.id}`)
            }).catch(collected => {
                console.log(collected);
                return message.channel.send('Timed out').catch(err => { console.log(err) });
            });
        });
    }
}