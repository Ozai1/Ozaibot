module.exports = {
    name: 'administration',
    async execute(client, Discord) {
       let object = Object()
    object.displayButtonsWhenNonEphemeral = true
    object.title = 'Administration'
    object.description = `The administration module contains all of the server configuration, auto-moderation configuration and permission configuration.\n\n**Commands:**\n\`setWelcomeChannel\`\n\`setWelcomeMessage\`\n\`setFarewellMessage\`\n\`Mod-logs\`\n\`Permissions\`\n\`Prefix\`\n\`SetLinkSpamAction\`\n\`SetMassLinkSpamAction\`\n\`TogglePunishmentNotifications\`\nAnd lots more.\n\nSome more powerful yet abusable functions and modules are locked behind me manually allowing users/guilds to use them. These include but are not limited to: Server-Whitelist, Anti-Raid & server-wide purge. If you are interested in these, please contact me through the Ozaibot Discord server [here](https://discord.gg/xxRMvmtJpX 'Join server!')).`
    const button = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('SetWelcomeChannel')
                .setStyle('PRIMARY')
                .setCustomId('HELP_SETWELCOMECHANNEL')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('SetWelcomeMessage')
                .setStyle("PRIMARY")
                .setCustomId('HELP_SETWELCOMEMESSAGE')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('SetFarewellMessage')
                .setStyle("PRIMARY")
                .setCustomId('HELP_SETFAREWELLMESSAGE')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Mod-logs')
                .setStyle("PRIMARY")
                .setCustomId('HELP_MODLOGS')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Permissions')
                .setStyle("PRIMARY")
                .setCustomId('HELP_PERMS')
        )
    const button2 = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('Prefix')
                .setStyle("PRIMARY")
                .setCustomId('HELP_PREFIX')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('SetLinkSpamAction')
                .setStyle("PRIMARY")
                .setCustomId('HELP_SETLINKSPAMACTION')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('SetMassLinkSpamAction')
                .setStyle("PRIMARY")
                .setCustomId('HELP_SETMASSLINKSPAMACTION')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('TogglePunishmentNotifications')
                .setStyle("PRIMARY")
                .setCustomId('HELP_TOGGLEPUNISHMENTNOTIFICATIONS')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Back to Modules')
                .setStyle("PRIMARY")
                .setCustomId('HELP_MODULES')
        )
     object.buttons = [button, button2];
    client.help.set('administration', object).set('admin', object)
    }
}