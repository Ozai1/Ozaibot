module.exports = {
    name: 'no_args_0',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'Welcome to Ozaibot'
        object.description = `Checkout our website for more information.\nAlternatively use \`help modules\` for a list of modules.\n\nHelp command usage:\n\`help [command_name|module_name]\``
        const button = new Discord.MessageActionRow()
            // .addComponents(
            //     new Discord.MessageButton()
            //         .setLabel('WebSite')
            //         .setStyle("LINK")
            //         .setURL('http://112.213.34.137')
            // ).addComponents(
            //     new Discord.MessageButton()
            //         .setLabel('Commands')
            //         .setStyle("LINK")
            //         .setURL('http://112.213.34.137')
            // ).addComponents(
            //     new Discord.MessageButton()
            //         .setLabel('Discord Server')
            //         .setStyle("LINK")
            //         .setURL('https://discord.gg/xxRMvmtJpX')
            // )
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Open user interface')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UI')
            )
        object.buttons = [button];
        return client.help.set('no_args_0', object)
    }
}