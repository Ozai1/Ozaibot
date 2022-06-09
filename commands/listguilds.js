const mysql = require('mysql2');
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

module.exports = {
      name: 'listguilds',
      description: 'shows all the servers that the bot is in',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  let channels2 = [];
                  client.guilds.cache.forEach(async (guild, id) => {
                        channels2.push(`**${guild.name}**(${guild.id}) ${guild.ownerID}\n`)
                  })
                  const commandembed = new Discord.MessageEmbed()
                        .setDescription(`${channels2}`)
                        .setTimestamp()
                  message.channel.send({embeds: [commandembed]}).catch(err => { console.log(err) })
            }
      }
}