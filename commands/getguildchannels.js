module.exports = {
    name: 'getguildchannels',
    description: 'spits the channels of a server to chat',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            selectedguild = client.guilds.cache.get(args[0])
            let channels2 = [];
            if (!selectedguild) return message.reply("Invalid guild id!")
            selectedguild.channels.cache.forEach(async (channel, id) => {
                channels2.push(`**${channel.name}** ${channel.type} ${channel.id}`)
            })
            const commandembed = new Discord.MessageEmbed()
                .setDescription(channels2)
                .setTimestamp()
            message.channel.send(commandembed).catch(err => { console.log(err) })
        }
    }
}