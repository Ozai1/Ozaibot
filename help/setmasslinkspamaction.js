module.exports = {
    name: 'setmasslinkspamaction',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Administration - SetMassLinkSpamAction'
        object.description = `Mass link spam is when a user spams links in multiple channels in quick succession.
        Users who mass link spam are usually either breaking the rules or a compromised account, the later being what this function was built to catch.
        This works very well for catching users mass-advertising or spamming scams when their account has be taken by an attacker.
        
        More specifically, the bot checks when messages with links are sent and what channel they are in. 
        If the bot detects that more than 5 links have been sent, all in different channels and all within 5 seconds of each other the user will flag for mass link spam and the user will have the action selected applied to them.

        If your server is having issues with people's accounts spamming links for scams or mass advertisement, I highly recommend you turn this on if the rules of your server dont conflict as it is highly effective at mitigating the issues these attacks pose.

        **Usage:**
        \`setlinkspamaction <mute|kick|ban|soft-ban>\`

        **Examples**
        \`setmasslinkspamaction mute\`
        \`SetMassLinkSpamAction soft-ban\`

        **Permissions:**
        Administrator.
        `
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('<- SetLinkSpamAction')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_SETLINKSPAMACTION')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('TogglePunishmentNotifications ->')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_TOGGLEPUNISHMENTNOTIFICATIONS')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to moderation')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_MODERATION')
            )
        object.buttons = [button];
        client.help.set('setmasslinkspamaction', object)
    }
}