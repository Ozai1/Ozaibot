const mysql = require('mysql2');
const { GetDisplay } = require('../moderationinc')
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
    name: 'case',
    description: 'gets and displays a users past punishments',
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
                .setDescription(`Missing arguments.\nProper usage: \`case <case number> `)
            return message.channel.send({ embeds: [errorembed] })
        }
        let casenumber = args[0]
        if (casenumber.startsWith('#')) {
            casenumber = casenumber.slice(1)
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
                    .setDescription(`That case does not exist yet.`)
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
                    const punishtype = row["type"]
                    casenumber = row["casenumber"]
                    const timeexecuted = row["timeexecuted"]
                    const length = row["length"]
                    const userid = row["userid"]
                    const adminid = row["adminid"]
                    const reason = row["reason"]
                    const member = await client.users.fetch(userid)
                    const adminperson = await client.users.fetch(adminid)
                    let embedstring = ''
                    if (length && reason) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Duration:** ${GetDisplay(length, false)}\n**Reason:** ${reason}`
                    } if (length && !reason) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Duration:** ${GetDisplay(length, false)}`
                    } if (reason && !length) {
                        embedstring = `**Member:** ${member.tag} (${member.id})\n**Action:** ${punishtype}\n**Reason:** ${reason}`
                    }
                    const caseembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${adminperson.tag}`, iconURL: adminperson.avatarURL() })
                        .setColor('BLUE')
                        .setDescription(embedstring)
                        .setTimestamp(Date(timeexecuted))
                        .setFooter({ text: `Case #${casenumber}` })
                    message.channel.send({ embeds: [caseembed] });
                }
            }
        })
    }
}