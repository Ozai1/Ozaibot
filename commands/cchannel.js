module.exports = {
      name: 'cchannel',
      description: 'creates a publuc channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
<<<<<<< HEAD
                  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
=======
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
>>>>>>> a8b70406e617513040d6249ff25e164eeffc6a53
                  let channelName = args.slice(0).join(' ');
                  message.guild.channels.create(channelName, {
                        type: "text",
                        permissionOverwrites: [
                              {
                                    id: message.guild.roles.everyone,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                              }
                        ],
                  }).catch(err => {
                        console.log(err);
                        message.author.send('Failed to create channel.');
                  })
            }
      }
}