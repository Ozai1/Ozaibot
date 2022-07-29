const mysql = require('mysql2');
const { GetMember, LogPunishment, NotifyUser } = require('../moderationinc')
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
    name: 'warn',
    aliases: ['w'],
    description: 'adds a warn to a users account',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`You do not have access to this command.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (!args[0]) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing arguments.\nProper usage: \`warn <@member|member_id> <reason>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let member = await GetMember(message, client, args[0], Discord, true, false)
        let offserver = false
        if (!member) {
            member = await GetMember(message, client, args[0], Discord, false, true)
            if (!member) {
                console.log('Invalid member')
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Invalid member.\nProper usage: \`warn <@member|member_id> <reason>\``)
                return message.channel.send({ embeds: [errorembed] });
            }
            offserver = true
        }
        if (member === 'cancelled') return
        if (message.guild.ownerId !== message.author.id) {
            if (message.author.id !== '508847949413875712') {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted warn against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot warn members with higher or the same permissions as your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
        let reason = args.slice(1).join(" ");
        let casenumber = client.currentcasenumber.get(message.guild.id) + 1
        LogPunishment(message, client, member.id, 7, null, reason, Discord)
        NotifyUser(7, message, `You have been warned in ${message.guild}`, member, reason, 0, client, Discord)
        const returnembed = new Discord.MessageEmbed()
            .setTitle(`Case #${casenumber}`)
            .setDescription(`<:check:988867881200652348> ${member} has been **warned**.`)
            .setColor("GREEN")
        message.channel.send({ embeds: [returnembed] })
    }
}