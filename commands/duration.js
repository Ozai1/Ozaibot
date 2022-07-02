const mysql = require('mysql2');
const { GetDisplay, GetPunishName, GetPunishColour, GetPunishmentDuration, GetMember } = require('../moderationinc')
require('dotenv').config();
const {unix} = require('moment')
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
    name: 'duration',
    aliases: ['editduration', 'edit-duration'],
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!userstatus == 1) return message.channel.send('This command is currently disabled because it is able to break some systems under certain use cases, currently being tested')
        if (!message.member.permissions.has("MANAGE_GUILD")) {
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
                    if (!row["type"] == 3) {
                        return message.channel.send('This type of punishment does not have a duration.')
                    }
                    const length = await GetPunishmentDuration(args[1])
                    if (!length && !length == 0) {
                        return message.channel.send('Invalid time')
                    }
                    if (length === Infinity) {
                        const errorembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                            .setColor(15684432)
                            .setDescription(`Invalid time.`)
                        return message.channel.send({ embeds: [errorembed] });
                    }
                    const userid = row["userid"]
                    const adminid = row["adminid"]
                    const reason = row["reason"]
                    let timeexecuted = row["timeexecuted"]
                       let timeunban = Number(timeexecuted) + Number(length)
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
                    if (Number(timeunban) > Number(Date.now(unix).toString().slice(0, -3).valueOf()) && row["type"] == 3) {
                        let filter = m => m.author.id === message.author.id;
                        await message.channel.send({ content: "This action will re-activate the punishment, continue? `yes` / `no`" }).then(async () => {
                            await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                                message2 = message2.first();
                                if (message2.content.toLowerCase().startsWith('cancel') || message2.content.toLowerCase().startsWith('n')) return message.channel.send('Cancelled.')
                                else if (message2.content.toLowerCase() === 'y' || message2.content.toLowerCase() === 'yes') {
                                    let query = `UPDATE serverpunishments SET length = ? WHERE serverid = ? && casenumber = ?`;
                                    let data = [length, message.guild.id, casenumber];
                                    connection.query(query, data, async function (error, results, fields) {
                                        if (error) {
                                            message.channel.send('Error editing case. Please try again later.');
                                            return console.log(error);
                                        }
                                    })
                                    query = "INSERT INTO activebans (userid, serverid, timeunban, type) VALUES (?, ?, ?, ?)";
                                    data = [member.id, message.guild.id, timeunban, 'mute']
                                    connection.query(query, data, function (error, results, fields) {
                                        if (error) {
                                            message.channel.send('Creating unmute time in database failed. User is still muted but will not be automatically unmuted.')
                                            return console.log(error)
                                        }
                                        return
                                    })
                                    let muteroleid = client.muteroles.get(message.guild.id)
                                    let member2 = await GetMember(message,client,userid,Discord,false,false)
                                    if (!member2) return
                                    if (!muteroleid) {
                                        console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                                    }
                                    const muterole = message.guild.roles.cache.get(muteroleid)
                                    if (!muterole) {
                                        console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                        return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                                    }
                                    if (message.guild.me.roles.highest.position <= muterole.position) {
                                        console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                        return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                                    }
                                    member2.roles.add(muterole).catch(err => {
                                        console.log(err)
                                        console.log('Failed; unable to add muterole to member')
                                        return message.channel.send('Failed; unable to add muterole to member')
                                    });
                                    let timeleft = Number(timeunban) - Number(Date.now(unix).toString().slice(0, -3).valueOf())
                                    let display = GetDisplay(timeleft, true)
                                    const returnembed = new Discord.MessageEmbed()
                                        .setTitle(`Case #${casenumber}`)
                                        .setDescription(`<:check:988867881200652348> ${member} has been **muted**${display}.`)
                                        .setColor("GREEN")
                                        message.channel.send({ embeds: [caseembed, returnembed], content: "Case edited, now looks like:" });

                                }
                                else return message.channel.send('Cancelled: Invalid response.')
                            }).catch(collected => {
                                console.log(collected);
                                message.channel.send('Timed out.').catch(err => { console.log(err) });
                                return
                            });
                        });
                    } else {
                        message.channel.send({ embeds: [caseembed], content: "Case edited, now looks like:" });
                        let query = `UPDATE serverpunishments SET length = ? WHERE serverid = ? && casenumber = ?`;
                        let data = [length, message.guild.id, casenumber];
                        connection.query(query, data, async function (error, results, fields) {
                            if (error) {
                                message.channel.send('Error editing case. Please try again later.');
                                return console.log(error);
                            }
                        })
                    }
                }
            }
        })

    }
}