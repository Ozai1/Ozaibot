module.exports = {
    name: 'mute',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Mute'
        object.description = `Prevents a user from speaking in text channels.\nCommand will not work until a mute role has been set,\nYou can set a muterole with the \`muterole\`command.\n\n**WARNING:**\nIf a user re-joined the server while they have a mute active, they will be automatically re-muted.\nIf the mute-role is removed from a user, it is classed as an un-mute interally within the bot, a message will be send to mod logs and they will be classed as un-muted until the command has been used on them again.\n\n**Usage:**\n\`mute <@user|user_id> <time> <reason>\`\n\n**Examples:**\n\`mute @user\`\n\`mute @user spam\`\n\`mute @user 1h bad words\`\n\n**Aliases:**\n\`m\`\n\n**Reversal Command:**\n\`unmute\`\n\n**Permissions:**\nManage Messages.\n`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- Un-ban`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_UNBAN`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Un-mute ->`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_UNMUTE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('mute', object).set('m', object)
    }
}