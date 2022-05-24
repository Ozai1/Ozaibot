<<<<<<< HEAD
=======
const { GetMember } = require("../functions")
>>>>>>> a8b70406e617513040d6249ff25e164eeffc6a53
module.exports = {
      name: 'addtochannel',
      description: 'adds a user to a channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
<<<<<<< HEAD
            if (message.member.hasPermission('ADMINISTRATOR') || userstatus == 1) {
                  let channelselected = message.channel;
                  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
=======
            if (message.member.permissions.has('ADMINISTRATOR') || userstatus == 1) {
                  let channelselected = message.channel;
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  if (!args[0]) return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
>>>>>>> a8b70406e617513040d6249ff25e164eeffc6a53
                  if (args[1]) {
                        if (!isNaN(args[1])) {
                              channelselected = message.guild.channels.cache.get(args[1]);
                              if (!channelselected) return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else if (args[1].startsWith('<#')) {
                              channelselected = message.guild.channels.cache.get(args[1].slice(2, -1));
                              if (!channelselected) return message.reply('Invalid channel or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                  }
<<<<<<< HEAD
                  let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                  if (!member) return message.reply('Invalid user.');
                  await channelselected.updateOverwrite(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true }).catch(err => {
                        console.log(err)
                        message.channel.send('Failed to add to channel')
                        return
                  })
                  message.channel.send(`${member} has been added to this channel.`);
=======
                  let member = await GetMember(message, args[0], Discord, false)
                  if (!member) return message.reply('Invalid user.');
                  channelselected.permissionOverwrites.edit(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ADD_REACTIONS: true }).catch(err => {
                        message.channel.send('failed')
                        console.log(err)
                  })
                  return message.channel.send(`${member} has been added to ${channelselected.name}.`);
>>>>>>> a8b70406e617513040d6249ff25e164eeffc6a53
            }
      }
}