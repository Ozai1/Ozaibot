const { MessageEmbed } = require('discord.js');
const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = (Discord, client, interaction) => {

    if (!interaction.guild) return
    
    if (interaction.isCommand()) {
        query = "SELECT * FROM userstatus WHERE userid = ?";
        data = [interaction.member.id]
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
            if (results == '' || results === undefined) { // User does not have a row.
                var userstatus = false;
                launchslashcommand(client, interaction, Discord, userstatus)
                return
            } for (row of results) {
                var userstatus = row["status"];
            } if (userstatus == 0) {
                return interaction.reply({ content: `You have been blacklisted from bot use.`, ephemeral: true }).catch(e => { })
            } else if (userstatus == 1) {
                launchslashcommand(client, interaction, Discord, userstatus)
            } else {
                launchslashcommand(client, interaction, Discord, userstatus)
            }
        });
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

async function launchslashcommand(client, interaction, Discord, userstatus) {
    const cmd = client.slashcommands.get(interaction.commandName);

    if (cmd && cmd.voiceChannel) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
    }
if (cmd)
    cmd.execute(client, interaction, Discord, userstatus)
    // let alllogs = client.channels.cache.get('986882651921190932');
    // const commandembed = new MessageEmbed()
    //     .setDescription(`**${interaction.guild}** (${interaction.guild.id})\n ${interaction.channel} (${interaction.channel.name} | ${interaction.channel.id})\n**${interaction.member.user.tag}** (${interaction.member.id})\n"${interaction.commandName}".`)
    //     .setTimestamp()
    // alllogs.send({ embeds: [commandembed] });
}
