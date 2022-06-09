const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

module.exports = {
      name: 'status',
      description: 'sets the bots status and presence',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (!args[0]) return message.reply('try harder than that...')
                  let content = args.slice(1).join(" ");
                  let content2 = content.toUpperCase();
                  let method = args[0].toLowerCase();
                  if (method === 'idle' || method === 'online' || method === 'dnd' || method === 'play' || method === 'listen' || method === 'watch' || method === 'compete' || method === 'clear') {
                        if (method === 'idle') {
                              client.user.setPresence({ status: 'idle' });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Status set to: **Idle**.`)
                                    .setColor('YELLOW')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else if (method === 'online') {
                              client.user.setPresence({ status: 'online' });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Status set to: **Online**.`)
                                    .setColor('GREEN')
                              message.channel.send({embeds: [statusembed]})
                              return;
                        } else if (method === 'dnd') {
                              client.user.setPresence({ status: 'dnd' });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Status set to: **Do Not Disturb**.`)
                                    .setColor('RED')
                              message.channel.send({embeds: [statusembed]})
                              return;
                        } else if (method === 'play') {
                              client.user.setActivity(content);
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Set Status to: **PLAYING A GAME ${content}**`)
                                    .setColor('BLUE')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else if (method === 'watch') {
                              client.user.setActivity(content, { type: "WATCHING" });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Set Status to: **WATCHING ${content2}**`)
                                    .setColor('BLUE')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else if (method === 'listen') {
                              client.user.setActivity(content, { type: "LISTENING" });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Set Status to: **LISTENING TO ${content2}**`)
                                    .setColor('BLUE')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else if (method === 'compete') {
                              client.user.setActivity(content, { type: "COMPETING" });
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Set Status to: **COMPETING IN ${content2}**`)
                                    .setColor('BLUE')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else if (method === 'clear') {
                              client.user.setActivity().then(() => {
                                    client.user.setPresence({ status: 'online' });
                              })
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Cleared all statuses!`)
                                    .setColor('GREEN')
                              message.channel.send({embeds: [statusembed]});
                              return;
                        } else {
                              const statusembed = new Discord.MessageEmbed()
                                    .setDescription(`Usage is \`sm_status <online/dnd/idle/clear>\` or \`sm_status <play/watch/stream/listen> <message to show>\``)
                                    .setColor('RED')
                              message.channel.send({embeds: [statusembed]});
                              return
                        }
                  } else {
                        client.user.setActivity(args.slice(0).join(" "));
                        const statusembed = new Discord.MessageEmbed()
                              .setDescription(`Set Status to: **PLAYING A GAME ${args.slice(0).join(" ")}** \nDue to adding no args playing was assumed, if this was not your intent the usage of the command is: \`sm_status <online/dnd/idle/clear>\` or \`sm_status <play/watch/stream/listen> <message to show>\``)
                        message.channel.send({embeds: [statusembed]});
                        return;
                  }

            }
      }
}