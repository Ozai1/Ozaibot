module.exports = {
    description: "Stops all music, empties queue and kicks bot from call",
    name: 'stop',
    options: [],
    voiceChannel: false,

 async execute(client, interaction, Discord, userstatus)  {
        const queue = client.player.getQueue(interaction.guild.id);
        if (queue)
        queue.destroy();
        if (queue.connection) queue.connection.disconnect();
        interaction.reply({ content: `:mailbox_with_no_mail: **Successfully disconnected**` }).catch(e => { })
    },
};