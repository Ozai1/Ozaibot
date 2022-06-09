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
    name: 'channelname',
    description: 'renames a channel or smth',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            let name = args.slice(0).join(" ");
            if (!name) return message.channel.send('You must give a name.');
            if (name.length > 100) return message.channel.send('That name is to long.')
            message.channel.setName(name).catch(err => {
            })
            return
        }
    }
}