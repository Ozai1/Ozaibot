const { getPackedSettings } = require('http2');
const mysql = require('mysql2');
const moment = require('moment')
const { GetMember } = require('../moderationinc')
require('dotenv').config();
const connection = mysql.createPool({
    host: '112.213.34.137',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: 'user',
    description: 'whatever i make at the time',
    aliases: ['user', 'userinfo', 'who', 'whois', 'user-info'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!args[0]) {
            if (message.guild) {
                let member = message.guild.members.cache.get(message.author.id)
                let user = client.users.cache.get(message.author.id)
                const joinedatunix = Number(moment(member.joinedAt).unix())
                const createdatunix = Number(moment(user.createdAt).unix())
                const uiembed = new Discord.MessageEmbed()
                    .setTitle(`${user.tag}`)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                if (user.bot) {
                    uiembed.setDescription('Is a bot')
                }
                uiembed.addField('ID', user.id)
                    .addField('Highest rank', member.roles.highest)
                    .addField('Joined server at', `\`${moment(member.joinedAt).format('DD MMM YYYY, H:MM')}\`, <t:${joinedatunix}:R>`)
                    .addField('Created account at', `\`${moment(member.user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                    .setFooter({ text: `requested by ${message.author.tag}` })
                    .setTimestamp()
                    .setColor(member.displayHexColor);
                message.channel.send({ embeds: [uiembed] })
            } else {
                let user = client.users.cache.get(message.author.id)
                const createdatunix = Number(moment(user.createdAt).unix())
                const uiembed = new Discord.MessageEmbed()
                    .setTitle(`${user.tag}`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                if (user.bot) {
                    uiembed.setDescription('`Is a bot` 🤖')
                }
                uiembed.addField('ID', user.id)
                    .addField('Created account at', `\`${moment(user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                    .setFooter({ text: `requested by ${message.author.tag}` })
                    .setTimestamp()
                    .setColor(240116);
                message.channel.send({ embeds: [uiembed] })
            }
        } else {
            let member = await GetMember(message, client, args[0], Discord, true, false)
            let membertype = 1
            if (member === 'cancelled') return
            if (!member) {
                membertype = 0
                member = await GetMember(message, client, args[0], Discord, false, true)
                if (!member) {
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid member.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
            if (membertype == 1) {
                const joinedatunix = Number(moment(member.joinedAt).unix())
                const createdatunix = Number(moment(member.user.createdAt).unix())
                const uiembed = new Discord.MessageEmbed()
                    .setTitle(`${member.user.tag}`)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                if (member.user.bot) {
                    uiembed.setDescription('`Is a bot` 🤖')
                }
                uiembed.addField('ID', member.user.id)
                    .addField('Highest rank', `${member.roles.highest.name}`)
                    .addField('Joined server at', `\`${moment(member.joinedAt).format('DD MMM YYYY, H:MM')}\`, <t:${joinedatunix}:R>`)
                    .addField('Created account at', `\`${moment(member.user.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                    .setFooter({ text: `requested by ${message.author.tag}` })
                    .setTimestamp()
                    .setColor(member.displayHexColor);
                message.channel.send({ embeds: [uiembed] })
            } else {
                const createdatunix = Number(moment(member.createdAt).unix())
                const uiembed = new Discord.MessageEmbed()
                    .setTitle(`${member.tag}`)
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                if (member.bot) {
                    uiembed.setDescription('Is a bot.')
                }
                uiembed.addField('ID', member.id)
                    .addField('Created account at', `\`${moment(member.createdAt).format('DD MMM YYYY, H:MM')}\`, <t:${createdatunix}:R>`)
                    .setFooter({ text: `requested by ${message.author.tag}` })
                    .setTimestamp()
                    .setColor(240116);
                message.channel.send({ embeds: [uiembed] })
            }
        }
    }
}
