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
    name: 'channelban',
    description: 'removes a user from the channel',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (message.member.permissions.has('ADMINISTRATOR') || userstatus == 1) {
            if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
            let pinguser = member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));

            if (!pinguser) return message.reply('Invalid user.')
            if (message.channel.permissionsFor(pinguser).has('VIEW_CHANNEL')) {
                await message.channel.updateOverwrite(pinguser, { VIEW_CHANNEL: false }).catch(err => {
                    console.log(err)
                    message.channel.send('Failed to remove from channel.')
                    return
                })
                message.channel.send(`${pinguser} has been banned from this channel.`)
            } else {
                message.channel.send('Selected user cannot see this this channel already!');
            }
        }
    }
}