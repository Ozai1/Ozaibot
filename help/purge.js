module.exports = {
    name: 'purge',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = false
        object.title = 'Moderation - Purge'
        object.description = `Bulk deletes messages.\nMaximum amount of messages that can be deleted is 1000.\n\n**Usage:**\n\`purge <amount> <filters>\`\n\n**Purge filters**:\n\`@user\` \`silent\` \`links\` \`invites\` \`bots\` \`embeds\` \`files\` \`users\` \`images\` \`pins\` \`mentions\` \`stickers\`\n\nApplying options to the command will make the command search within the amount specified for messages that match the filer.\n*The bot will not look indefinitely until the amount is filled with messages that match.*\nAdding a user(s) will make the bot only search through those user(s) messages and ignore all others regardless of filters.\nThe silent filter will delete the command message and the bots confirmation after the purge is complete.\n\n**Examples:**\n\`purge 50\`\n\`purge 200 @user\`\n\`purge 25 links @user\`\n\`purge 400 @user links images invites silent\`\n\n**Aliases:**\n\`prune\`\n\`clear\`\n\n**Permissions:**\nManage Messages.\n`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`<- View-case`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_VIEWCASE`)
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel(`Back to Moderation`)
                    .setStyle("PRIMARY")
                    .setCustomId(`HELP_MODERATION`)
            )
        object.buttons = [button]
        return client.help.set('purge', object).set('clear', object).set('prune', object)
    }
}