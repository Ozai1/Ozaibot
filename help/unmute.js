module.exports = {
    name: 'unmute',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Un-mute'
        object.description = `Re-allows a user to speak in text channels again\nWill not need to be used if the user is muted for a time duration, if they were they will be automatically un-muted when the time duration has come to an end.\n\n**Usage:**\n\`Un-mute <@user|user_id> <reason>\`\n\n**Examples:**\n\`Un-mute Ozaibot\`\n\`unmute 862247858740789269\``
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Mute`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MUTE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Kick ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_KICK`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('unmute', object).set('un-mute', object)
    }
}