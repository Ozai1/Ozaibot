const { MessageEmbed } = require('discord.js');
module.exports = (Discord, client, interaction) => {

    if (!interaction.guild) return

    if (interaction.isCommand()) {

        const cmd = client.slashcommands.get(interaction.commandName);

        if (cmd && cmd.voiceChannel) {
            if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
            if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
        }

        cmd.run(client, interaction)
        let alllogs = client.channels.cache.get('882845463647256637');
        const commandembed = new Discord.MessageEmbed()
            .setDescription(`**${interaction.guild}** (${interaction.guild.id})\n ${interaction.channel} (${interaction.channel.name} | ${interaction.channel.id})\n**${interaction.member.user.tag}** (${interaction.member.id})\n"${interaction.commandName}".`)
            .setTimestamp()
        alllogs.send({ embeds: [commandembed] });
    }
    if (interaction.isButton()) {
        const queue = client.player.getQueue(interaction.guildId);
        switch (interaction.customId) {
            case 'saveTrack': {
                if (!queue || !queue.playing) {
                    return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
                } else {
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(client.user.username + " - Save Track")
                        .setThumbnail(client.user.displayAvatarURL())
                        .addField(`Track`, `\`${queue.current.title}\``)
                        .addField(`Duration`, `\`${queue.current.duration}\``)
                        .addField(`URL`, `${queue.current.url}`)
                        .addField(`Saved Server`, `\`${interaction.guild.name}\``)
                        .addField(`Requested By`, `${queue.current.requestedBy}`)
                        .setTimestamp()
                    interaction.member.send({ embeds: [embed] }).then(() => {
                        return interaction.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true }).catch(e => { })
                    }).catch(error => {
                        return interaction.reply({ content: `I can't send you a private message. ❌`, ephemeral: true }).catch(e => { })
                    });
                }
            }
                break
            case 'time': {
                if (!queue || !queue.playing) {
                    return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
                } else {

                    const progress = queue.createProgressBar();
                    const timestamp = queue.getPlayerTimestamp();

                    if (timestamp.progress == 'Infinity') return interaction.message.edit({ content: `This song is live streaming, no duration data to display. 🎧` }).catch(e => { })

                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(queue.current.title)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`${progress} (**${timestamp.progress}**%)`)
                    interaction.message.edit({ embeds: [embed] }).catch(e => { })
                    interaction.reply({ content: `**✅ Success:** Time data updated. `, ephemeral: true }).catch(e => { })
                }
            }
        }
    }
};