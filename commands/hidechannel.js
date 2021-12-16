module.exports = {
      name: 'hidechannel',
      description: 'changes the @ everyone permission for VIEW_CHANNEL to the opposet of its current state',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (message.member.hasPermission('MANAGE_CHANNELS') || userstatus == 1) {
                  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  message.delete().catch(err => { console.log(err) });
                  if (!message.channel.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')) {
                        let filter = m => m.author.id === message.author.id;
                        message.channel.send(`are you sure you want to show ${message.channel} to the whole server? \`Y\` / \`N\``).then(() => {
                              message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(message => {
                                    message = message.first();
                                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                          message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: true }).then(() => {
                                                const errorEmbed = new Discord.MessageEmbed()
                                                      .setDescription(`'${message.channel.name}' has been revealed!.`)
                                                      .setColor('GREEN');
                                                message.channel.send(errorEmbed).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                                          });
                                    } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                          message.channel.send(`Cancelled.`).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                                    } else {
                                          message.channel.send(`Cancelled: Invalid Response`).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                                    }
                              }).catch(collected => {
                                    message.channel.send('Timed out').then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                              });
                        });
                  } else {
                        message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false }).then(() => {
                              const msgEmbed = new Discord.MessageEmbed()
                                    .setDescription(`'${message.channel.name}' has been hidden.`)
                                    .setColor('RED');
                              message.channel.send(msgEmbed).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                        });
                  }
            } else {
                  const warningEmbed = new Discord.MessageEmbed()
                        .setDescription('You do not have permissions to do this!')
                        .setColor('YELLOW');
                  message.channel.send(warningEmbed).then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
            }
      }
}