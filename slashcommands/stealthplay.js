const { QueryType } = require('discord-player');
const mysql = require('mysql2');
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: 'P0V6g5',
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    description: "so i can hide my relatives spotify accounts",
    name: 'stealthplay',
    options: [{
        name: 'music',
        description: 'Type the name of the music you want to play.',
        type: 'STRING',
        required: true
    }],
    voiceChannel: true,

    run: async (client, interaction) => {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            return justfuckingrunit(client, interaction)
        }
        query = "SELECT * FROM userstatus WHERE userid = ?";
        data = [message.author.id]
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
            if (results == '' || results === undefined) {
                return interaction.reply('Only botadmins & users with administrator permissions can use this command.')
            } // User does not have a row.
            var userstatus = false;
            for (row of results) {
                var userstatus = row["status"];
                if (userstatus == 1) {
                    justfuckingrunit(client, interaction)
                } else {
                    return interaction.reply('Only botadmins & users with administrator permissions can use this command.')
                }
            }
        });


    },
};
async function justfuckingrunit(client, interaction) {
    await interaction.reply({ content: `Searching...`, ephemeral: true }).catch(e => { })
    const music = interaction.options.getString('music')
    if (!music) return interaction.editReply({ content: `Write the name of the music you want to search. ❌`, ephemeral: true }).catch(e => { })

    const res = await client.player.search(music, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO
    });

    if (!res || !res.tracks.length) return interaction.editReply({ content: `No results found! ❌`, ephemeral: true}).catch(e => { })

    const queue = await client.player.createQueue(interaction.guild, {
        leaveOnEnd: client.musicConfig.opt.voiceConfig.leaveOnEnd,
        autoSelfDeaf: client.musicConfig.opt.voiceConfig.autoSelfDeaf,
        metadata: interaction.channel
    });
    await interaction.editReply({ content: `Your ${res.playlist ? 'Playlist' : 'Track'} has been found!` , ephemeral: true});
    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
    } catch {
        await client.player.deleteQueue(interaction.guild.id);
        return interaction.editReply({ content: `I can't join audio channel. ❌`, ephemeral: true });
    }
    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
    if (!queue.playing) await queue.play();
}