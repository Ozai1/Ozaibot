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
    if (member.id == '753454519937007696' || member.id == '949162832396693514') {
        client.users.cache.get('508847949413875712').send(`${member.user.tag} has left ${member.guild}`);
  }
}