const mysql = require('mysql2');
const { measureMemory } = require('vm');
const { GetDisplay, GetPunishName, GetPunishColour } = require('../moderationinc')
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
    name: 'modlogs',
    aliases: ['modlog'],
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`You do not have access to this command.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (!args[0]) {
            let logschannel = client.modlogs.get(message.guild.id)
            if (!logschannel) {
                const errorembed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`Modlogs channel is currently not set.\nSet a ModLogs channel with:\n\`modlogs <#channel>\``)
                return message.channel.send({ embeds: [errorembed] })
            } else {
                logschannel = message.guild.channels.cache.get(logschannel)
                if (!logschannel) {
                    const errorembed = new Discord.MessageEmbed()
                        .setColor('BLUE')
                        .setDescription(`ModLogs channel was set but the channel was deleted.\n\nPlease set a new modlogs channel with:\n\`modlogs <#channel>\``)
                    return message.channel.send({ embeds: [errorembed] })
                }
                const errorembed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`ModLogs channel is currently set to:\n<#${logschannel.id}>`)
                return message.channel.send({ embeds: [errorembed] })
            }
        }
        let channel = message.guild.channels.cache.get(args[0].slice(2, -1)) || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            return message.channel.send('Invalid channel.')
        }
        let logschannel = client.modlogs.get(message.guild.id)
        client.modlogs.set(message.guild.id, channel.id)
        if (logschannel) {
            let query = `UPDATE serverconfigs SET details = ? WHERE serverid = ? && type = ?`;
            let data = [channel.id, message.guild.id, 'modlog'];
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.');
                    return console.log(error);
                }
            });
        } else {
            let query = `INSERT INTO serverconfigs (serverid, type, details) VALUES (?, ?, ?)`;
            let data = [message.guild.id, 'modlog', channel.id];
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    message.channel.send('Error logging. The punishment will still be instated but will not show up in punishment searches.');
                    return console.log(error);
                }
            });
        }
        const errorembed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setDescription(`ModLogs channel has been set to:\n<#${channel.id}>`)
        return message.channel.send({ embeds: [errorembed] })
    }
}