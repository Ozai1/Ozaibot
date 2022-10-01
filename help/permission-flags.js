module.exports = {
    name: 'MISC - Permission Flags',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'MISC - Permissions Higherarchy'
        object.description = `These are all of the permissions grantable through the \`perms\` command.\n\n\`Ban\`\n\`Un-ban\`\n\`Mute\`\n\`Un-mute\`\n\`Kick\`\n\`Soft-ban\`\n\`Warn\`\n\`Edit-case | Reason\`\n\`Purge\`\n\`Lockdown\`\n\`Search | Case\`\n\`Moderation\`\n\`Administration\`\n\`Fun\`\n\`Utility\`\n\`General\`\n\`Any\`\n\`All-permissions\` ⚠️ (Access to all commands / modules)`
        const button = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('<- Durations')
                .setStyle("PRIMARY")
                .setCustomId('HELP_DURATIONS')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Permission Higherarchy ->')
                .setStyle("PRIMARY")
                .setCustomId('HELP_PERMISSIONSHIGHERARCHY')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Back to MISC')
                .setStyle("PRIMARY")
                .setCustomId('HELP_TIPS')
        )
        object.buttons = [button];
        return client.help.set('permissionflags', object).set('permissionsflags', object)
    }
}