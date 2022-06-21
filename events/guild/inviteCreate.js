const mysql = require('mysql2')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: '8pSHlRPaaN6Gw3Kx',
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
}