const mysql = require('mysql2');
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

const { GetMember } = require("../moderationinc")
module.exports = {
    name: 'slap',
    aliases: [],
    description: 'ok',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (cmd === 'slap') {
            if (!args[0]) return message.channel.send('[SM] Usage: sm_slap <player|#playerid> <amount>')
            const member = await GetMember(message, args[0], Discord, false)
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