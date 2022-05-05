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
                        .setDescription(channels2)
                        .setTimestamp()
                  message.channel.send({embeds: [commandembed]}).catch(err => { console.log(err) })
            }
      }
}