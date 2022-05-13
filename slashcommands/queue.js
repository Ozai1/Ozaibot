const { MessageEmbed } = require('discord.js');

module.exports = {
    description: "It shows you the playlist.",
    name: 'queue',
    options: [],
    voiceChannel: true,

    run: async (client, interaction, userstatus) => {
        const queue = client.player.getQueue(interaction.guild.id);

 
        if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        if (!queue.tracks[0]) return interaction.reply({ content: `No music in queue after current. ❌`, ephemeral: true }).catch(e => { })

        const embed = new MessageEmbed();
        const methods = ['🔁', '🔂'];

        embed.setColor('BLUE');
        embed.setTitle(`Server Music List - ${interaction.guild.name} ${methods[queue.repeatMode]}`);

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track. requestedBy.id}>)`);

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **${songs}** Songs in the List.`;

        embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs }`);

        embed.setTimestamp();

        interaction.reply({ embeds: [embed] }).catch(e => { })
    },
};