module.exports = {
    name: 'fuck',
    description: '',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '508847949413875712' || message.author.id == '753454519937007696') {
            if (message.guild.id == '750558849475280916') {
                let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                if (!member) return message.channel.send('So youre just gonna fuck the air?')
                if (message.author.id == '508847949413875712') {
                    if (message.author.id == member) return message.channel.send('Better be with Jan...')
                } if (message.author.id == '753454519937007696') {
                    if (message.author.id == member) return message.channel.send('Better be with Riley...')
                } if (member == '508847949413875712' || member == '753454519937007696') {
                    cats = [`Hey hey, ${message.author} is getting a little spicy with ${member}.... This could be interesting`, `Oh my! ${message.author} is looking to agressively fuck ${member}!!! be gentle!`, `Jesus i think these two are in love! Lets give them some space.`, `daym this is quite the night, gonna wanna cover your ears leon....`, `Honestly knowing <@!753454519937007696>, idk who is going to be the one needing to be told to be gentle, lets find out!`];
                    var random = cats[Math.floor(Math.random() * cats.length)];
                    message.channel.send(random)
                    return
                }
                message.channel.send('...')
                console.log(`So uh apparently ${message.author.username} used sm_fuck on someone other than theyre other? idk whats up with that.`)
                return
            }
        }
    }
}