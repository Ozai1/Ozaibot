const Help_Responses = new Map()
module.exports = {
    showHelp: false,
    description: "information about the bot",
    name: 'help',
    options: [{
        name: 'command',
        description: 'the name of the command or command module you would like to see',
        type: 3,
        required: false
    }],

 async execute(client, interaction, Discord, userstatus)  {
        const args0 = interaction.options.getString('command')
        if (!args0) {
            interaction.reply('dbdasf')
        } else {
            if (Help_Responses.has(args0.toLowerCase())) {
                const returnmessage = Help_Responses.get(args0.toLowerCase())
                returnmessage(interaction, Discord, userstatus)
            } else {
                interaction.reply({ content: `Command / module not found. Please check your spelling.`, ephemeral: true })
            }
        }
    },
};

module.exports.Help_INIT = () => {
    Help_Responses.set('ban', HELP_EMBED_BAN)
    Help_Responses.set('kick', HELP_EMBED_KICK)
    Help_Responses.set('mute', HELP_EMBED_MUTE)
    Help_Responses.set('unmute', HELP_EMBED_UNMUTE)
    Help_Responses.set('unban', HELP_EMBED_UNBAN)
    Help_Responses.set('rename', HELP_EMBED_RENAME)
    Help_Responses.set('purge', HELP_EMBED_PURGE)
    Help_Responses.set('help', HELP_EMBED_HELP)

}

async function HELP_EMBED_BAN(interaction, Discord, userstatus) {

    interaction.reply({ content: `BAN`, ephemeral: true })
}

async function HELP_EMBED_KICK(interaction, Discord, userstatus) {
    interaction.reply({ content: `KICK`, ephemeral: true })
}

async function HELP_EMBED_MUTE(interaction, Discord, userstatus) {
    interaction.reply({ content: `KICK`, ephemeral: true })
}

async function HELP_EMBED_RENAME(interaction, Discord, userstatus) {
     const helpembed = new Discord.MessageEmbed()
    .addField(`sm_rename <@user> <new name>`, `Renames the user.\nPermissions: Manage Nicknames.`)
    .setTimestamp()
    .setColor('BLUE')
    interaction.reply({ embeds: [helpembed], ephemeral: true })
}

async function HELP_EMBED_UNBAN(interaction, Discord, userstatus) {
    interaction.reply({ content: `KICK`, ephemeral: true })
}

async function HELP_EMBED_UNMUTE(interaction, Discord, userstatus) {
    interaction.reply({ content: `KICK`, ephemeral: true })
}

async function HELP_EMBED_PURGE(interaction, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .addField(`sm_purge <number_of_messages_to_be_deleted>`, `Deletes the amount of messages given. \nMax messages to delete is 1000.\nPermissions: Manage Messages.`)
        .setTimestamp()
        .setColor('BLUE')
    interaction.reply({ embeds: [helpembed], ephemeral: true })
}

async function HELP_EMBED_HELP(interaction, Discord, userstatus) {
    interaction.reply({ content: `KICK`, ephemeral: true })
}
