



module.exports = {
      name: 'unban',
      description: 'unbans a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server! (This also means i cannot unban!)')
            if (!userstatus == 1) {
                  if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('You do not have permissions to use this command.')
            }
            message.guild.fetchBans().then(bans => {
                  let member = bans.get(args[0]);
                  if (bans.size == 0) return;
                  if (member == null) return message.reply('Cannot find a ban for the given user.');
                  message.guild.members.unban(args[0], 'Unbanned by ' + message.author.tag).then(() => {
                        message.channel.send('Unbanned <@' + args[0] + '>.');
                  }).catch(err => { console.log(err) });
            })
      }
}