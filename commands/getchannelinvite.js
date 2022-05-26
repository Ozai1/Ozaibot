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
const NoWaitConnection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibot',
    waitForConnections: false,
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
const NoWaitServersDB = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibotservers',
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    name: 'getchannelinvite',
    description: 'gets an invite on a channel id',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (!message.guild.me.permissions.has('CREATE_INSTANT_INVITE')) return message.channel.send('cannot create invite for this server due to low perms');
            let invchannel = client.channels.cache.get(args[0])
            if (!invchannel) return message.channel.send('Invalid channel id')
            let invite = await invchannel.createInvite({ maxAge: 0, maxUses: 0 }).catch(err => {
                console.log(err)
                message.channel.send('Failed.')
            })
            message.channel.send(`${invite}`)
        }
    }
}