module.exports = {
    name: 'tips',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'MISC - Tips, tricks & good to knows'
        object.description = `Ozaibot has a lot of features, like a lot a lot of features. More than are even shown in the help command(s) but worry not, We will find you a lot to do with this bot!\n\nHere are some random things that will help you along the way with the more finite details of the bot.\n\n\n\`Targeting\` - How the bot finds which user you mean.\n\`Durations\` - How the bot handles how long things happen for.\n\nIf you have something that you would wish for the bot to do, or perhaps not do, feel free to contact me through our discord server and perhaps I can accomidate your request.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Targeting')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_TARGETING')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Durations')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_DURATIONS')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to user interface')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UI')
            )
        object.buttons = [button];
        return client.help.set('tips', object).set('misc', object)
    }
}