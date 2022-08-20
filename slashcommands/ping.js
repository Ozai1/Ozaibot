const Discord = require('discord.js');
module.exports = {
    description: "poop",
    name: 'ping',
    options: [],

    async execute(client, interaction, Discord, userstatus) {
        interaction.reply({ content: `erfhgjbyimul`, ephemeral: true })
    },
};