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
    if (member.id == '753454519937007696' || member.id == '949162832396693514') {
        client.users.cache.get('508847949413875712').send(`${member.user.tag} has left ${member.guild}`);
  }
}