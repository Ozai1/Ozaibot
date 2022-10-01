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
    query = `SELECT MAX(casenumber) FROM serverpunishments WHERE serverid = ?`;
    data = [guild.id];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            console.error(error)
            client.currentcasenumber.set(guild.id, 0)
            return
        }
        let casenumber = undefined
        if (!results == ``) {
            for (row of results) {
                casenumber = row["MAX(casenumber)"]
            }
        }
        if (casenumber == undefined || casenumber === null) {
            casenumber = 0
        }
        client.currentcasenumber.set(guild.id, casenumber)
    })
    console.log(`**Ozaibot has been added to a new server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n\n`)
    const commandembed = new Discord.MessageEmbed()
        .setDescription(`Ozaibot has been added to a new server. \nServer = ${guild.name}\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n Members: ${totalmembers}`)
        .setTimestamp()
    alllogs.send({ content: '<@508847949413875712>', embeds: [commandembed] })

    query = `SELECT * FROM serverconfigs WHERE serverid = ? && type = ?`;
    data = [guild.id, 'guildblacklisted'];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            console.error(error)
            return
        }
        if (!results == ``) {
            for (row of results) {
                guild.leave().catch(err => { console.log(err) })
                console.log('Left The above guild due to the guild being blacklisted')
                alllogs.send('Left The above guild due to the guild being blacklisted')
            }
        }
    })
}