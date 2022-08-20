module.exports = {
    name: 'search',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Search'
        object.description = `Shows all offences of a user.\nIf a user has more than one page of offences, they will have multiple pages.\n\n**Usage:**\n\`search <@user|user_id> [page]\`\n\nExamples:\n\`search ozaibot\`\n\`search @ozaibot 2\`\n\n**Permissions:**\nManage Messages.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Warn`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_WARN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`View-case ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_VIEWCASE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('search', object)
    }
}