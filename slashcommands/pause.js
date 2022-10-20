module.exports = {
    description: "Stops playing the music.",
    name: 'pause',
    options: [],
    voiceChannel: true,

 async execute(client, interaction, Discord, userstatus)  {
        const queue = client.player.getQueue(interaction.guild.id);

       if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setPaused(true);

        return interaction.reply({ content: success ? `Paused ✅` : `Something went wrong. ❌` }).catch(e => { })
    },
};