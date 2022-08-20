module.exports = {
    name: 'kick',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Kick'
        object.description = `Removes a user from the server.\nUsers who are kicked will need to be sent an invite in order to rejoin.\n\n**Usage:**\n\`kick <@user|user_id> <reason>\`\n\n**Examples:**\n\`kick @user\`\n\`kick @user spam\`\n\n**Aliases:**\n\`k\`\n\n**Permissions:**\nKick Members.\n`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Un-mute`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_UNMUTE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Soft-ban ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_SOFTBAN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('kick', object).set('k', object)
    }
}