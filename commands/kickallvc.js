module.exports = {
    name: 'kickallvc',
    description: 'kicks all members of a voice call',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!args[0]) return
            message.member.voice.channel.join().then(connection => {
                const dispatcher = connection.play('./audio/bedtime.mp3');
                dispatcher.on("end", end => { return });
            })
            setTimeout(() => {
                message.member.voice.channel.members.forEach(async (member, id) => {
                    member.voice.kick().catch(err => { console.log(err) })
                })
            }, 2700);
        }
    }
}