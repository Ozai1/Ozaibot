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

const { GetMember } = require("../moderationinc")
module.exports = {
    name: 'slap',
    aliases: [],
    description: 'ok',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (cmd === 'slap') {
            if (!args[0]) return message.channel.send('[SM] Usage: sm_slap <player|#playerid> <amount>')
            const member = await GetMember(message, client,args[0], Discord, true, false)
            if (member === 'cancelled') return
            if (!member) return message.channel.send('[SM] No matching clients found')
            if (!args[1]) {
                return message.channel.send(`**[**OS**] ${message.member.user.username}** slapped **${member.user.username}** for **0** damage.`)
            }
            if (isNaN(args[1])) return message.channel.send('[SM] Invalid amount.')
            if (args[1] < 0) return message.channel.send('[SM] Invalid amount.')
            message.channel.send(`**[**OS**] ${message.member.user.username}** slapped **${member.user.username}** for **${args[1]}** damage.`)
        }
    }
}