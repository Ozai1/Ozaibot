const mysql = require('mysql2');

const { GetDisplay, GetPunishmentDuration, GetMemberOrChannel, GetMemberOrRole, GetMember } = require('../moderationinc')
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

module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        let thingm = require('../guildMemberAddv2')
        
        if (!args[0])return thingm(Discord,client,message.member)
        let member =await GetMember(message,client,args[0],Discord,true,false)
        if (!member || member === 'cancelled')return message.channel.send('bad member')
        thingm(Discord,client,member)
    }
}

// const button1 = new Discord.MessageActionRow()
        // .addComponents(
        //     new Discord.MessageButton()
        //         .setLabel(`Hi`)
        //         .setStyle("PRIMARY")
        //         .setCustomId(`TEST77`)
        // )
        
        // message.channel.send({ content: 'hi', components: [button1] });