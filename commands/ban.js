module.exports = {
    name: 'ban',
    aliases: ['b'],
    description: 'ban a user from a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        let offserver = false
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server.');
        let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
        if (userstatus == 1) {
            if (!message.member.hasPermission('BAN_MEMBERS')) {
                if (!member) {
                    if (isNaN(args[0])) return message.channel.send('Usage is "sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>"');
                    member = await client.users.fetch(args[0]).catch(err => { })
                    offserver = true;
                    if (!member) return message.channel.send('Invalid id.')
                }
                if (offserver === false) {
                    if (!member.bannable) return;
                }
                if (!isNaN(args[1]) && args[1].length == 1) {
                    let days = Number(args[1]);
                    if (days > 7) return message.channel.send('The days of messages to be deleted cannot be more than 7.');
                    if (days < 1) return message.channel.send('You cannot delete 0 days of messages.');
                    let reason = args.slice(2).join(" ");
                    if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
                    if (!reason) reason = 'No reason given';
                    message.channel.send(`${member} has been banned and has had ${days} days of they're messages deleted.`)
                    const bannedembed = new Discord.MessageEmbed()
                        .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
                        .setColor('RED')
                        .setTimestamp()
                    if (offserver === false) {
                        member.send(bannedembed).catch(err => { })
                        console.log(`Confirmation message sent to ${member.tag} for being banned from ${message.guild}`)
                    }
                    await message.guild.members.ban(member, { days: days, reason: `${reason}`, }).catch(err => {
                        console.log(err)
                        message.channel.send('Failed to ban.')
                        return
                    })
                    return
                }
                let reason = args.slice(1).join(" ");
                if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
                if (!reason) reason = 'No reason given';
                message.channel.send(`${member} has been banned.`)
                const bannedembed = new Discord.MessageEmbed()
                    .addField(`**You have been banned from** ${message.guild}.`, `**For**: ${reason}`)
                    .setColor('RED')
                    .setTimestamp()
                if (offserver === false) {
                    member.send(bannedembed).catch(err => { })
                    console.log(`Confirmation message sent to ${member.tag} for being banned from ${message.guild}`)
                }
                await message.guild.members.ban(member, { reason: `${reason}`, }).catch(err => {
                    console.log(err)
                    message.channel.send(`Failed to ban.`)
                    return
                })
                return
            }
        }
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('You do not have permissions to do this!');
        if (!member) {
            if (isNaN(args[0])) return message.channel.send('Usage is "sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>"');
            member = await client.users.fetch(args[0]).catch(err => { })
            offserver = true;
            if (!member) return message.channel.send('Invalid id.')
        }
        if (offserver === false) {
            if (member.id === message.author.id) return message.channel.send('You can\'t ban yourself!');
            if (message.guild.ownerID !== message.author.id) {
                if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot ban someone with higher or the same roles as your own.');
            }
            if (!member.bannable) return message.reply("I cannot ban this member!");
        }
        if (!isNaN(args[1]) && args[1].length == 1) {
            let days = Number(args[1]);
            if (days > 7) return message.channel.send('The days of messages to be deleted cannot be more than 7.');
            if (days < 1) return message.channel.send('You cannot delete 0 days of messages.');
            let reason = args.slice(2).join(" ");
            if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
            if (!reason) reason = 'No reason given';
            message.channel.send(`${member} has been banned and has had ${days} days of they're messages deleted.`);
            const bannedembed = new Discord.MessageEmbed()
                .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
                .setColor('RED')
                .setTimestamp()
            if (offserver === false) {
                member.send(bannedembed).catch(err => { })
                console.log(`Confirmation message sent to ${member.tag} for being banned from ${message.guild}`)
            }
            await message.guild.members.ban(member, { days: days, reason: `"${reason}" - ${message.author.tag} (${message.author.id})`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            return;
        }
        let reason = args.slice(1).join(" ");
        if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
        if (!reason) reason = 'No reason given';
        message.channel.send(`${member} has been banned.`);
        const bannedembed = new Discord.MessageEmbed()
            .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
            .setColor('RED')
            .setTimestamp()
        if (offserver === false) {
            member.send(bannedembed).catch(err => { })
            console.log(`Confirmation message sent to ${member.tag} for being banned from ${message.guild}`)
        }
        await message.guild.members.ban(member, { reason: `"${reason}" - ${message.author.tag} (${message.author.id})` }).catch(err => {
            console.log(err)
            message.channel.send('Failed to ban.')
            return
        })
    }
}