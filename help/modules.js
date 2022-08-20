module.exports = {
    name: 'modules',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'Modules'
        object.description = `A module is a set of commands &/or functions.\nEach module is capable of being turned on and off through the \`perms\` command.\n\n**Modules:**\n\`Moderation\`\n\`Administration\`\n\`Fun\`\n\`Utility\`\n\`General\``
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Moderation')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODERATION')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Administration')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_ADMINISTRATION')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Fun')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_FUN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Utility')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UTILITY')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to user interface')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UI')
            )
        object.buttons = [button];
        return client.help.set('modules', object).set('module', object)
    }
}