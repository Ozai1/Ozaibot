module.exports = {
    name: 'say',
    description: 'repeats a message',
    aliases: ['embedsay'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1 || message.member.hasPermission('ADMINISTRATOR')) {
            if (cmd === 'embedsay') {
                if (message.content.toLocaleLowerCase().includes('<@&')) return
                if (message.deletable) message.delete().catch(err => { console.log(err) });
                if (!args[0]) return;
                let content = args.slice(0).join(" ");
                const embed = new Discord.MessageEmbed()
                    .setDescription(content)
                    .setColor('#F28FB0')
                message.channel.send(embed).catch(err => { })
                return
            }
            if (message.content.toLocaleLowerCase().includes('<@&')) return
            if (message.deletable) message.delete().catch(err => { console.log(err) });
            if (!args[0]) return;
            let content = args.slice(0).join(" ");
            if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
            message.channel.send(content).catch(err => { console.log(err) });
            return;
        }
    }
}
