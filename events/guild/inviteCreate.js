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
module.exports = async (Discord, client, invite) => {
    let query = `INSERT INTO activeinvites (serverid, inviterid, invitecode, uses) VALUES (?, ?, ?, ?)`;
    let data = [invite.guild.id, invite.inviter.id, invite.code, invite.uses];
    connection.query(query, data, function (error, results, fields) {
          if (error) return console.log(error);
    })
    console.log(`Invite ${invite.code} pushed to db for guild ${invite.guild} (${invite.guild.id})`)
    let newinvites = await invite.guild.invites.fetch()
    client.invites.set(invite.guild.id, newinvites)
}