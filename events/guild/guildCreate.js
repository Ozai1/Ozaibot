const mysql = require('mysql2')
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
module.exports = async (Discord, client, guildCreate) => {
    let guild = guildCreate
    const guildowner = await guild.fetchOwner()
    let alllogs = client.channels.cache.get('986882591980396604');
    await guild.members.fetch()
    let totalmembers = 0;
    guild.members.cache.forEach(member => {
        totalmembers = totalmembers + 1;
    })
    if (guild.me.permissions.has('MANAGE_GUILD')) {
        const newinvites = await guild.invites.fetch();
        newinvites.forEach(async invite => {
            let query = `INSERT INTO activeinvites (serverid, inviterid, invitecode, uses) VALUES (?, ?, ?, ?)`;
            let data = [guild.id, invite.inviter.id, invite.code, invite.uses];
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error);
            })
        })
    }
    console.log(`**Ozaibot has been added to a new server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n\n`)
    const commandembed = new Discord.MessageEmbed()
        .setDescription(`Ozaibot has been added to a new server. \nServer = ${guild.name}\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n Members: ${totalmembers}`)
        .setTimestamp()
    alllogs.send({ content: '<@508847949413875712>', embeds: [commandembed] })
}