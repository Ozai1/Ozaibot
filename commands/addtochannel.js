module.exports = {
      name: 'addtochannel',
      description: 'adds a user to a channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (message.member.hasPermission('ADMINISTRATOR') || userstatus == 1) {
                  let channelselected = message.channel;
                  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  if (args[1]) {
                        if (!isNaN(args[1])) {
                              channelselected = message.guild.channels.cache.get(args[1]);
                              if (!channelselected) return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else if (args[1].startsWith('<#')) {
                              args[1].replace(args[1].substr('<'));
                              args[1].replace(args[1].substr('>'));
                              args[1].replace(args[1].substr('#'));
                              console.log(args[1]);
                              channelselected = message.guild.channels.cache.get(args[1]);
                              if (!channelselected) return message.reply('Invalid channel or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                  }
                  let pinguser = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]);
                  if (!pinguser) return message.reply('Invalid user.');
                  await channelselected.updateOverwrite(pinguser, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true }).catch(err => {
                        console.log(err)
                        message.channel.send('Failed to add to channel')
                        return
                  })
                  message.channel.send(`${pinguser} has been added to this channel.`);
            }
      }
}