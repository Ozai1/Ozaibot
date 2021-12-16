const mysql = require('mysql2');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const serversdb = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ozaibotservers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = (Discord, client) => {
    console.log('shits online')
    let rating = Math.floor(Math.random() * 2) + 1;
    if (rating == 1) {
        client.user.setPresence({ status: 'dnd' });
        console.log('Set status to DND')
    } else console.log('Set status to Online')
    let query = "SET GLOBAL max_connections = 512";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error)
        console.log('Set connection limit to 512 in database so no err')
    })
    data = []
    client.guilds.cache.forEach(async (guild) => {
        query = `CREATE TABLE IF NOT EXISTS ${guild.id}config(id INT(12) AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255) COLLATE utf8mb4_unicode_ci, details VARCHAR(255) COLLATE utf8mb4_unicode_ci, details2 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details3 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details4 VARCHAR(255) COLLATE utf8mb4_unicode_ci, details5 VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
        serversdb.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
        })
        query = `CREATE TABLE IF NOT EXISTS ${guild.id}punishments(id INT(12) AUTO_INCREMENT PRIMARY KEY, userid VARCHAR(32), serverid VARCHAR(32), adminid VARCHAR(32), timeexecuted VARCHAR(32), timeunban VARCHAR(32), reason VARCHAR(255) COLLATE utf8mb4_unicode_ci);`;
        serversdb.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
        })
    })
    console.log('Created tables for new servers')
    console.log(`Signed into ${client.user.tag}`)
}
async function unmute() {

}