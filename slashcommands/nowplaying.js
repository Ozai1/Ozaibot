const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    description: "Shows what song is currently being played.",
    name: 'nowplaying',
    options: [],
    voiceChannel: true,

 async execute(client, interaction, Discord, userstatus)  {
        const queue = client.player.getQueue(interaction.guild.id);

 if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.title)

        const methods = ['disabled', 'track', 'queue'];

        const timestamp = queue.getPlayerTimestamp();
const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

        embed.setDescription(`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nURL: ${track.url}\nLoop Mode **${methods[queue.repeatMode]}**\n${track. requestedBy}`);

        embed.setTimestamp();

        const saveButton = new MessageButton();

        saveButton.setLabel('Save Song');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(saveButton);

        interaction.reply({ embeds: [embed], components: [row] }).catch(e => { })
    },
};