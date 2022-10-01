const mysql = require('mysql2');
const { GetDisplay, GetPunishName, GetPunishColour, HasPerms } = require('../moderationinc')
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
    name: 'removecase',
    aliases: ['rmcase', 'remove-case'],
    description: 'Deletes a case from the database.',
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
                .setDescription(`Missing arguments.\nProper usage: \`remove-case <case number>\``)
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
                .setDescription(`Invalid case.\nProper usage: \`remove-case <case number>\``)
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
                            .setDescription(`This case has already been deleted.`)
                        return message.channel.send({ embeds: [errorembed] })
                    }
                    casenumber = row["casenumber"]
                    let punishtype = row["type"]
                    punishtype = GetPunishName(punishtype)
                    const length = row["length"]
                    const userid = row["userid"]
                    const adminid = row["adminid"]
                    const reason = row["reason"]
                    let timeexecuted = row["timeexecuted"]
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
                    let filter = m => m.author.id === message.author.id;
                    await message.channel.send({ embeds: [caseembed], content: "Are you sure you would like to delete this case? `yes` / `no`" }).then(async () => {
                        await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                            message2 = message2.first();
                            if (message2.content.toLowerCase().startsWith('cancel') || message2.content.toLowerCase().startsWith('n')) return conformationmessage.edit('Cancelled.')
                            else if (message2.content.toLowerCase() === 'y' || message2.content.toLowerCase() === 'yes') {
                                let query = `UPDATE serverpunishments SET deleted = 1 WHERE serverid = ? && casenumber = ?`;
                                let data = [message.guild.id, casenumber];
                                connection.query(query, data, async function (error, results, fields) {
                                    if (error) {
                                        message.channel.send('Error deleting case. Please try again later.');
                                        return console.log(error);
                                    }
                                    const returnembed = new Discord.MessageEmbed()
                                        .setDescription(`<:check:988867881200652348> Case #${casenumber} has been deleted.`)
                                        .setColor("GREEN")
                                    message.channel.send({ embeds: [returnembed] })
                                })
                            }
                            else return message.channel.send('Cancelled: Invalid response.')
                        }).catch(collected => {
                            console.log(collected);
                            message.channel.send('Timed out.').catch(err => { console.log(err) });
                            return
                        });
                    });
                }
            }
        })
    }
}