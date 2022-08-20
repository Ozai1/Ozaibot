module.exports = {
    name: 'targeting',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true
        object.title ='MISC - Targeting Users'
        object.description =`Targets!\nIn commands, there is often an arguement called **member**, member refers to this.\n\n**There are 3 main ways of targeting a user:**\n\`#1\` Mentioning them. \`@user\`. simple.\n\`#2\` Using their ID. \`mute 862247858740789269 1d\` is a valid command.\n\`#3\` Using their names. \`mute ozaibot\` is a valid command.\n\n\n**Using names to target:**\nIf two people have overlapping names, you can add the # to their name like so: \`mute Ozaibot#3594\`.\nIt is recommended to just use IDs when name targeting becomes complicated.\nName targeting ignores capitalization completely.\nIf two people have overlapping names with the same tag but different capitalization it will select both of them.\nIf more than one user is found the bot can reply with an embed asking what member you meant.\nSimply follow the prompt and select the number next to the member to target them.\nIf more than 9 members are found, it will simply respond with invalid member.\n\nIf at any point mentioning members and using their names becomes impractical, it is recommended to use IDs.\nIDs are intangible, quick and easy to use.\n\nTo grab people's IDs you must enable developer mode through settings.\nYou can do that like this:\n\`Settings\` -> \`Advanced\` -> \`Developer Mode\`.\nOnce it is activated open someone's profile in a server, scroll to the bottom and there should be a \`Copy ID\` button.\n\nWith these three ways you will now be able to effectively target people.\nUsing IDs you can target people off server. \nSimply grab their ID and use it in the member argument and you can use some commands on them, such as ban.`
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Durations ->')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_DURATIONS')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to MISC')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_TIPS')
            )
        object.buttons = [button];
        return client.help.set('targeting', object).set('target', object).set('member', object).set('user', object)
    }
}