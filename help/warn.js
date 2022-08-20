module.exports = {
    name: 'warn',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Warn'
        object.description = `Warning a user appends a mark to their account which can be used for keeping record of who has done what.\nUse the \`search\` command on a user to see all of their offences.\n\n**Usage:**\n\`warn <@user|user_id> [reason]\`\n\n**Examples:**\n\`warn @ozaibot\`\n\`warn 862247858740789269 spam\`\n\n**Alises:**\n\`w\`\n\n**Permissions:**\nManage Messages.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Soft-ban`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_SOFTBAN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Search ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_SEARCH`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('warn', object).set('w', object)
    }
}