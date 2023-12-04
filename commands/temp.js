const mysql = require('mysql2');

const { GetDisplay, GetPunishmentDuration, GetMemberOrChannel, GetMemberOrRole, GetMember, HasPerms } = require('../moderationinc')
const util = require('minecraft-server-util')
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
let map = new Map()
map.set('INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)', ['candy', 187133887682445312, 1])
module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        // let thingm = require('../guildMemberAddv2')

        // if (!args[0])return thingm(Discord,client,message.member)
        // let member =await GetMember(message,client,args[0],Discord,true,false)
        // if (!member || member === 'cancelled')return message.channel.send('bad member')
        // thingm(Discord,client,member)
        // let pattern = new RegExp('rude', 'g')
        // if (message.content.match(pattern))return message.channel.send('flag true')
        // message.channel.send('flag false')
        const returnembed = new Discord.MessageEmbed()
            .setTitle(`Toggle Soundboards Off`)
            .setColor("GREEN")

        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`Toggle SoundBoards Off`)
                    .setStyle("PRIMARY")
                    .setCustomId(`CUSTOM_TOGGLE_SOUNDBOARD`)
            )

        let message2 = await message.channel.messages.fetch('1102205364625219684')
        message2.edit({content: null, embeds: [returnembed], components: [button]})

    }
}

        // let query = ''
        // let data = []
        // map.forEach((value, key) => {
        //     query = key
        //     data = value
        //     connection.query(query, data, function (error, results, fields) {
        //         if (error) {
        //             return console.error(error)
        //         }
        //     });
        // })



// const startfunnies = client.channels.cache.get('1024264288849907812')
        // const funniesmessages = await startfunnies.messages.fetch(100)
        // let arraything = []
        // funniesmessages.forEach(message2 => {
        //     arraything.push(message2)
        // })
        // var randommessage = arraything[Math.floor(Math.random() * arraything.length)];
        // if (randommessage.attachments) {
        //     let attachments = []
        //     randommessage.attachments.forEach(attatchment => {
        //         attachments.push(attatchment)
        //     })
        //     if (randommessage.content) {
        //         message.channel.send({ content: `${randommessage.content}`, files: attachments })
        //     }
        //     else {
        //         message.channel.send({ files: attachments })
        //     }
        // } else {
        //     message.channel.send(`${randommessage.content}`)
        // }