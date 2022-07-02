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
module.exports = async (Discord, client, member) => {
    const guild = member.guild;
    let welcomechannelid = client.welcomechannels.get(member.guild.id)
    let welcomechannel = guild.channels.cache.get(welcomechannelid)
    if (welcomechannel) {
        console.log('welcomechannel found.')
        let welcomemessage = client.welcomechannelstext2.get(guild.id)
        if (!welcomemessage) return
        welcomemessage = welcomemessage.replace(/\[user]/g, `${member}`)
        welcomemessage = welcomemessage.replace(/\[user.username]/g, `**${member.user.username}**`)
        welcomemessage = welcomemessage.replace(/\[user.tag]/g, `**${member.user.tag}**`)
        welcomechannel.send(`${welcomemessage}`).catch(err => {
            console.log('welcomemessage failed to send in guild ' + guild)
            console.log(err)
        })
    }
    console.log(`${member.user.tag} left ${guild}`);
    if (member.id == '753454519937007696' || member.id == '949162832396693514') {
        client.users.cache.get('508847949413875712').send(`${member.user.tag} has left ${member.guild}`);
    }
}