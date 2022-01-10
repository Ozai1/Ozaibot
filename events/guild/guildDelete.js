module.exports = (Discord, client, guildDelete) => { 
    let guild = guildDelete
    let alllogs = client.channels.cache.get('926353043144990740');
    const commandembed = new Discord.MessageEmbed()
          .setDescription(`**Ozaibot has removed from a server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guild.ownerID}> (${guild.ownerID})`)
          .setTimestamp()
    alllogs.send('<@508847949413875712>', { embed: commandembed })
    console.log(`**Ozaibot has been removed from a server.** \nServer = **${guild.name}**\nID = ${guild.id}\nGuildOwner = <@${guild.ownerID}> (${guild.ownerID})\n\n`)
}