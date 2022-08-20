module.exports = {
    name: 'search',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - View-case'
        object.description = `Allows more information to be gathered from a single case.\nEach command/offence will have a case attatched to it so that it can be tracked.\n\n**Usage:**\n\`view-case [case_number]\`\n\n**Examples:**\n\`view-case 69\`\n\`viewcase 49\`\n\`case 24837\`\n\n**Alises:**\n\`case\`\n\n**Permissions:**\nManage Messages.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Search`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_SEARCH`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Purge ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_PURGE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('view-case', object).set('case', object).set('viewcase', object)
    }
}