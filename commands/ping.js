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
 
 
 
module.exports = {
    name: 'ping',
    aliases: [],
    description: 'ok',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '753454519937007696') {
            message.channel.send('youre hot').then(message => { message.edit('pee') })
            return
        } else if (userstatus == 1) {
            message.channel.send('pee')
            return
        } else {
            message.channel.send('poop')
        }
    }
}
