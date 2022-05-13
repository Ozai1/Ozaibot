const { QueryType } = require('discord-player');

module.exports = {
    description: "play music through the bot.",
    name: 'play',
    options: [{
        name: 'music',
        description: 'Type the name of the music you want to play.',
        type: 'STRING',
        required: true
    }],
    voiceChannel: false,

    run: async (client, interaction, userstatus) => {
        if (!interaction.member.voice.channel) return interaction.reply({ content: `You must be in a voice channel to use this command.`, ephemeral: true })
        const music = interaction.options.getString('music')
        await interaction.reply({ content: `**Searching** :mag_right: \`${music}\``, ephemeral: false }).catch(e => { })
        if (!music) return interaction.editReply({ content: `Write the name of the music you want to search. ❌`, ephemeral: false }).catch(e => { })

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

        let didjoinchannel = null;
        if (!interaction.guild.me.voice.channel) {
            didjoinchannel = false;
        }
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)
            if (didjoinchannel === false) {
                didjoinchannel = true
            }
        } catch (err) {
            await client.player.deleteQueue(interaction.guild.id);
            console.log(err)
            return interaction.editReply({ content: `I can't join audio channel, please move to a different channel or if I am still in the channel please kick me from the channel. ❌` });
        }

        if (didjoinchannel === true) {
            queue.setVolume(50);
            await interaction.channel.send(`:thumbsup: **Joined** \`${interaction.member.voice.channel.name}\` **and bound to** <#${interaction.channel.id}>`)
        } 
        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
        if (!queue.playing) await queue.play();
    },
};