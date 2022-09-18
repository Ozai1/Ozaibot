const mysql = require('mysql2');
const { GetMember } = require('../moderationinc')
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

module.exports = {
    name: 'channelban',
    description: 'removes a user from the channel',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!message.guild) return message.channel.send('This command must be used in a server.')
        if (message.member.permissions.has('ADMINISTRATOR') || userstatus == 1) {
            if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
            let pinguser = await GetMember(message, client, args[0], Discord, true, true)

            if (!pinguser) return message.reply('Invalid user.')
            if (message.channel.permissionsFor(pinguser).has('VIEW_CHANNEL')) {
                await message.channel.permissionOverwrites.edit(pinguser, { VIEW_CHANNEL: false }).catch(err => {
                    message.channel.send('failed')
                    console.log(err)
                })
                message.channel.send(`${pinguser} has been banned from this channel.`)
            } else {
                message.channel.send('Selected user cannot see this this channel already!');
            }
        }
    }
}