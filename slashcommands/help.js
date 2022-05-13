module.exports = {
    showHelp: false,
    description: "It helps you to get information about bot and commands.",
    name: 'help',
    options: [],

    run: async (client, interaction, userstatus) => {
        interaction.reply({ content: `I am way to lazy to code this ngl`, ephemeral: true })
    },
};