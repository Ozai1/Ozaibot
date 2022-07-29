const mysql = require('mysql2');

require('dotenv').config();
const { GetMember, GetFlagName, NameToFlag } = require("../moderationinc")
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
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You do not have access to this command.')
        if (!args[1]) return message.channel.send('Invalid usage.')
        const member = await GetMember(message, client, args[1], Discord, true, true)
        if (!member) return message.channel.send('Invalid member.')
        if (args[0].toLowercase() === 'list') {
            list_perms(message,client,args,Discord, member)
        } else if (args[0].toLowercase() === 'allow') {

        } else if (args[0].toLowercase() === 'deny') {

        } else {
            return message.channel.send('Invalid usage.')
        }
    }
}

async function list_perms(message, client, args, Discord, member) {
    let posroleperms = client.positiverolepermissions.get(message.guild.id)
    let posuserperms = client.positiveuserpermissions.get(message.guild.id)
    let negroleperms = client.positiverolepermissions.get(message.guild.id)
    let neguserperms = client.positiveuserpermissions.get(message.guild.id)
    let positiveperms = []
    if (member.roles) {
        member.roles.cache.forEach(role => {
            let theperms = posroleperms.get(role.id).split("")
            theperms.forEach(perm => {
                if (!positiveperms.includes(perm)) positiveperms.push(perm)
            })
        })
    }
}