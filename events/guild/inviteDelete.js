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
module.exports = async (Discord, client, invite) => {
    setTimeout(() => {
        let query = `DELETE FROM activeinvites WHERE invitecode = ?`;
        let data = [invite.code];
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error);
        })
        console.log(`Invite ${invite.code} deleted from db for guild ${invite.guild} (${invite.guild.id})`)
    }, 5000);
    let newinvites = await invite.guild.invites.fetch()
    client.invites.set(invite.guild.id, newinvites)
}