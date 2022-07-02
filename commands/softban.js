const mysql = require('mysql2');
const unix = require('moment')
require('dotenv').config();
const { GetMember, LogPunishment, NotifyUser } = require("../moderationinc");
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
    name: 'softban',
    aliases: ['sb', 'soft-ban'],
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('You do not have permission to use this command.')
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('I do not have ban permissions in this server.')
        if (!args[0]) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing arguments.\n\nProper useage is:\n\`soft-ban <@member|member_id> <days to delete> <reason>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let daystodelete = 1
        let reason = args.slice(1).join(" ");
        if (args[1] && !isNaN(args[1]) && args[1].length == 1) {
            if (args[1] > 7 || args[1] < 1) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Invalid days to delete.\n\nMaximum days to delete is \`7\`.\nMinimum days to delete is \`1\`.`)
                return message.channel.send({ embeds: [errorembed] })
            }
            daystodelete = args[1]
            reason = args.slice(2).join(" ");
        }
        let member = await GetMember(message, client, args[0], Discord, true, false)
        if (member === 'cancelled') return
        if (!member) {
            member = await GetMember(message, client, args[0], Discord, false, true)
            if (!member) {
                console.log('invalid member')
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Invalid member.\n\nProper useage is:\n\`soft-ban <@member|member_id> <days to delete> <reason>\``)
                return message.channel.send({ embeds: [errorembed] })
            }
            if (member.id === message.author.id) {
                console.log('attempted self soft-ban, canceling')
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`You cannot soft-ban yourself.`)
                return message.channel.send({ embeds: [errorembed] })
            }
            message.guild.bans.fetch().then(async bans => {
                let member2 = bans.get(args[0]);
                if (member2) {
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`This member is already banned.\n\nSoft-ban cannot be executed because a full ban is already in place on this user.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
                else {
                    ExecuteBanAndUnBan(message, client, member, daystodelete, Discord)
                    LogPunishment(message, client, member.id, 6, null, reason)
                }
            })
        } else {
            if (member.id === message.author.id) {
                console.log('attempted self soft-ban, canceling')
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`You cannot soft-ban yourself.`)
                return message.channel.send({ embeds: [errorembed] })
            }
            if (message.guild.ownerID !== message.author.id) {
                if (message.author.id !== '508847949413875712') {
                    if (message.member.roles.highest.position <= member.roles.highest.position) {
                        console.log('attempted mute against someone of higher rank, canceling')
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                            .setColor(15684432)
                            .setDescription(`You cannot soft-ban members with higher or the same permissions as your own.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                }
            }
            if (member.id == client.user.id) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Why do you want to soft-ban me :(`)
                return message.channel.send({ embeds: [errorembed] })
            }
            if (!member.bannable) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`I cannot soft-ban this member\n\nPlease move my role(s) above any members role(s) you want me to be able to punish.`)
                return message.channel.send({ embeds: [errorembed] })
            }
            await NotifyUser(6, message, `You have been soft-banned from ${message.guild}`, member, reason, 0, client, Discord)
            ExecuteBanAndUnBan(message, client, member, daystodelete, Discord)
            LogPunishment(message, client, member.id, 6, null, reason)
        }
    }
}
async function ExecuteBanAndUnBan(message, client, member, daystodelete, Discord) {
    let casenumber = client.currentcasenumber.get(message.guild.id) + 1
    const returnembed = new Discord.MessageEmbed()
        .setTitle(`Case #${casenumber}`)
        .setDescription(`<:check:988867881200652348> ${member} has been **soft-banned**.`)
        .setColor("GREEN")
    message.channel.send({ embeds: [returnembed] })
    await message.guild.members.ban(member, { days: daystodelete, reason: `soft-ban insigated by ${message.author.tag} (${message.author.id}), please check ozaibot logs for more info`, }).catch(err => {
        console.log(err)
        message.channel.send('Failed to ban.')
        return
    })
    message.guild.members.unban(member, `soft-ban insigated by ${message.author.tag} (${message.author.id}), please check ozaibot logs for more info`).catch(err => {
        console.log(err)
        message.channel.send('Failed to un-ban.')
        return
    })
}