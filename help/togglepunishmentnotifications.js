module.exports = {
    name: 'togglepunishmentnotifications',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Administration - TogglePunishmentNotifications'
        object.description = `Stops users from receving a direct message when a punishing act is used on them.
        For example, if someone is muted, they will receve a direct message form the bot informing them that they have been muted.
        For some servers this will seem like an un-desireable quality so here is the option to turn it off.
        
        Punishment Notifications aee **Enabled** by default.
        
        **Usage:**
        This command is simply a toggle, just type it out and it will do the thing
        
        **Permissions:**
        Manage server.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('<- SetMassLinkSpamAction')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_SETMASSLINKSPAMACTION')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to moderation')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODERATION')
            )
        object.buttons = [button];
        client.help.set('togglepunishmentnotifications', object).set('togglepunishnotifications', object).set('togglepunishnotifs', object)
    }
}