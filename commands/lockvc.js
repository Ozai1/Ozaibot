const mysql = require('mysql2');

require('dotenv').config();
const { Getchannel } = require("../moderationinc")
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      channel: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

module.exports = {
      name: 'lockvc',
      aliases: ['unlockallvcs'],
      description: 'uibgk',
      async execute(message, client, cmd, args, Discord, channelstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (!message.member.permissions.has('ADMINISTRATOR') && userstatus !== 1) return message.channel.send('You do not have access to this command.')
            if (cmd === 'unlockallvcs') {
                  if (userstatus == 1) {
                        for (let i = 0; i < client.lockedvoicechannels.length; i++) {
                              delete client.lockedvoicechannels[i]
                        }
                        message.channel.send('yes')
                        return
                  }
            }
            if (!args[0]) {
                  if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel.\nUsage: \`lockvc [channel]\`')
                  if (client.lockedvoicechannels.includes(message.member.voice.channel.id)) {
                        for (let i = 0; i < client.lockedvoicechannels.length; i++) {
                              if (client.lockedvoicechannels[i] === message.member.voice.channel.id) {
                                    delete client.lockedvoicechannels[i]
                              }
                        }
                        const returnembed = new Discord.MessageEmbed()
                              .setDescription(`<:check:988867881200652348> ${message.member.voice.channel.name} has been un-locked.`)
                              .setColor("GREEN")
                        message.channel.send({ embeds: [returnembed] })
                  } else {
                        client.lockedvoicechannels.push(message.member.voice.channel.id)
                        const returnembed = new Discord.MessageEmbed()
                              .setDescription(`<:check:988867881200652348> ${message.member.voice.channel.name} has been locked.\nTo unlock, use the command again.\nUsage: \`lockvc [channel]\``)
                              .setColor("GREEN")
                        message.channel.send({ embeds: [returnembed] })
                  }
            } else {
                  let channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(args[0].slice(2, -1))
                  if (channel) {
                        if (client.lockedvoicechannels.includes(channel.id)) {
                              for (let i = 0; i < client.lockedvoicechannels.length; i++) {
                                    if (client.lockedvoicechannels[i] === channel.id) {
                                          delete client.lockedvoicechannels[i]
                                    }
                              }
                              const returnembed = new Discord.MessageEmbed()
                                    .setDescription(`<:check:988867881200652348> ${channel.name} has been un-locked.`)
                                    .setColor("GREEN")
                              message.channel.send({ embeds: [returnembed] })
                        } else {
                              client.lockedvoicechannels.push(channel.id)
                              const returnembed = new Discord.MessageEmbed()
                                    .setDescription(`<:check:988867881200652348> ${channel.name} has been locked.\nTo unlock, use the command again.\nUsage: \`lockvc [channel]\``)
                                    .setColor("GREEN")
                              message.channel.send({ embeds: [returnembed] })
                        }
                        return
                  }
                  let possiblechannels = []
                  await message.guild.channels.cache.forEach(channel => {
                        if (channel.name.toLowerCase().includes(args[0].toLowerCase())) {
                              if (channel.type === 'GUILD_VOICE') { possiblechannels.push(`\`#${possiblechannels.length + 1}\` \`${channel.name}\``) }
                        }
                  })
                  if (!possiblechannels[0]) {
                        return message.channel.send('No channel found with that name!')
                  } else if (!possiblechannels[1]) {
                        channel = message.guild.channels.cache.find(channel => channel.name === possiblechannels[0].slice(6, -1));
                        if (client.lockedvoicechannels.includes(channel.id)) {
                              for (let i = 0; i < client.punishnotification.length; i++) {
                                    if (client.punishnotification[i] === channel.id) {
                                          delete client.punishnotification[i]
                                    }
                              }
                              const returnembed = new Discord.MessageEmbed()
                                    .setDescription(`<:check:988867881200652348> ${channel.name} has been un-locked.`)
                                    .setColor("GREEN")
                              message.channel.send({ embeds: [returnembed] })
                        } else {
                              client.lockedvoicechannels.push(channel.id)
                              const returnembed = new Discord.MessageEmbed()
                                    .setDescription(`<:check:988867881200652348> ${channel.name} has been locked.\nTo unlock, use the command again.\nUsage: \`lockvc [channel]\``)
                                    .setColor("GREEN")
                              message.channel.send({ embeds: [returnembed] })
                        }
                        return
                  }
                  if (possiblechannels.length > 9) {
                        return message.channel.send('To many channels found. Please use a more definitive string.')
                  }
                  let printmessage = possiblechannels.filter((a) => a).toString()
                  printmessage = printmessage.replace(/,/g, '\n')
                  const helpembed = new Discord.MessageEmbed()
                        .setTitle('Which of these channels did you mean? Please type out the corrosponding number.')
                        .setFooter({ text: 'Type cancel to cancel the search.' })
                        .setDescription(`${printmessage}`)
                        .setColor('BLUE')
                  let filter = m => m.author.id === message.author.id;
                  return await message.channel.send({ embeds: [helpembed] }).then(async confmessage => {
                        return await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                              message2 = message2.first();
                              message2.delete().catch(err => { });
                              confmessage.delete().catch(err => { });
                              if (message2.content.startsWith('cancel')) {
                                    message.channel.send('Cancelled.')
                                    return 'cancelled'
                              }
                              if (isNaN(message2.content)) {
                                    message2.channel.send('Failed, you are supposed to pick one of the #-numbers.')
                                    return
                              }
                              if (message2.content >= possiblechannels.length + 1) {
                                    message2.channel.send('Failed, that number isnt on the list.')
                                    return
                              }
                              channel = message.guild.channels.cache.find(channel => channel.name === possiblechannels[message2.content - 1].slice(6, -1));
                              if (!channel) {
                                    message.channel.send('failed for whatever reason')
                                    console.error('Was unable to grab channel in Getchannel after multiple channel embed and proper response')
                                    return
                              }
                              if (client.lockedvoicechannels.includes(channel.id)) {
                                    for (let i = 0; i < client.punishnotification.length; i++) {
                                          if (client.punishnotification[i] === channel.id) {
                                                delete client.punishnotification[i]
                                          }
                                    }
                                    const returnembed = new Discord.MessageEmbed()
                                          .setDescription(`<:check:988867881200652348> ${channel.name} has been un-locked.`)
                                          .setColor("GREEN")
                                    message.channel.send({ embeds: [returnembed] })
                              } else {
                                    client.lockedvoicechannels.push(channel.id)
                                    const returnembed = new Discord.MessageEmbed()
                                          .setDescription(`<:check:988867881200652348> ${channel.name} has been locked.\nTo unlock, use the command again.\nUsage: \`lockvc [channel]\``)
                                          .setColor("GREEN")
                                    message.channel.send({ embeds: [returnembed] })
                              }
                        }).catch(collected => {
                              console.log(collected);
                              message.channel.send('Timed out.').catch(err => { console.log(err) });
                              return
                        });
                  });
            }
      }
}