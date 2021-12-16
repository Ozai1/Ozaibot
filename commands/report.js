module.exports = {
    name: 'report',
    description: 'allerts me of an issue with ozaibot',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '304886882737586177') return message.channel.send('Nah you can just DM me u rat')
        let reportchannel = client.channels.cache.get('896372539713028096');
        let content = args.slice(0).join(" ");
        console.log(`${message.author.tag} (${message.author.id}) | ${message.guild} (${message.guild.id}) | ${message.channel} : \n\n"${content}"`);
        message.channel.send(`Report sent.`);
        const reportembed = new Discord.MessageEmbed()
            .setDescription(`${message.author.tag} (${message.author.id}) | ${message.guild} (${message.guild.id}) | ${message.channel} : \n\n"${content}"`)
            .setTimestamp()
        reportchannel.send('<@!508847949413875712>', {embed: reportembed});
    }
}