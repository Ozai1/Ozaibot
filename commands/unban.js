module.exports = {
      name: 'unban',
      description: 'unbans a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server! (This also means i cannot unban!)')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permissions to use this command.')
            }
            if (!args[0]) return message.channel.send('Please a user\s id to unban.')
            message.guild.fetchBans().then(bans => {
                  let member = bans.get(args[0]);
                  if (bans.size == 0) return message.channel.send('This server does not have any bans.');
                  if (!member) return message.reply('Cannot find a ban for the given user.');
                  message.guild.members.unban(args[0], 'Unbanned by ' + message.author.tag).then(() => {
                        message.channel.send('Unbanned <@' + args[0] + '>.');
                  }).catch(err => { console.log(err) });
            })
      }
}