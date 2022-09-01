module.exports = {
    name: 'unban',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Un-ban'
        object.description = `The Un-ban command lifts a ban on a user, allowing them to join a server once again.
        If a user is banned, they must be Un-banned to rejoin.
        
        **Usage:**
        \`Un-Ban <@user|user_id> <reason>\`
        
        **Examples:**
        \`Un-ban 862247858740789269\`
        \`Un-Ban Ozaibot#3594\`
        
        **Permissions:**
        Ban Members.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('<- Ban')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_BAN')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Mute ->')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MUTE')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to moderation')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODERATION')
            )
        object.buttons = [button];
        client.help.set('un-ban', object).set('unban', object)
    }
}