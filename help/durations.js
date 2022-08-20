module.exports = {
    name: 'targeting',
    async execute(client, Discord) {
        let object = Object()
        object.displayButtonsWhenNonEphemeral = true

        object.title = 'Time Durations'
        object.description = `This is the way that the bot knows for how long to keep a punishemnt active on a user.\nAll commands that use custom durations will follow and use this system.\n\n**second:**\n\`seconds\` \`second\` \`secs\` \`sec\` \`s\`\n\n**minute:**\n\`minutes\` \`minute\` \`mins\` \`min\` \`m\`\n\n**hour:**\n\`hours\` \`hour\` \`h\`\n\n**day:**\n\`days\` \`day\` \`d\`\n\n**week:**\n\`weeks\` \`week\` \`w\`\n\n**month:**\n\`months\` \`month\` \`mon\`\n\n\nThese units of time are to be apended to a number.\n\n**Examples:**\n\`1mon\`\n\`3.4d\`\n\`0.875weeks\`\n\`mute @ozaibot 2h\``
        const button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('<- Targeting')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_TARGETING')
            ).addComponents(
                new Discord.MessageButton()
                    .setLabel('Back to MISC')
                    .setStyle("PRIMARY")
                    .setCustomId('HELP_TIPS')
            )
        object.buttons = [button];
        return client.help.set('duration', object).set('durations', object).set('time', object).set('times', object)
    }
}