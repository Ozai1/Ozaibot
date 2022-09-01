module.exports = {
    name: 'ui',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'Welcome to Ozaibot'
        object.description = `documentation & actions can be accessed from this panel for ease of use.\n\nThis method of navigation will most likely take a lot longer to reach the desired information/action than using the command associated with said action, so it is recommended to use commands where possible. This is for an entry to bot use.\n\nSilent mode is where the bot will send silent messages to you and to only, in this channel meaning that other people can't see what you are seeing, making life better for all.\nSilent mode also removes the limitation of not being able to press buttons as soon as they are sent (basically you can't spam them). This is an issue with discord and something that I cannot help.\n\nGood luck, have fun!`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Modules')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODULES')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Tips, tricks and good to knows')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MISC')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Enter silent mode')
                    .setStyle("PRIMARY")
                    .setCustomId('SILENTMODE')
            )
        object.buttons = [button];
        return client.help.set('ui', object)
    }
}