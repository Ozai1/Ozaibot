const { getPackedSettings } = require('http2');
const mysql = require('mysql2');
const { GetDisplay, GetPunishmentDuration } = require('../moderationinc')
const util = require('minecraft-server-util')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const serversdb = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibotservers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        //if (!userstatus == 1) return
        const embed77 = new Discord.MessageEmbed()
            .setTitle('MC Server Status')
            .setColor('BLUE')
            .setDescription(`${args.slice(0).join(" ")}`)
            .setFooter(`Server IP: 112.213.34.137`)
        const statuschannel = client.channels.cache.get('984030657078513714')
        const messagetoedit = await statuschannel.messages.fetch('984043956008550430')
        messagetoedit.edit({ embeds: [embed77] })

    }
}