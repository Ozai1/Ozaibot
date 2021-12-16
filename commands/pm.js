module.exports = {
      name: 'pm',
      aliases:['privatemessage', 'privatemsg'],
      description: 'dms a user through the bot',
      async execute(message, client, cmd, args, Discord, userstatus) {
            let logchannel = client.channels.cache.get('879969259692912680')
            let messageexe = message.author;
            let member = null;
            if (userstatus == 1) {
                  if (args[0] === 'raw') {
                        member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[1]);
                        message.delete().catch(err => { console.log(err) })
                        if (!member) { member = await client.users.fetch(args[1]).catch(err => { }) }
                        if (!member) return message.channel.send('Could not get that member.').then(message => message.delete({ timeout: 2000 }))
                        if (message.author.id == '753454519937007696') { messageexe = 'Cherry' }
                        if (message.author.id == '508847949413875712') { messageexe = 'Ozai' }
                        if (member == '753454519937007696') { messaged = 'Cherry' }
                        if (member == '508847949413875712') { messaged = 'Ozai' }
                        let content = args.slice(2).join(" ");
                        member.send(content).catch(err => { console.log(err) })
                        message.channel.send(`Message sent!`).then(message => message.delete({ timeout: 2000 }))
                        logchannel.send(`${messageexe} has sent a **raw** message to ${member} in **${message.guild}**: ${message.channel}. Message: "${content}"`).catch(err => { console.log(err) }).catch(err => { console.log(err) })
                        return
                  }
            } if (args[0] === 'stealth') {
                  member = message.guild.members.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[1]);
                  let messaged = message.guild.members.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[1]);
                  if (message.author.id == '753454519937007696') { messageexe = 'Cherry' }
                  if (message.author.id == '508847949413875712') { messageexe = 'Ozai' }
                  if (member == '753454519937007696') { messaged = 'Cherry' }
                  if (member == '508847949413875712') { messaged = 'Ozai' }
                  if (!member) return message.channel.send('Usage is \"sm_pm <@user> <message>\"')
                  message.delete({ timeout: 2000 })
                  let content = args.slice(2).join(" ");
                  if (!args[2]) { content = 'No message was given.' }
                  member.send(`A user who has made themselves anonymous has sent you a message! \n **Message**: \n${content}`).catch(err => { console.log(err) })
                  message.channel.send(`Message sent!`).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
                  logchannel.send(`${messageexe} has sent a **STEALTH** message to ${messaged} in **${message.guild}**: ${message.channel}. Message: "${content}"`).catch(err => { console.log(err) }).catch(err => { console.log(err) })
                  return
            } else {
                  member = message.guild.members.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0]);
                  let messaged = message.guild.members.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0]);
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { console.log(err) }) }
                  if (message.author.id == '753454519937007696') { messageexe = 'Cherry' }
                  if (message.author.id == '508847949413875712') { messageexe = 'Ozai' }
                  if (member == '753454519937007696') { messaged = 'Cherry' }
                  if (member == '508847949413875712') { messaged = 'Ozai' }
                  if (!member) return message.channel.send('Usage is \"sm_pm <@user> <message>\"')
                  let content = args.slice(1).join(" ");
                  if (!args[1]) { content = 'No message was given.'; }
                  member.send(`${message.author} has sent you a message! \n **Message**: \n${content} \n \nYou can Message them back with "**sm_pm <@user> <message>**"!`).catch(err => { console.log(err) }).catch(err => { console.log(err) })
                  message.channel.send(`Message sent!`).catch(err => { console.log(err) })
                  logchannel.send(`${messageexe} has sent a **standard** message to ${messaged} in **${message.guild}**: ${message.channel}. Message: "${content}"`).catch(err => { console.log(err) }).catch(err => { console.log(err) })
            }
      }
}