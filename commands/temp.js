module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!userstatus == 1) return
await message.guild.members.fetch(args[0]).catch(err => 
    {
        message.channel.send(`Error: ${err}`)
    })
    }
}