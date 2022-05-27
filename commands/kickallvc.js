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
    name: 'kickallvc',
    description: 'kicks all members of a voice call',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            setTimeout(() => {
                message.member.voice.channel.members.forEach(async (member, id) => {
                    member.voice.kick().catch(err => { console.log(err) })
                })
            }, 2700);
        }
    }
}