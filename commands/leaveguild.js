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
    name: 'leaveguild',
    description: 'has the bot leave a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (!args[0]) return message.channel.send('Please give a guild id')
            let guild2 = client.guilds.cache.get(args[0]);
            if (!guild2) return message.reply('Ozaibot isnt in that server, or its an invalid id.')
            await message.react('☑️')
            guild2.leave().catch(err => { console.log(err) });
      }
    }
}