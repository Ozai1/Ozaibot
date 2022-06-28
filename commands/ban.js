const { GetMember, LogPunishment} = require("../moderationinc")
const mysql = require('mysql2');

require('dotenv').config();
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: 'ban',
    aliases: ['b', 'sban'],
    description: 'ban a user from a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (cmd === 'sban') return sban(message, args, userstatus, Discord)
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server.');
        if (!args[0]) {
            console.log('stopped, no member arg')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid member arguement.\nProper usage: \`ban <@user|user_id> <days to delete> <reason>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let member = await GetMember(message, client, args[0], Discord, false, false);
        if (member === 'cancelled') return
        if (!userstatus == 1) {
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Missing permissions.`)
                return message.channel.send({ embeds: [errorembed] })
            }
            if (member) {
                if (message.guild.ownerID !== message.author.id) {
                    if (message.member.roles.highest.position <= member.roles.highest.position) {
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                            .setColor(15684432)
                            .setDescription(`You cannot ban this member.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                }
            }
        }
        let offserver = false
        if (!member) {
            if (isNaN(args[0])) return message.channel.send('Usage is \`ban <@user|user_id> <days to delete> <reason>\`');
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
            if (member.id == client.user.id) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Why do you want to ban me :(`)
                return message.channel.send({ embeds: [errorembed] })
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
            let casenumber = client.currentcasenumber.get(message.guild.id) + 1
            const returnembed = new Discord.MessageEmbed()
                  .setTitle(`Case #${casenumber}`)
                .setDescription(`<:check:988867881200652348> ${member} has been **banned**.`)
                .setColor("GREEN")
            message.channel.send({ embeds: [returnembed] })
            console.log(`${member.user.tag} has been banned from ${message.guild}(${message.guild.id}) by ${message.author.tag}${message.author.id} and has had ${days} days of they're messages deleted.`)
            if (offserver === false) {
                const bannedembed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`You have been banned from ${message.guild}`)
                    .setTimestamp()
                if (reason) {
                    bannedembed.setDescription(`**Banned by:** ${message.author}\n**Reason:** ${reason}`)
                } else {
                    bannedembed.setDescription(`**Banned by:** ${message.author}`)
                }
                member.send({ embeds: [bannedembed] }).catch(err => { console.log(`The following message failed to send to the user.`) })
                console.log(`Confirmation message sent to ${member.user.tag}(${member.id}) for being banned from ${message.guild}(${message.guild.id}) by ${message.author.tag}(${message.author.id})`)
            }
            await message.guild.members.ban(member, { days: days, reason: `${reason} - ${message.author.tag} (${message.author.id})`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            LogPunishment(message, client, member.id, 1, null, reason)
        }
        let reason = args.slice(1).join(" ");
        if (reason.length > 512) return message.channel.send('Reason must be less than 512 characters long.')
        let casenumber = client.currentcasenumber.get(message.guild.id) + 1
        const returnembed = new Discord.MessageEmbed()
              .setTitle(`Case #${casenumber}`)
            .setDescription(`<:check:988867881200652348> ${member} has been **banned**.`)
            .setColor("GREEN")
        message.channel.send({ embeds: [returnembed] })
        if (offserver === false) {
            const bannedembed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`You have been banned from ${message.guild}`)
                .setTimestamp()
            if (reason) {
                bannedembed.setDescription(`**Banned by:** ${message.author}\n**Reason:** ${reason}`)
            } else {
                bannedembed.setDescription(`**Banned by:** ${message.author}`)
            }
            member.send({ embeds: [bannedembed] }).catch(err => { })
            console.log(`Confirmation message sent to ${member.user.tag} for being banned from ${message.guild}`)
        }
        await message.guild.members.ban(member, { reason: `${reason} - ${message.author.tag} (${message.author.id})` }).catch(err => {
            console.log(err)
            message.channel.send('Failed to ban.')
            return
        })
        LogPunishment(message, client, member.id, 1, null, reason)
    }
}
async function sban(message, args, userstatus, Discord) {
    if (userstatus == 1) {
        if (!args[0]) return message.member.send('You must add a member to kick.')
        const member = await GetMember(message, client, args[0], Discord, true, false)
        if (member === 'cancelled') return
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