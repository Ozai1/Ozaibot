const mysql = require('mysql2');

require('dotenv').config();
const { GetMember } = require("../moderationinc")
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
    name: 'perms',
    description: 'Shows/sets a user\'s/role\'s permissions within the bot to allow/deny commands',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You do not have permission to use this command.')
        if (!args[1]) return message.channel.send('Invalid usage.')
        const member = await GetMember(message, client, args[1], Discord, true, true)
        if (!member) return message.channel.send('Invalid member.')
        if (args[0].toLowercase() === 'list') {
            
        } else if (args[0].toLowercase() === 'allow') {

        } else if (args[0].toLowercase() === 'deny') {

        } else {
            return message.channel.send('Invalid usage.')
        }
    }
}

async function list_perms(message,client,args,Discord){
    let query = `SELECT * FROM permissions WHERE id2 = ? && serverid = ?`;
        let data = [member.id, message.guild.id];
        connection.query(query, data,async function (error, results, fields) {
            if (error) {
                message.channel.send('Error fetching user\'s punishments');
                return console.log(error);
            }
            console.log(results)
            let currentpage = 1
            let currentresultonpage = 0
            let currentpagetext = ''
            let usertag = undefined
            if (member.user) {
                usertag = member.user.tag
            } else {
                usertag = member.tag
            }
            for (row of results) {
                if (row["deleted"] == 1) continue
                currentresultonpage = Number(currentresultonpage) + 1
                if (currentresultonpage > 12) {
                    if (!args[0]) {
                        const caseembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${usertag}`, iconURL: member.avatarURL() })
                            .setColor('BLUE')
                            .setDescription(currentpagetext)
                        return await message.channel.send({ embeds: [caseembed] })
                    }
                    if (Number(args[0]) == currentpage) {
                        const caseembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${usertag}`, iconURL: member.avatarURL() })
                            .setColor('BLUE')
                            .setDescription(currentpagetext)
                        return await message.channel.send({ embeds: [caseembed] })
                    }
                    if (Number(args[0]) === NaN && currentpage == 1) {
                        const caseembed = new Discord.MessageEmbed()
                            .setAuthor({ name: `${usertag}`, iconURL: member.avatarURL() })
                            .setColor('BLUE')
                            .setDescription(currentpagetext)
                        return await message.channel.send({ embeds: [caseembed] })
                    }
                    currentpagetext = ''
                    currentpage = currentpage + 1
                }
                currentpagetext = currentpagetext + `**Case #${row["casenumber"]}: ${GetPunishName(row["type"])}**\n`
                let reason = row["reason"]
                if (reason == '' || reason === null) {
                    currentpagetext = currentpagetext + '\n'
                } else {
                    if (reason.length > 300) {
                        reason = reason.slice(0, reason.length - 300)
                        reason = reason + '...'
                    }
                    currentpagetext = currentpagetext + `${reason}\n\n`
                }
            }
            const caseembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${usertag}`, iconURL: member.avatarURL() })
                .setColor('BLUE')
                .setDescription(currentpagetext)
            return message.channel.send({ embeds: [caseembed] })
        });
}