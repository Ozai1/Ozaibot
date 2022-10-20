module.exports = {
    description: "Un-pauses any paused music",
    name: 'resume',
    options: [],
    voiceChannel: true,

 async execute(client, interaction, Discord, userstatus)  {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.reply({ content:`There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setPaused(false);

        return interaction.reply({ content: success ? `Resumed ✅` : `Something went wrong. ❌` }).catch(e => { })
    },
};