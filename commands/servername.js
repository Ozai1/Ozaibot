module.exports = {
      name: 'servername',
      description: 'renames a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
                  if (!message.guild.me.permissions.has('MANAGE_GUILD')) return message.author.send('Ozaibot doesnt have perms for that.');
                  let name = args.slice(0).join(" ");
                  if (name.length < 2 || name.length > 100) return message.author.send('Name must be 2 - 100 characters long.')
                  message.guild.setName(name).catch(err => {
                        console.log(err)
                        return
                  }).then(() => {
                        message.react('✅').then(react => { react.remove().catch(err => { console.log(err) }) }).catch(err => { console.log(err) })
                  })
            }
      }
}