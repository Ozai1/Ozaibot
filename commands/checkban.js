module.exports = {
      name: 'checkban',
      description: 'checks if a user is banned from a guild and what theyre ban reason is',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions in this server. (This also means i cannot check bans.)')
            if (!userstatus == 1) {
                  if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('Missing permissions.')
            }
            if (!args[0]) return message.channel.send('Ban found on... oh wait')
            message.guild.fetchBans().then(bans => {
                  let member = bans.get(args[0]);
                  if (bans.size == 0) return message.reply('This server doesnt have any bans lol')
                  if (member == null) {
                        return message.reply('Cannot find an active ban for the given user.')
                  } else {
                        message.channel.send(`Active ban found on <@${args[0]}> for the reason of: ${member.reason}`)
                  }
            })
      }
}