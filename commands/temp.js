const { getPackedSettings } = require('http2');
const mysql = require('mysql2');

const { GetDisplay, GetPunishmentDuration } = require('../moderationinc')
const util = require('minecraft-server-util')
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
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            const returnembed = new Discord.MessageEmbed()
            .setTitle('Case #22')
                .setDescription(`<:check:988867881200652348> <@508847949413875712> has been **muted**.`)
                //.setFooter({text: `Case #22`})
                .setColor("GREEN")
            message.channel.send({ embeds: [returnembed] })
        }
    }
}