module.exports = {
      name: 'cvc',
      description: 'creates a public vc',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  let channelName = args.slice(0).join(' ');
                  message.guild.channels.create(channelName, {
                        type: "voice",
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