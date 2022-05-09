module.exports = {
    description: "Seeks what part of the track to play at.",
    name: 'seek',
    options: [
        {
            name: 'time',
            description: 'Where in the song to play (in seconds)',
            type: 'INTEGER',
            required: true
        }
    ],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
        const time = interaction.options.getInteger('time')
        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true }).catch(e => { })
        queue.seek(time * 1000)
        interaction.reply(`Seeked to ${time} seconds into the track!`)
    },
};