module.exports.Music_Bot_INIT = async (client) => {
    const player = client.player;
    player.on('trackStart', (queue, track) => {
        if (!client.musicConfig.opt.loopMessage && queue.repeatMode !== 0) return;
        queue.metadata.send({ content: `**Playing** :notes: \`${track.title}\` - Now!` }).catch(err => { });
    });

    player.on('trackAdd', (queue, track) => {
        queue.metadata.send({ content: `\`${track.title}\` **added to playlist.** ✅` }).catch(err => { });
    });

    player.on('tracksAdd', (queue) => {
        queue.metadata.send({ content: `**Added playlist.** ✅` }).catch(err => { });
    });

    player.on('queueEnd', (queue) => {
        if (client.musicConfig.opt.voiceConfig.leaveOnTimer.status === true) {
            setTimeout(() => {
                if (queue.connection) queue.connection.disconnect();
                queue.metadata.send('Disconnected due to inactivity.')
            }, client.musicConfig.opt.voiceConfig.leaveOnTimer.time);
        }
        queue.metadata.send({ content: 'Queue finished!' }).catch(err => { });
    });

    player.on('botDisconnect', (queue) => {
        queue.metadata.send('Bot has been disconnected.');
        queue.destroy();
    });

    player.on('connectionError', async (queue, error) => {
        console.log(error)
    });

    player.on('error', async (queue, error) => {
        console.log(error)
    });
}
