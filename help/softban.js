module.exports = {
    name: 'softban',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Soft-ban'
        object.description = `Effectively a fancy kick.\nRemoves a user from a server, they must be invited to rejoin.\nWhere the functionality of soft-banning comes is how it can bulk delete a users messages.\nBans and un-bans immediately, that is how it deletes messages.\nMaximum of 7 days may be deleted.\n\nDefaults to 1 day of messages to delete but can be changed as needed.\n\n**Usage:**\n\`soft-ban <@user|user_id> [days_to_delete] [reason]\`\n\n**Examples:**\n\`soft-ban @ozaibot did a bad\`\n\`soft-ban 862247858740789269 5 did a big bad\`\n\n**Aliases:**\n\`sb\`\n\n**Permissions:**\nKick Members.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Kick`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_KICK`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Warn ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_WARN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('soft-ban', object).set('softban', object).set('sb', object)
    }
}