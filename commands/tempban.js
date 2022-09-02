const { unix } = require('moment');
const mysql = require('mysql2');

const { GetMember, GetDisplay, GetPunishmentDuration, LogPunishment, NotifyUser } = require("../moderationinc")
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
    name: 'tempban',
    aliases: ['tb', 'temp-ban'],
    description: 'mutes a user in a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (!userstatus == 1) {
            if (!message.member.permissions.has("BAN_MEMBERS")) {
                console.log("You do not have access to this command.")
                return message.channel.send("You do not have access to this command.");
            }
        } if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            console.log('Ozaibot does not have Permissions to ban in this server.')
            return message.channel.send('Ozaibot does not have ban in this server.');
        }
        if (!args[0]) {
            console.log('Add a member arguement.')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Add a member arguement.\n\nProper useage is:\n\`tempban <@member|member_id> <time> [days_to_delete] [reason]\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        let member = await GetMember(message, client, args[0], Discord, true, true);
        if (member === 'cancelled') return
        if (!member) {
            console.log('invalid member')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid member.\n\nProper useage is:\n\`tempban <@member|member_id> <time> [days_to_delete] [reason]\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (member.id === message.author.id) {
            console.log('attempted self ban, canceling')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`You cannot ban yourself.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (member.id == client.user.id) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Why do you want to ban me :(`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (message.guild.ownerId !== message.author.id) {
            if (message.author.id !== '508847949413875712') {
                if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                    console.log('attempted mute against someone of higher rank, canceling')
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot mute members with higher or the same permissions as your own.`)
                    return message.channel.send({ embeds: [errorembed] })
                }
            }
        }
        const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
        let muteduration = await GetPunishmentDuration(args[1])
        if (muteduration === Infinity) {
            console.log('attempted tempban with some bullshit time inputed')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid time.`)
            return message.channel.send({ embeds: [errorembed] });
        }
        let display = ''
        let timeunban = 9999999999;
        let reason = args.slice(2).join(" ");
        if (!muteduration) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Invalid time.\n\nProper useage is:\n\`temp-ban <@member|member_id> <time> [days_to_delete] [reason]\``)
            return message.channel.send({ embeds: [errorembed] });
        }
        timeunban = muteduration + currenttime
        display = GetDisplay(muteduration, true)
        let casenumber = client.currentcasenumber.get(message.guild.id) + 1
        const returnembed = new Discord.MessageEmbed()
            .setTitle(`Case #${casenumber}`)
            .setDescription(`<:check:988867881200652348> ${member} has been **banned**${display}.`)
            .setColor("GREEN")
        message.channel.send({ embeds: [returnembed] })
        let query = "INSERT INTO activebans (userid, adminid, serverid, timeunban, casenumber, length, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let data = [member.id, message.author.id, message.guild.id, timeunban, casenumber, muteduration, 'ban']
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                message.channel.send('Creating unban time in database failed. User is still banned but will not be automatically unmuted.')
                return console.log(error)
            }
            return
        })
        console.log(`user has been banned${display}.`)
        if (!isNaN(args[2]) && args[2].length == 1) {
            let days = Number(args[2]);
            if (days > 7) return message.channel.send('The days of messages to be deleted cannot be more than 7.');
            if (days < 1) return message.channel.send('You cannot delete 0 days of messages.');
            reason = args.slice(3).join(" ");
            let banreason = reason
            if (banreason.length > 400) {
                banreason = banreason.slice(0, -300)
                banreason = banreason + `... \n- ${message.author.tag} (${message.author.id}) \n(ban reason to long to fully add, please check the reason in bot with \`case ${casenumber}\`)`
            } else {
                banreason = banreason + ` - ${message.author.tag} (${message.author.id})`
            }
            await NotifyUser(8, message, `You have been banned from ${message.guild}`, member, reason, muteduration, client, Discord)
            await message.guild.members.ban(member, { days: days, reason: `${banreason}`, }).catch(err => {
                console.log(err)
                message.channel.send('Failed to ban.')
                return
            })
            return LogPunishment(message, client, member.id, 8, muteduration, reason, Discord)
        }
        let banreason = reason
        if (banreason.length > 400) {
            banreason = banreason.slice(0, -300)
            banreason = banreason + `... \n- ${message.author.tag} (${message.author.id}) \n(ban reason to long to fully add, please check the reason in bot with \`case ${casenumber}\`)`
        } else {
            banreason = banreason + `\n - ${message.author.tag} (${message.author.id})`
        }
        await NotifyUser(1, message, `You have been banned from ${message.guild}`, member, reason, muteduration, client, Discord)
        await message.guild.members.ban(member, { reason: `${banreason}` }).catch(err => {
            console.log(err)
            message.channel.send('Failed to ban.')
            return
        })
        LogPunishment(message, client, member.id, 8, muteduration, reason, Discord)
    }
}