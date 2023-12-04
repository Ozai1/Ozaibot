const mysql = require('mysql2')
require('dotenv').config();
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = async (Discord, client, channel) => {
    if (!channel.guild) return
    let muteroleid = client.muteroles.get(channel.guild.id)
    if (!muteroleid) return
    const muterole = channel.guild.roles.cache.get(muteroleid)
    
    if (channel.permissionsFor(channel.guild.me).has('MANAGE_CHANNELS')) { //Shadowban Stuff for shh plz
        if (channel) {
            if (channel.permissionOverwrites) {
                await channel.permissionOverwrites.edit('1090446141260316752', { VIEW_CHANNEL: false}).catch(err => { console.log(err) })
            }
        }
    }
    if (!muterole) return
    if (channel.permissionsFor(channel.guild.me).has('MANAGE_CHANNELS')) {
        if (channel) {
            if (channel.permissionOverwrites) {
                await channel.permissionOverwrites.edit(muterole.id, { SEND_MESSAGES: false, ADD_REACTIONS: false, CONNECT: false, SEND_MESSAGES_IN_THREADS: false}).catch(err => { console.log(err) })
            }
        }
    }
}