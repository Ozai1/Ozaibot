//opens up to the help menu, can either edit the same message over and over or send ephemeral ones over and over
module.exports = {
    name: 'userinterface',
    aliases: ['user-interface', 'ui'],
    description: 'Opens the user interface panel',
    async execute(message, client, cmd, args, Discord, userstatus) {
        let embedinfo = undefined
        embedinfo = client.help.get('ui')
        if (!embedinfo || !embedinfo.description) return message.channel.send({ content: `Sorry, the bot has been restarted very recently and the help system has not started up yet, please try again shortly (by the time you have finished reading this its probably ready).` })
        const helpembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setTitle(embedinfo.title)
            .setDescription(embedinfo.description)
            .setColor('BLUE')
            .setFooter({ text: `requested by ${message.author.tag}` })

        let helpmessage = await message.channel.send({ embeds: [helpembed], components: embedinfo.buttons })
        client.helpmessageownership.set(helpmessage.id, message.author.id)
        setTimeout(() => {
            client.helpmessageownership.delete(helpmessage.id)
        }, 600000);
    }
}