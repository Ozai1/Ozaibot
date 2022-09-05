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
const { QueryType } = require('discord-player');
module.exports = {
    name: 'play',
    aliases: ["pause", "stop", "resume", "skip"],
    description: 'M U S I C',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (cmd === 'play') return command_play(message, client, args, Discord)
        if (cmd === 'pause') return command_pause(message, client, args, Discord)
        if (cmd === 'stop') return command_stop(message, client, args, Discord)
        if (cmd === 'resume') return command_resume(message, client, args, Discord)
        if (cmd === 'skip') return command_skip(message, client, args, Discord)
    }
}

async function command_play(message, client, args, Discord) {
    const music = args.slice(0).join(" ");
    if (!music) return message.channel.send({ content: `Write the name of the music you want to search. ❌`, ephemeral: false }).catch(e => { })
    await message.channel.send({ content: `**Searching** :mag_right: \`${music}\``, ephemeral: false }).catch(e => { })

    const res = await client.player.search(music, {
        requestedBy: message.member,
        searchEngine: QueryType.AUTO
    });

    if (!res || !res.tracks.length) return message.channel.send({ content: `No results found! ❌`, ephemeral: false }).catch(e => { })

    const queue = await client.player.createQueue(message.guild, {
        leaveOnEnd: client.musicConfig.opt.voiceConfig.leaveOnEnd,
        autoSelfDeaf: false,
        metadata: message.channel
    });

    let didjoinchannel = null;
    if (!message.guild.me.voice.channel) {
        didjoinchannel = false;
    }
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel)
        if (didjoinchannel === false) {
            didjoinchannel = true
        }
    } catch (err) {
        await client.player.deleteQueue(message.guild.id);
        console.log(err)
        return message.channel.send({ content: `I can't join audio channel, please move to a different channel or if I am still in the channel please kick me from the channel. ❌` });
    }

    if (didjoinchannel === true) {
        queue.setVolume(50);
        await message.channel.send(`:thumbsup: **Joined** \`${message.member.voice.channel.name}\` **and bound to** <#${message.channel.id}>`)
    }
    res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
    if (!queue.playing) await queue.play();
}

async function command_stop(message, client, args, Discord) {
    const queue = client.player.getQueue(message.guild.id);

    queue.destroy();
    if (queue.connection) queue.connection.disconnect();
    message.channel.send({ content: `:mailbox_with_no_mail: **Successfully disconnected**` }).catch(e => { })
}

async function command_pause(message, client, args, Discord) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue || !queue.playing) return message.channel.send({ content: `There is no music currently playing!. ❌` }).catch(e => { })

    const success = queue.setPaused(true);

    return message.channel.send({ content: success ? `The currently playing music named **${queue.current.title}** has stopped ✅` : `Something went wrong. ❌` }).catch(e => { })
}

async function command_resume(message, client, args, Discord) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue) return message.channel.send({ content: `There is no music currently playing!. ❌` }).catch(e => { })

    const success = queue.setPaused(false);

    return message.channel.send({ content: success ? `**${queue.current.title}**, The song continues to play. ✅` : `Something went wrong. ❌` }).catch(e => { })
}

async function command_skip(message, client, args, Discord) {
    const queue = client.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) return message.channel.send({ content: `There is no music currently playing!. ❌` }).catch(e => { })

    const success = queue.skip();

    return message.channel.send({ content: success ? `**${queue.current.title}**, Skipped song ✅` : `Something went wrong ❌` }).catch(e => { })
}