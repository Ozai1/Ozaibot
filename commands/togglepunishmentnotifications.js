const mysql = require('mysql2');
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
    name: 'togglepunishmentnotifications',
    description: 'Whether to send a user a message notifying them of an action against them.',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`You do not have access to this command.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
        let data = ['punishnotification', message.guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error)
                return console.log(error);
            if (results == `` || results === undefined) {
                client.punishnotification.push(message.guild.id)
                let query = `INSERT INTO serverconfigs (type, serverid) VALUES (?, ?)`;
                let data = ['punishnotification', message.guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error)
                        return console.log(error);
                    message.channel.send('Users will no longer receve a direct message when a punishing command is used against them.')
                });
            } else {
                for (let i = 0; i < client.punishnotification.length; i++) {
                    if (client.punishnotification[i] === message.guild.id) {
                        delete client.punishnotification[i]
                    }
                }
                let query = `DELETE FROM serverconfigs WHERE type = ? && serverid = ?`;
                let data = ['punishnotification', message.guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error)
                        return console.log(error);
                    message.channel.send('Users will again receve a direct message when a punishing command is used against them.')
                });
            }
        });
    }
}