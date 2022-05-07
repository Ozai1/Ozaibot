

module.exports = {
    description: "Allows you to adjust the music volume.",
    name: 'volume',
    options: [{
        name: 'volume',
        description: 'Type the number to adjust the volume.',
        type: 'INTEGER',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
       if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        const vol = parseInt(interaction.options.getInteger('volume'));

        if (!vol) return interaction.reply({ content: `Current volume: **${queue.volume}** 🔊\n**To change the volume, with \`1\` to \`${5}\` Type a number between.**`, ephemeral: true }).catch(e => { })

        if (queue.volume === vol) return interaction.reply({ content: `The volume you want to change is already the current volume ❌`, ephemeral: true }).catch(e => { })

        if (vol < 0 || vol > 5) return interaction.reply({ content: `**Type a number from \`1\` to \`${5}\` to change the volume .** ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setVolume(vol);

        return interaction.reply({ content: success ? `Volume changed: **%${vol}**/**${client.musicConfig.maxVolume}** 🔊` : `Something went wrong. ❌` }).catch(e => { })
    },
};