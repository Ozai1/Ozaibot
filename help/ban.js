module.exports = {
    name: 'ban',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Ban'
        object.description = `Removes a user from the server and prevents them from rejoining.\n\nHowever many days of the user's messages are specified will be deleted.\nMax of 7 days worth of messages can be deleted, defaults to 0 days.\n\n**Usage:**\n\`ban <@user|user_id> <days to delete> <reason>\`\n\n**Examples:**\n\`ban @user called me a no no name\`\n\`ban @user 1 unspeakable things\`\n\`ban 862247858740789269 off server ban so they cant join\`\n\n**Aliases:**\n\`b\`\n\n**Reversal Command:**\n\`unban\`\n\n**Permissions:**\nBan Members.\n`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`Un-ban ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_UNBAN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('ban', object).set('b', object)
    }
}