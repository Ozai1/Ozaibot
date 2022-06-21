const mysql = require('mysql2');
const { GetDatabasePassword } = require('../hotshit')
const { GetMember } = require("../moderationinc")
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

module.exports = {
    name: 'search',
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to use this command.')
        const member = await GetMember(message, args[0], Discord, true, true)
        if (!member) return message.channel.send('Invalid member.')
        let query = `SELECT * FROM serverpunishments WHERE userid = ? && serverid = ? && deleted = 0`;
        let data = [member.id, message.guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                message.channel.send('Error fetching user\'s punishments');
                return console.log(error);
            }
            let currentpage = 1
            for (row of results) {
                
            }
        });
    }
}