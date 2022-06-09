const Discord = require('discord.js');
module.exports = {
    description: "It helps you to get information about the speed of the bot.",
    name: 'ping',
    options: [],

 async execute(client, interaction, Discord, userstatus)  {
        const start = Date.now();
        interaction.reply('Pong!').then(async() => {
        let last = Date.now();
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(client.user.username + " - Pong!")
                .setThumbnail(client.user.displayAvatarURL())
                .addField(`Message Ping`, `\`${Date.now() - start}ms\` 🛰️`)
                .addField(`Message Latency`, `\`${last - start}ms\` 🛰️`)
                .addField(`API Latency`, `\`${Math.round(client.ws.ping)}ms\` 🛰️`)
                .setTimestamp()
            interaction.editReply({ embeds: [embed], ephemeral: false }).catch(e => { });
        })
    },
};