module.exports = {
    name: 'MISC - Permission Higherarchy',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title = 'MISC - Permissions Higherarchy'
        object.description = `**User permissions come before role permissions.\n\n\nAllowed permissions come before denied.**\n\nIf a user has two roles that have conflicting permissions, such as a role called "restricted" that has denied mute permissions and a mod role that has allowed mute permissions, the mod roles permissions will overpower the restricted roles permissions regardless of the role's positions because allowed over powers denied.\n\nAnother constructive example: A user has denied ban permissions but the user has a role that has allowed ban permissions. The user will not have access to the ban command because user permissions take presidence over role permissions.\n\n\nVisual repesentation - Ordered by influence:\n**USER**\nAllow\nDeny\n\n***then:***\n\n**ROLE**\nAllow\nDeny`
        const button = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('<- Permission Flags')
                .setStyle("PRIMARY")
                .setCustomId('HELP_PERMISSIONFLAGS')
        ).addComponents(
            new Discord.MessageButton()
                .setLabel('Back to MISC')
                .setStyle("PRIMARY")
                .setCustomId('HELP_TIPS')
        )
        object.buttons = [button];
        return client.help.set('permissionhigherarchy', object).set('permissionshigherarchy', object)
    }
}