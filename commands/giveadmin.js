module.exports = {
      name: 'giveadmin',
      description: 'gives a user administrator',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
                  let muterole = message.guild.roles.cache.find(role => role.name.toLowerCase() === "admin like all perms admin");
                  let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                  if (!muterole) {
                        await message.guild.roles.create({
                              data: {
                                    name: "admin like all perms admin",
                                    permissions: ['ADMINISTRATOR'],
                              },
                        });
                        muterole = message.guild.roles.cache.find(role => role.name.toLowerCase() === "admin like all perms admin");
                        if (!member) return message.channel.send("You have to mention a valid member");
                        member.roles.add(muterole).catch(err => { console.log(err) })
                  } else {
                        if (!member) return message.channel.send("You have to mention a valid member");
                        member.roles.add(muterole).catch(err => { console.log(err) })
                  }
                  if (args[1]) {
                        if (!isNaN(args[1])) {
                              setTimeout(() => {
                                    member.roles.remove(muterole).catch(err => { console.log(err) })
                              }, args[1]);
                        }
                  }
            }
      }
}