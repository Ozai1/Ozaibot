const { getPackedSettings } = require('http2');
const mysql = require('mysql2');
const { GetDisplay, GetPunishmentDuration } = require('../moderationinc')
const util = require('minecraft-server-util')
const {GetDatabasePassword} = require('../hotshit')
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: GetDatabasePassword(),
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
        if (args[0] === 'update') {
            util.status('112.213.34.137').then(async (response) => {
                let onlineplayers = []
                if (!response.players.sample) {
                    onlineplayers[0] = 'No one :('
                } else {
                    response.players.sample.forEach(player => {
                        onlineplayers.push(`${player.name}`)
                    })
                }
                onlineplayers = onlineplayers.toString()
                onlineplayers = onlineplayers.replace(/,/g, '\n')
                const embed77 = new Discord.MessageEmbed()
                    .setTitle('MC Server Status')
                    .setColor('BLUE')
                    .setDescription(`**Currently ${response.players.online} players online:**\n${onlineplayers}`)
                    .setFooter(`Server IP: 112.213.34.137; Embed refreshes ever 2 mins.`)
                const statuschannel = client.channels.cache.get('984030657078513714')
                const messagetoedit = await statuschannel.messages.fetch('984043956008550430')
                messagetoedit.edit({ embeds: [embed77] })
            }).catch(async err => {
                const embed77 = new Discord.MessageEmbed()
                    .setTitle('MC Server Status')
                    .setColor('BLUE')
                    .setDescription(`Server down.`)
                    .setFooter(`Server IP: 112.213.34.137; Embed refreshes ever 2 mins.`)
                const statuschannel = client.channels.cache.get('984030657078513714')
                const messagetoedit = await statuschannel.messages.fetch('984043956008550430')
                messagetoedit.edit({ embeds: [embed77] })
                console.log(err)
            })
            return
        }
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