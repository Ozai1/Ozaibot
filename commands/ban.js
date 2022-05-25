const { GetMember } = require("../functions")
module.exports = {
    name: 'ban',
    aliases: ['b', 'sban'],
    description: 'ban a user from a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (cmd === 'sban') return sban(message, args, userstatus, Discord)
        let offserver = false
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server.');
        if (!args[0]) {
            console.log('stopped, no member arg')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                .setColor(15684432)
                .setDescription(`Invalid member arguement.\nProper usage: \`sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let member = await GetMember(message, args[0], Discord, false);
        if (userstatus == 1) {
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                if (!member) {
                    if (isNaN(args[0])) {
                        console.log('Usage is "sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>"');
                        return message.channel.send('Usage is "sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>"');
                    }
                    member = await client.users.fetch(args[0]).catch(err => { })
                    offserver = true;
                    if (!member) {
                        message.channel.send('Invalid id.');
                        console.log('Invalid id');
                        return;
                    }
                }
                if (offserver === false) {
                    if (!member.bannable) return;
                }
                if (!isNaN(args[1]) && args[1].length == 1) {
                    let days = Number(args[1]);
                    if (days > 7) {
                        console.log('attempted ban while requesting more than 7 days worth of messages be deleted, canceling')
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                            .setColor(15684432)
                            .setDescription(`You cannot delete more than 7 days worth of messages.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    if (days < 1) {
                        console.log('attempted ban while requesting less than 1 days worth of messages be deleted, canceling')
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                            .setColor(15684432)
                            .setDescription(`You cannot delete less than 1 day of messages.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    let reason = args.slice(2).join(" ");
                    if (reason.length > 400) {
                        console.log('ban reason to long, canceling')
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                            .setColor(15684432)
                            .setDescription(`Invalid Reason arguement:\nReason must be less than 400 characters long.\nYour current reason length is: ${reason.length} characters long.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    if (!reason) reason = 'No reason provided';
                    message.channel.send(`${member} has been banned and has had ${days} days of they're messages deleted.`)
                    const bannedembed = new Discord.MessageEmbed()
                        .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
                        .setColor('RED')
                        .setTimestamp()
                    if (offserver === false) {
                        member.send({ embeds: [bannedembed] }).catch(err => { })
                        console.log(`Confirmation message sent to ${member.user.tag} for being banned from ${message.guild}`)
                    }
                    await message.guild.members.ban(member, { days: days, reason: `${reason}`, }).catch(err => {
                        console.log(err)
                        console.log('Failed to ban.')
                        message.channel.send('Failed to ban.')
                        return
                    })
                    console.log(`${member.user.tag} has been banned and has had ${days} days of they're messages deleted.`)
                    return
                } else {
                    let reason = args.slice(1).join(" ");
                    if (reason.length > 400) {
                        console.log('ban reason to long, canceling')
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                            .setColor(15684432)
                            .setDescription(`Invalid Reason arguement:\nReason must be less than 400 characters long.\nYour current reason length is: ${reason.length} characters long.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    if (!reason) reason = 'no reason provided';
                    message.channel.send(`${member} has been banned.`)
                    const bannedembed = new Discord.MessageEmbed()
                        .addField(`**You have been banned from** ${message.guild}.`, `**For**: ${reason}`)
                        .setColor('RED')
                        .setTimestamp()
                    if (offserver === false) {
                        member.send({ embeds: [bannedembed] }).catch(err => { console.log(`The folowing message failed to send to the user.`) })
                        console.log(`Confirmation message sent to ${member.user.tag}(${member.id}) for being banned from ${message.guild}(${message.guild.id}) by ${message.author.tag}(${message.author.id})`)
                    }
                    await message.guild.members.ban(member, { reason: `${reason}`, }).catch(err => {
                        console.log(err)
                        message.channel.send(`Failed to ban.`)
                        return
                    })
                    return
                }
            }
        }
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permissions to ban members.');
        if (!member) {
            if (isNaN(args[0])) return message.channel.send('Usage is "sm_ban <@user|user_id> <days_to_delete(optional)> <reason(optional)>"');
            member = await client.users.fetch(args[0]).catch(err => { })
            offserver = true;
            if (!member) {
                console.log('Invalid id.')
                return message.channel.send('Invalid id.')
            }
        }
        if (offserver === false) {
            if (member.id === message.author.id) {
                console.log('You can\'t ban yourself.');
                return message.channel.send('You can\'t ban yourself.');
            }
            if (message.guild.ownerID !== message.author.id) {
                if (message.member.roles.highest.position <= member.roles.highest.position) {
                    console.log('You cannot ban someone with higher or the same roles as your own.');
                    return message.channel.send('You cannot ban someone with higher or the same roles as your own.');
                }
            }
            if (!member.bannable) {
                console.log("I cannot ban this member.");
                return message.reply("I cannot ban this member.");
            }
        }
        if (!isNaN(args[1]) && args[1].length == 1) {
            let days = Number(args[1]);
            if (days > 7) return message.channel.send('The days of messages to be deleted cannot be more than 7.');
            if (days < 1) return message.channel.send('You cannot delete 0 days of messages.');
            let reason = args.slice(2).join(" ");
            if (reason.length > 512) {
                console.log('Reason must be less than 512 characters long.');
                return message.channel.send('Reason must be less than 512 characters long.');
            }
            if (!reason) reason = 'No reason provided';
            message.channel.send(`${member} has been banned and has had ${days} days of they're messages deleted.`);
            console.log(`${member.user.tag} has been banned from ${message.guild}(${message.guild.id}) by ${message.author.tag}${message.author.id} and has had ${days} days of they're messages deleted.`)
            const bannedembed = new Discord.MessageEmbed()
                .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
                .setColor('RED')
                .setTimestamp()
            if (offserver === false) {
                member.send({ embeds: [bannedembed] }).catch(err => { console.log(`The folowing message failed to send to the user.`) })
                console.log(`Confirmation message sent to ${member.user.tag}(${member.id}) for being banned from ${message.guild}(${message.guild.id}) by ${message.author.tag}(${message.author.id})`)
            }
            await message.guild.members.ban(member, { days: days, reason: `${reason} - ${message.author.tag} (${message.author.id})`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            return;
        }
        let reason = args.slice(1).join(" ");
        if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
        if (!reason) reason = 'no reason provided';
        message.channel.send(`${member} has been banned.`);
        const bannedembed = new Discord.MessageEmbed()
            .addField(`**You have been banned from**: ${message.guild}.`, `**Banned by**: ${message.author} \n **For**: "${reason}".`)
            .setColor('RED')
            .setTimestamp()
        if (offserver === false) {
            member.send({ embeds: [bannedembed] }).catch(err => { })
            console.log(`Confirmation message sent to ${member.user.tag} for being banned from ${message.guild}`)
        }
        await message.guild.members.ban(member, { reason: `${reason} - ${message.author.tag} (${message.author.id})` }).catch(err => {
            console.log(err)
            message.channel.send('Failed to ban.')
            return
        })
    }
}
async function sban(message, args, userstatus, Discord) {
    if (userstatus == 1) {
        if (!args[0]) return message.member.send('You must add a member to kick.')
        const member = await GetMember(message, args[0], Discord, false)
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server!')
        if (!member) return message.author.send('no member')
        if (!member.bannable) return message.author.send('I do not have high enough permissions for this or they\'re not on the server or smth')
        await message.guild.members.ban(member, { reason: `${reason}` }).catch(err => {
            console.log(err)
            message.author.send('Failed to ban.')
            return
        })
        return
    }
}