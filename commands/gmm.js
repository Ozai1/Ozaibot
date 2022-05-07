module.exports = {
      name: 'gmm',
      aliases: [],
      description: 'deletes your message',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (userstatus == 1 || message.member.hasPermission('ADMINISTRATOR')) {
                  if (!args[0]) {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                        return
                  } if (isNaN(args[0])) {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                        return
                  }
                  setTimeout(function () {
                        if (message.deletable) message.delete().catch(err => { console.log(err) })
                  }, args[0] * 1000);
                  return
            }
      }
}