const mysql = require('mysql2');
const { GetDisplay, GetPunishName } = require('../moderationinc')
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
    name: 'setwelcomechannel',
    aliases: ['setwelcomemessage', 'setfarewellmessage'],
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (cmd === 'setwelcomemessage') return setwelcomemessage(message, client, Discord, args)
        if (cmd === 'setfarewellmessage') return setfarewellmessage(message, client, Discord, args)
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`You do not have access to this command.`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (args[0].toLowerCase() === 'null') {
            let query = `UPDATE serverconfigs SET details = ? WHERE type = ? && serverid = ?`;
            let data = ['', 'welcomechannel', message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error)
                    return console.log(error);
                message.channel.send('Removed welcome channel');
            });
            client.welcomechannels.delete(message.guild.id)
        }
        let channel = message.guild.channels.cache.get(args[0].slice(2, -1)) || message.guild.channels.cache.get(args[0]);
        if (!channel)
            return message.channel.send('Invalid channel.');
        let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
        let data = ['welcomechannel', message.guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error)
                return console.log(error);
            if (results == `` || results === undefined) {
                let query = `INSERT INTO serverconfigs (type, details, serverid) VALUES (?, ?, ?)`;
                let data = ['welcomechannel', channel.id, message.guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error)
                        return console.log(error);
                    message.channel.send('Set welcome channel. Make sure to set something for the bot to say when someone joins with `setwelcomemessage`');
                });
                client.welcomechannels.set(message.guild.id, channel.id)
            } else {
                let query = `UPDATE serverconfigs SET details = ? WHERE type = ? && serverid = ?`;
                let data = [channel.id, 'welcomechannel', message.guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error)
                        return console.log(error);
                    message.channel.send('Set welcome channel. Make sure to set something for the bot to say when someone joins with `setwelcomemessage`');
                });
                client.welcomechannels.set(message.guild.id, channel.id)
            }
        });
    }
}

