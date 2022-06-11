const mysql = require('mysql2');
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
module.exports = async (Discord, client, guildDelete) => { 
    let guild = guildDelete
    const guildowner = await guild.fetchOwner()
    let alllogs = client.channels.cache.get('926353043144990740');
    let query = "DELETE FROM activeinvites WHERE serverid = ?";
   let data = [guild.id];
    connection.query(query, data, function (error, results, fields) {
          if (error) return console.log(error);
    });
    const commandembed = new Discord.MessageEmbed()
          .setDescription(`**Ozaibot has removed from a server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})`)
          .setTimestamp()
    alllogs.send({content: '<@508847949413875712>', embeds: [ commandembed] })
    console.log(`**Ozaibot has been removed from a server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guildowner.id}> (${guildowner.id})\n\n`)

}