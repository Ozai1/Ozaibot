module.exports = {
    name: 'utility',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'Utility'
        object.description = `Just commands that serve a purpose but arent really for mods or admins, some are permission locked, some arent`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('User-info')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_USERINFO')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Lock-VC')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_LOCKVC')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to Modules')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODULES')
            )
        object.buttons = [button];
        return client.help.set('moderation', object).set('mod', object)
    }
}