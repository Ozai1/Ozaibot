const { QueryType } = require('discord-player');

module.exports = {
    description: "It helps you start a new music.",
    name: 'play',
    options: [{
        name: 'music',
        description: 'Type the name of the music you want to play.',
        type: 'STRING',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        const music = interaction.options.getString('music')
        await interaction.reply({ content: `**Searching** :mag_right: \`${music}\``, ephemeral: false }).catch(e => { })
        if (!music) return interaction.editReply({ content: `Write the name of the music you want to search. ❌`, ephemeral: false }).catch(e => { })
        let didjoinchannel = false;
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)
            didjoinchannel = true
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply({ content: `I can't join audio channel. ❌` });
        }
        if (didjoinchannel === true) interaction.channel.send(`:thumbsup: **Joined** \`${interaction.member.voice.channel.name}\` **and bound to** <#${interaction.channel.id}>`)
        const res = await client.player.search(music, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.editReply({ content: `No results found! ❌`, ephemeral: false }).catch(e => { })

        const queue = await client.player.createQueue(interaction.guild, {
            leaveOnEnd: client.musicConfig.opt.voiceConfig.leaveOnEnd,
            autoSelfDeaf: client.musicConfig.opt.voiceConfig.autoSelfDeaf,
            metadata: interaction.channel
        });
        interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} has been found!` });

        await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} has been found!` });
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        if (!queue.playing) await queue.play();
    },
};