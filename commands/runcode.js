module.exports = {
    name: 'runcode',
    description: 'repeats a message',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id !== '508847949413875712') return message.channel.send('absolutely not')
            eval(`${args.slice(0).join(" ")}`).catch(err => {
                const helpembed = new Discord.MessageEmbed()
                .setTitle('error spat')
                .setDescription(err)
                .setColor('BLUE')
            message.channel.send(helpembed)
            });
    }
}
