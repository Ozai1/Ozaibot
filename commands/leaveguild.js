module.exports = {
    name: 'leaveguild',
    description: 'has the bot leave a guild',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            let guild2 = client.guilds.cache.get(args[0]);
            if (!guild2) return message.reply('Ozaibot isnt in that server, or its an invalid id.')
            await message.react('☑️')
            guild2.leave().catch(err => { console.log(err) });
      }
    }
}