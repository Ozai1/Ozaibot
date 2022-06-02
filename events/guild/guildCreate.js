const mysql = require('mysql2')
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
module.exports = async (Discord, client, guildCreate) => {
    let guild = guildCreate
    const guildowner = await guild.fetchOwner()
    let alllogs = client.channels.cache.get('926353043144990740');
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
    let data = []
    let query = `CREATE TABLE IF NOT EXISTS ${guild.id}config(id INT(12) AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255) COLLATE utf8mb4_unicode_ci, details VARCHAR(255) COLLATE utf8mb4_unicode_ci, details2 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details3 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details4 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details5 VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
    serversdb.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
    })
    query = `CREATE TABLE IF NOT EXISTS ${guild.id}punishments(id INT(12) AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(32), serverid VARCHAR(32), adminid VARCHAR(32), timeexecuted VARCHAR(32), timeunban VARCHAR(32), reason VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
    serversdb.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
    })
    const commandembed = new Discord.MessageEmbed()
        .setDescription(`Ozaibot has been added to a new server. \nServer = ${guild.name}\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n Members: ${totalmembers}`)
        .setTimestamp()
    alllogs.send({ content: '<@508847949413875712>', embeds: [commandembed] })
}