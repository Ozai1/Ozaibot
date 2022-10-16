const mysql = require('mysql2');
const { GetDisplay, GetPunishName, GetPunishColour,HasPerms } = require('../moderationinc')
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
    name: 'reason',
    aliases: ['editreason', 'edit-reason'],
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (userstatus !== 1) {
            let perms = await HasPerms(message, message.member, client, 'h', 'l')
            if (!message.member.permissions.has("KICK_MEMBERS") && perms !== 1 || perms == 2) {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`You do not have access to this command.`)
                return message.channel.send({ embeds: [errorembed] })
            }
        }
        if (!args[0]) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing arguments.\nProper usage: \`case <case number>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let casenumber = args[0]
        if (casenumber.startsWith('#')) {
            casenumber = casenumber.slice(1)
        }
        if (isNaN(casenumber)) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid case.\nProper usage: \`case <case number>\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let query = `SELECT * FROM serverpunishments WHERE serverid = ? && casenumber = ?`;
        let data = [message.guild.id, casenumber];
        connection.query(query, data, async function (error, results, fields) {
            if (error) {
                message.channel.send('Error fetching case. Please try again later.');
                return console.log(error);
            }
            if (results == '') {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`This case does not exist yet.`)
                return message.channel.send({ embeds: [errorembed] })
            } else {
                for (row of results) {
                    if (row["deleted"] == 1) {
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                            .setColor(15684432)
                            .setDescription(`This case has been deleted.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    casenumber = row["casenumber"]
                    let punishtype = row["type"]
                    punishtype = GetPunishName(punishtype)
                    const length = row["length"]
                    const userid = row["userid"]
                    const adminid = row["adminid"]
                    const reason = args.slice(1).join(" ");
                    let timeexecuted = row["timeexecuted"]
                    let logsmessage = row["logmessageid"]
                    timeexecuted = timeexecuted + '000'
                    timeexecuted = Date.now() - timeexecuted
                    const member = await client.users.fetch(userid)
                    const adminperson = await client.users.fetch(adminid)
                    let embedstring = ''
                    if (length && reason) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Duration:** ${GetDisplay(length, false)}\n**Reason:** ${reason}`
                    } if (length && !reason) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Duration:** ${GetDisplay(length, false)}`
                    } if (reason && !length) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Reason:** ${reason}`
                    } if (!reason && !length) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}`
                    }
                    let colour = GetPunishColour(row["type"])
                    const caseembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${adminperson.tag}`, iconURL: adminperson.avatarURL() })
                        .setColor(colour)
                        .setDescription(embedstring)
                        .setTimestamp(Date.now() - timeexecuted)
                        .setFooter({ text: `Case #${casenumber}` })
                    message.channel.send({ embeds: [caseembed], content: "Case edited, now looks like:" });
                    let query = `UPDATE serverpunishments SET reason = ? WHERE serverid = ? && casenumber = ?`;
                    let data = [args.slice(1).join(" "), message.guild.id, casenumber];
                    connection.query(query, data, async function (error, results, fields) {
                        if (error) {
                            message.channel.send('Error fetching case. Please try again later.');
                            return console.log(error);
                        }
                    })
                    let modlogs = client.modlogs.get(message.guild.id)
                    modlogs = message.guild.channels.cache.get(modlogs)
                    if (!modlogs) return
                    logsmessage = await modlogs.messages.fetch(logsmessage).catch(err => {console.error(err)})
                    if (!logsmessage) return
                    logsmessage.edit({ embeds: [caseembed] }).catch(err => { console.error(err) })
                }
            }
        })
    }
}