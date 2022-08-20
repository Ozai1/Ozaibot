module.exports = {
    name: 'moderation',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'Moderation'
        object.description = `The moderation module contains a suite of commands used for keeping a server safe, under control and orderly.\nThese commands are mostly aimed at moderators and as such some moderation commands (More specifically the Auto-moderation functions) are under the \`administration\` module.\n\n**Commands:**\n\`Ban\`\n\`Un-ban\`\n\`Mute\`\n\`Un-mute\`\n\`Kick\`\n\`Soft-ban\`\n\`Warn\`\n\`Search\`\n\`View-case\``
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Ban')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_BAN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Un-ban')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UNBAN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Mute')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MUTE')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Un-mute')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_UNMUTE')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Kick')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_KICK')
            )
        const button2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Soft-ban')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_SOFTBAN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Warn')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_WARN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Search')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_SEARCH')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('View-case')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_CASE')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Purge')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_PURGE')
            )
        const button3 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to Modules')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODULES')
            )
        object.buttons = [button, button2, button3];
        return client.help.set('moderation', object).set('mod', object)
    }
}