const mysql = require('mysql2');
const { GetMember, LogPunishment } = require('../moderationinc')
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
    description: 'adds a warn to a users account',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing permissions.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (!args[0]) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing arguments.\nProper usage: \`warn <@member|member_id> <reason>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let member = await GetMember(message, client, args[0], Discord, true, true)
        if (member === 'cancelled') return
        if (!member) {
            console.log('Invalid member')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid member.\nProper usage: \`warn <@member|member_id> <reason>\``)
            return message.channel.send({ embeds: [errorembed] });
        }
        let reason = args.slice(1).join(" ");
        LogPunishment(message, client, member.id, 7, null, reason)
        let casenumber = client.currentcasenumber.get(message.guild.id)
        const returnembed = new Discord.MessageEmbed()
            .setTitle(`Case #${casenumber}`)
            .setDescription(`<:check:988867881200652348> ${member} has been **warned**.`)
            .setColor("GREEN")
        message.channel.send({ embeds: [returnembed] })
    }
}