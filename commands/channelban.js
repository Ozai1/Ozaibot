module.exports = {
    name: 'channelban',
    description: 'removes a user from the channel',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
<<<<<<< HEAD
        if (message.member.hasPermission('ADMINISTRATOR') || userstatus == 1) {
            if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
=======
        if (message.member.permissions.has('ADMINISTRATOR') || userstatus == 1) {
            if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
>>>>>>> a8b70406e617513040d6249ff25e164eeffc6a53
            let pinguser = member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!pinguser) return message.reply('Invalid user.')
            if (message.channel.permissionsFor(pinguser).has('VIEW_CHANNEL')) {
                await message.channel.updateOverwrite(pinguser, { VIEW_CHANNEL: false }).catch(err => {
                    console.log(err)
                    message.channel.send('Failed to remove from channel.')
                    return
                })
                message.channel.send(`${pinguser} has been banned from this channel.`)
            } else {
                message.channel.send('Selected user cannot see this this channel already!');
            }
        }
    }
}