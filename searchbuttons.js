const mysql = require('mysql2');

require('dotenv').config();
const { GetPunishName, HasPerms } = require("./moderationinc")
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

module.exports.SearchButton = async (interaction, client, Discord) => {
    let userstatus = client.userstatus.get(interaction.user.id)
    if (userstatus !== 1) {
        let perms = await HasPerms(interaction.message, interaction.member, client, 'k', 'l')
        if (!interaction.member.permissions.has("MANAGE_MESSAGES") && perms !== 1 || perms == 2) {
            const errorembed = new Discord.MessageEmbed()
                .setColor(15684432)
                .setDescription(`You do not have access to this button.`)
            return interaction.reply({ embeds: [errorembed], ephemeral: true })
        }
    }
    let interationcomponents = interaction.customId.split("_")
    let member = await client.users.cache.get(interationcomponents[1])
    if (!member) { member = await client.users.fetch(interationcomponents[1]) }
    if (!member) return interaction.reply({ content: "The member for this search page was not found.", ephemeral: true })
    selectedpage = Number(interationcomponents[2])
    let query = `SELECT * FROM serverpunishments WHERE userid = ? && serverid = ?`;
    let data = [member.id, interaction.guild.id];
    connection.query(query, data, async function (error, results, fields) {
        if (error) {
            interaction.reply('Error fetching user\'s data, please try again later');
            return console.log(error);
        }
        if (results) return message.channel.send('This user has no punishments.')
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
            if (reason.length > 512) {
                let slicelength = reason.length - 512
                reason = reason.slice(0, -slicelength) + '... (continued)'
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
        let printthing = pages[selectedpage - 1]
        if (!printthing) return interaction.reply({ content: "This page doesnt exist any more.", ephemeral: true })
        let footerstring = ''
        if (selectedpage) {
            footerstring += `Page ${selectedpage} of ${pages.length}`
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
        const button = new Discord.MessageActionRow()
        if (pages[selectedpage - 2]) {
            button.addComponents(
                new Discord.MessageButton()
                    .setLabel(`Previous Page`)
                    .setStyle("PRIMARY")
                    .setCustomId(`SEARCH_${member.id}_${Number(selectedpage) - 1}`)
            )
        }
        if (pages[selectedpage]) {
            button.addComponents(
                new Discord.MessageButton()
                    .setLabel(`Next Page`)
                    .setStyle("PRIMARY")
                    .setCustomId(`SEARCH_${member.id}_${Number(selectedpage) + 1}`)
            )
        }
        interaction.deferUpdate();
        if (button.components[0]) {
            return interaction.message.edit({ embeds: [caseembed], components: [button] })
        } else {
            return interaction.message.edit({ embeds: [caseembed], components: null })
        }
    });
}