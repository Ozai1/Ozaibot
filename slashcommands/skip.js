module.exports = {
    description: "Skips the current song",
    name: 'skip',
    options: [],
    voiceChannel: true,

 async execute(client, interaction, Discord, userstatus)  {
        const queue = client.player.getQueue(interaction.guild.id);
 
        if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        const success = queue.skip();

        return interaction.reply({ content: success ? `**${queue.current.title}**, Skipped song ✅` : `Something went wrong ❌` }).catch(e => { })
    },
};