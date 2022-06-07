module.exports = {
    description: "Music stops playing.",
    name: 'stop',
    options: [],
    voiceChannel: false,

    run: async (client, interaction, Discord, userstatus) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `There is no music currently playing!. ❌`, ephemeral: true }).catch(e => { })

        queue.destroy();
        if (queue.connection) queue.connection.disconnect();
        interaction.reply({ content: `:mailbox_with_no_mail: **Successfully disconnected**` }).catch(e => { })
    },
};