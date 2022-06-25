const mysql = require('mysql2');

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

module.exports = {
      name: 'listguilds',
      description: 'shows all the servers that the bot is in',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  let channels2 = [];
                  await client.guilds.cache.forEach(async (guild, id) => {
                        const guildowner = await guild.fetchOwner()
                        channels2.push(`**${guild.name}**(${guild.id}) ${guildowner.user.tag} (${guildowner.id})`)
                  })
                  let printmessage = channels2.toString()
                  printmessage = printmessage.replace(/,/g, '\n')
                  const commandembed = new Discord.MessageEmbed()
                        .setColor('BLUE')
                        .setDescription(`**Bots Current Guilds:**\n${printmessage}`)
                  message.channel.send({ embeds: [commandembed] }).catch(err => { console.log(err) })
            }
      }
}