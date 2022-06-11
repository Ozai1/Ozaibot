const Discord = require('discord.js');
module.exports = {
    description: "It helps you to get information about the speed of the bot.",
    name: 'ping',
    options: [],

    async execute(client, interaction, Discord, userstatus) {
        interaction.reply({ content: `erfhgjbyimul`, ephemeral: true })
    },
};