module.exports = {
      name: 'kick',
      aliases: ['k'],
      description: 'Kicks a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send('Ozaibot does not have kick permissions in this server!')
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]);
            if (userstatus == 1) {
                  if (!message.member.hasPermission('KICK_MEMBERS')) {
                        if (!member) return
                        if (!member.kickable) return
                        let reason = args.slice(1).join(" ");
                        if (!reason) reason = 'No reason given';
                        message.channel.send(`Kicked ${member}.`)
                              const kickedembed = new Discord.MessageEmbed()
                                    .addField(`**You have been kicked from** ${message.guild}.`, `**For**: ${reason}`)
                                    .setColor('ORANGE')
                                    .setTimestamp()
                              member.send(kickedembed).catch(err => { })
                              console.log(`confirmation message sent to ${member.tag} for being kicked from ${message.guild} by ${message.author.tag}`)
                        await member.kick({ reason: `${reason}` }).catch(err => {
                              console.log(err)
                              message.channel.send('Failed to kick')
                              return
                        })
                        return
                  }
            }
            if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('You do not have permissions to do this!');
            if (!member) return message.reply("Usage is \"sm_kick <@user|user_id> <reason>\"");
            if (member.id === message.author.id) return message.channel.send('You cant kick yourself!');
            if (message.guild.ownerID !== message.author.id) {
                  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot kick someone with higher or the same roles as your own.');
            }
            if (!member.kickable) return message.reply("I cannot kick this member!");
            let reason = args.slice(1).join(" ");
            if (!reason) reason = 'No reason given';
            message.channel.send(`Kicked ${member}.`)
                  const kickedembed = new Discord.MessageEmbed()
                        .addField(`**You have been kicked from**: ${message.guild}.`, `**Kicked by**: ${message.author} \n **For**: "${reason}".`)
                        .setColor('ORANGE')
                        .setTimestamp()
                  member.send(kickedembed).catch(err => { })
                  console.log(`confirmation message sent to ${member.tag} for being kicked from ${message.guild} by ${message.author.tag}`)
            await member.kick({ reason: `${reason} - ${message.author.tag}` }).catch(err => {
                  console.log(err)
                  message.channel.send('Failed to kick')
                  return
            })
      }
}