module.exports = {
      name: 'crole',
      description: 'creates a role',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (userstatus == 1 || message.member.permissions.has('ADMINISTRATOR')) {
                  if (!message.guild.me.permissions.has('MANAGE_ROLES') && !message.guild.me.permissions.has('MANAGE_CHANNELS')) {
                        if (message.member.permissions.has('ADMINISTRATOR')) {
                              message.channel.send('Ozaibot does not have Manage Roles permissions so it cannot create your role.')
                        } else {
                              message.author.send('Ozaibot doesnt have perms for roles in this server zzzzz')
                        }
                  }
                  if (!args[0]) return message.reply('you must choose a role name for the command to work!');
                  if (!args[0].startsWith('#')) {
                        await message.guild.roles.create({
                              data: {
                                    name: args.slice(0).join(" "),
                              }
                        }).catch(err => {
                              console.log(err)
                              message.channel.send('Failed to create the role, this is most likely due to ozaibot not having high enough permissions.');
                              return
                        })
                        return
                  } if (args[0].startsWith('#')) {
                        await message.guild.roles.create({
                              data: {
                                    name: args.slice(1).join(" "),
                                    color: args[0],
                              }
                        }).catch(err => {
                              console.log(err)
                              message.channel.send('Failed to create the role, this is most likely due to ozaibot not having high enough permissions.');
                              return
                        })
                        return
                  }
            }
      }
}