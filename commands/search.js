const { isInteger } = require('mathjs');
const mysql = require('mysql2');

require('dotenv').config();
const { GetMember, GetPunishName , HasPerms} = require("../moderationinc")
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
    name: 'search',
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (userstatus !== 1) {
            let perms = await HasPerms(message, message.member, client, 'k', 'l')
            if (!message.member.permissions.has("MANAGE_MESSAGES") && perms !== 1 || perms == 2) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`You do not have access to this command.`)
                return message.channel.send({ embeds: [errorembed] })
            }
        }
        if (!args[0]) {
            return message.channel.send('Missing arguments')
        }
        const member = await GetMember(message, client, args[0], Discord, true, true)
        if (!member) return message.channel.send('Invalid member.')
        if (member === 'cancelled') return
        let query = `SELECT * FROM serverpunishments WHERE userid = ? && serverid = ?`;
        let data = [member.id, message.guild.id];
        connection.query(query, data, async function (error, results, fields) {
            if (error) {
                message.channel.send('Error fetching user\'s data, please try again later');
                return console.log(error);
            }
            if (!results) return message.channel.send('This user has no punishments.')
            let pages = []
            let entries = []
            let entriesoncurrentpage = 0
            let usertag = undefined
            let avURL = undefined
            let currentpage = 0
            let totalbans = 0
            let totalmutes = 0
            let totalwarns = 0
            let totalkicks = 0
            let reason = undefined
            let type = undefined
            if (member.user) {
                usertag = member.user.tag
                avURL = member.user.avatarURL()
            } else {
                usertag = member.tag
                avURL = member.avatarURL()
            }
            pages.push('')
            for (row of results) {
                if (row["deleted"] == 1) continue
                if (row["reason"]) {
                    reason = row["reason"]
                } else {
                    reason = 'No reason given.'
                }
                entries.push(`**Case #${row["casenumber"]}: ${GetPunishName(row["type"])}**\n${reason}\n`)
                type = row['type']
                if (type == 1 || type == 8) { // regular & temp ban
                    totalbans += 1
                } else if (type == 3) { // mute
                    totalmutes += 1
                } else if (type == 5 || type == 6) { // kick & softban
                    totalkicks += 1
                } else if (type == 7) { // warn
                    totalwarns += 1
                }
            }
            entries.forEach(entry => {
                if (pages[currentpage].length + entry.length < 4012 && entriesoncurrentpage < 15) {
                    pages[currentpage] = pages[currentpage] += entry
                    entriesoncurrentpage = Number(entriesoncurrentpage) + 1
                } else {
                    currentpage = Number(currentpage) + 1
                    entriesoncurrentpage = 0
                    pages.push(entry)
                }
            })
            let printthing = undefined
            if (args[1]) {
                if (isNaN(args[1]) || !isInteger(args[1])) return message.channel.send('Invalid page.')
                printthing = pages[args[1] - 1]
                if (!printthing) return message.channel.send(`This page does't exist yet. Max page is currently ${pages.length}.`)
            } else {
                printthing = pages[0]
            }
            let footerstring = ''
            if (args[1]) {
                footerstring += `Page ${args[1]} of ${pages.length}`
            } else {
                footerstring += `Page 1 of ${pages.length}`
            }
            if (totalbans) {
                footerstring += ` • Bans: ${totalbans}`
            }
            if (totalkicks) {
                footerstring += ` • Kicks: ${totalkicks}`
            }
            if (totalmutes) {
                footerstring += ` • Mutes: ${totalmutes}`
            }
            if (totalwarns) {
                footerstring += ` • Warns: ${totalwarns}`
            }
            const caseembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${usertag}`, iconURL: avURL })
                .setColor('BLUE')
                .setDescription(printthing)
                .setFooter({ text: `${footerstring}` })
            return message.channel.send({ embeds: [caseembed] })
        });
    }
}