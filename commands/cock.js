module.exports = {
      name: 'cock',
      description: 'randomizes a cock size',
      async execute(message, client, cmd, args, Discord, userstatus) {
            let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (message.guild.id == '897649355115356170') return
            if (args[0]) {
                  if (userstatus == 1) {
                        if (args[0].toLowerCase() === 'manual') {
                              message.delete().catch(err => { console.log(err) })
                              let rating = args.slice(1).join(" ")
                              if (rating == '47') {
                                    rating = Math.floor(Math.random() * 9999) + 1;
                              } if (rating == '45') {
                                    rating = '-8 (wait what?)'
                              } if (member) {
                                    message.channel.send(`${member} has an impressive cock size of ${rating} inches`)
                                    return
                              } message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
                              return
                        }
                  }
            }
            let rating = Math.floor(Math.random() * 99) + 1;
            if (rating == '47') {
                  rating = Math.floor(Math.random() * 9999) + 1;
            } if (rating == '45') {
                  rating = '-8 (wait what?)'
            } if (member) {
                  message.channel.send(`${member} has an impressive cock size of ${rating} inches`)
                  return
            } if (message.author.id == '753454519937007696') {
                  if (rating > '100') {
                        message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
                        return
                  }
                  if (member) {
                        message.channel.send(`${member} has an impressive cock size of ${rating} inches`)
                        return
                  }
                  rating = Math.floor(Math.random() * 4) + 1;
                  if (rating == '3') {
                        message.channel.send(`${message.author} has an impressive cock size of 77 inches`)
                        return
                  }
                  rating = Math.floor(Math.random() * 99) + 1;
                  message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
                  return
            } if (message.author.id == '508847949413875712') {
                  if (rating > '100') {
                        message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
                        return
                  }
                  if (member) {
                        message.channel.send(`${member} has an impressive cock size of ${rating} inches`)
                        return
                  }
                  rating = Math.floor(Math.random() * 4) + 1;
                  if (rating == '3') {
                        message.channel.send(`${message.author} has an impressive cock size of 69 inches`)
                        return
                  }
                  rating = Math.floor(Math.random() * 99) + 1;
                  message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
                  return
            } if (member) {
                  message.channel.send(`${member} has an impressive cock size of ${rating} inches`)
                  return
            } message.channel.send(`${message.author} has an impressive cock size of ${rating} inches`)
      }
}