async function setwelcomemessage(message, client, Discord, args) {
    if (!message.member.permissions.has("MANAGE_GUILD")) {
        const errorembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setColor(15684432)
            .setDescription(`You do not have access to this command.`)
        return message.channel.send({ embeds: [errorembed] })
    }
    if (!args[0]) {
        const errorembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setColor("BLUE")
            .setDescription(`Use this command to set what the bot says when a user joins.\n\nUse \`[user]\`, \`[user.name]\` and \`[user.tag]\` in the positions that you want the user who joined to be mentioned.\n\n\`[user]\`:\n${message.author}\n\`[user.name]\`:\n**${message.author.username}**\n\`[user.tag]\`:\n**${message.author.tag}**\n\n**Example:**\n\`setwelcomemessage Welcome [user]! We home that you enjoy your time here!\``)
        return message.channel.send({ embeds: [errorembed] })
    }
    if (args[0].toLowerCase() === 'null') {
        let query = `UPDATE serverconfigs SET details2 = ? WHERE type = ? && serverid = ?`;
        let data = ['', 'welcomechannel', message.guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error)
                return console.log(error);
            message.channel.send('Removed welcome message');
        });
        client.welcomechannelstext.delete(message.guild.id)
    }
    let welcomemessage = args.slice(0).join(" ");
    let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
    let data = ['welcomechannel', message.guild.id];
    connection.query(query, data, function (error, results, fields) {
        if (error)
            return console.log(error);
        if (results == `` || results === undefined) {
            client.welcomechannelstext.set(message.guild.id, welcomemessage)
            let query = `INSERT INTO serverconfigs (type, details2, serverid) VALUES (?, ?, ?)`;
            let data = ['welcomechannel', welcomemessage, message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error)
                    return console.log(error);
                welcomemessage = welcomemessage.replace(/\[user]/g, `${message.author}`)
                welcomemessage = welcomemessage.replace(/\[user.username]/g, `${message.author.username}`)
                welcomemessage = welcomemessage.replace(/\[user.tag]/g, `${message.author.tag}`)
                const errorembed = new Discord.MessageEmbed()
                    .setTitle('Welcome message set')
                    .setColor('BLUE')
                    .setDescription(`${welcomemessage}`)
                    .setFooter({ text: 'Your welcome message will look like this.' })
                return message.channel.send({ embeds: [errorembed] })
            });
        } else {
            client.welcomechannelstext.set(message.guild.id, welcomemessage)
            let query = `UPDATE serverconfigs SET details2 = ? WHERE type = ? && serverid = ?`;
            let data = [welcomemessage, 'welcomechannel', message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error)
                    return console.log(error);
                welcomemessage = welcomemessage.replace(/\[user]/g, `${message.author}`)
                welcomemessage = welcomemessage.replace(/\[user.username]/g, `${message.author.username}`)
                welcomemessage = welcomemessage.replace(/\[user.tag]/g, `${message.author.tag}`)
                const errorembed = new Discord.MessageEmbed()
                    .setTitle('Welcome message set')
                    .setColor("BLUE")
                    .setDescription(`${welcomemessage}`)
                    .setFooter({ text: 'Your welcome message will look like this.' })
                return message.channel.send({ embeds: [errorembed] })
            });
        }
    });
}
async function setfarewellmessage(message, client, Discord, args) {
    if (!message.member.permissions.has("MANAGE_GUILD")) {
        const errorembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setColor(15684432)
            .setDescription(`You do not have access to this command.`)
        return message.channel.send({ embeds: [errorembed] })
    }
    if (!args[0]) {
        const errorembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setColor("BLUE")
            .setDescription(`Use this command to set what the bot says when a user leaves.\n\nUse \`[user]\`, \`[user.name]\` and \`[user.tag]\` in the positions that you want the user who joined to be mentioned.\n\n\`[user]\`:\n${message.author}\n\`[user.name]\`:\n**${message.author.username}**\n\`[user.tag]\`:\n**${message.author.tag}**\n\n**Example:**\n\`setfarewellmessage Goodbye [user]. We are sad to see you go!\``)
        return message.channel.send({ embeds: [errorembed] })
    }
    if (args[0].toLowerCase() === 'null') {
        let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
        let data = ['', 'welcomechannel', message.guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error)
                return console.log(error);
            message.channel.send('Removed farewell message');
        });
        client.welcomechannelstext2.delete(message.guild.id)
    }
    let welcomemessage = args.slice(0).join(" ");
    let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
    let data = ['welcomechannel', message.guild.id];
    connection.query(query, data, function (error, results, fields) {
        if (error)
            return console.log(error);
        if (results == `` || results === undefined) {
            client.welcomechannelstext2.set(message.guild.id, welcomemessage)
            let query = `INSERT INTO serverconfigs (type, details3, serverid) VALUES (?, ?, ?)`;
            let data = ['welcomechannel', welcomemessage, message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error)
                    return console.log(error);
                welcomemessage = welcomemessage.replace(/\[user]/g, `${message.author}`)
                welcomemessage = welcomemessage.replace(/\[user.username]/g, `${message.author.username}`)
                welcomemessage = welcomemessage.replace(/\[user.tag]/g, `${message.author.tag}`)
                const errorembed = new Discord.MessageEmbed()
                    .setTitle('Farewell message set')
                    .setColor('BLUE')
                    .setDescription(`${welcomemessage}`)
                    .setFooter({ text: 'Your farewell message will look like this.' })
                return message.channel.send({ embeds: [errorembed] })
            });
        } else {
            client.welcomechannelstext2.set(message.guild.id, welcomemessage)
            let query = `UPDATE serverconfigs SET details3 = ? WHERE type = ? && serverid = ?`;
            let data = [welcomemessage, 'welcomechannel', message.guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error)
                    return console.log(error);
                welcomemessage = welcomemessage.replace(/\[user]/g, `${message.author}`)
                welcomemessage = welcomemessage.replace(/\[user.username]/g, `${message.author.username}`)
                welcomemessage = welcomemessage.replace(/\[user.tag]/g, `${message.author.tag}`)
                const errorembed = new Discord.MessageEmbed()
                    .setTitle('Farewell message set')
                    .setColor("BLUE")
                    .setDescription(`${welcomemessage}`)
                    .setFooter({ text: 'Your farewell message will look like this.' })
                return message.channel.send({ embeds: [errorembed] })
            });
        }
    });
}