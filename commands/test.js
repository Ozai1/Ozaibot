const { unix } = require("moment");
const DISCORD_EPOCH = 1420070400000
let nextbumptime = '';
let lastbumptime = '';
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
const convertSnowflakeToDate = (snowflake, epoch = DISCORD_EPOCH) => {
      nextbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      nextbumptime = Number(nextbumptime) + 7200
      lastbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      return
}
const mysql = require('mysql2');
const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const serversdb = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = {
      name: 'test',
      aliases: ['nextbump', 'currenttime', 'a', 'clearvent', 'massping'],
      description: 'whatever the fuck i am testing at the time',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'nextbump') return next_bump(message)
            if (cmd === 'currenttime') return current_time(message)
            if (cmd === 'a') return repeat_message(message, args)
            if (cmd === 'clearvent' || cmd === 'deletevent' || cmd === 'delvent' || cmd === 'clearvent') return delete_vent(message, client, Discord)
            if (cmd === 'massping') {
                  if (userstatus == 1) {
                        if (!args[0]) return message.channel.send('U must add an arg')
                        let content = args.slice(0).join(" ");
                        if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
                        if (message.guild.id == '750558849475280916' || message.guild.id == '698722297229344928') {
                              message.guild.channels.cache.forEach(async (channel, id) => {
                                    if (channel.type === 'text')
                                          channel.send(content).then(message => { message.delete() })
                              })

                        }
                        for (i = 0; i <= 10; i = i + 1) {
                              let channel = await message.guild.channels.create('poo', { type: "text", })
                              setTimeout(() => {
                                    channel.delete()
                              }, 10000);
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                              channel.send(content)
                        }

                        /* User error embed for cmds
                          const bannedembed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('RED')
                              .setDescription(`Invalid member argurment.\n\nProper useage is:\n`mute <member>``)
                        message.channel.send(bannedembed)
                        */
                  }
                  return
            }
      }
}

/* User error embed for cmds
  const bannedembed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor('RED')
      .setDescription(`Invalid member argurment.\n\nProper useage is:\n`mute <member>``)
message.channel.send(bannedembed)
*/

const next_bump = async (message) => {
      let foundtruebump = false;
      await message.channel.messages.fetch({ limit: 50 }).then(messages => {
            messages.forEach(async (message) => {
                  message.embeds.forEach((embed) => {
                        if (foundtruebump === false) {
                              if (embed.description.includes('Bump done! :thumbsup:\n')) {
                                    foundtruebump = true;
                                    console.log('successful bump found, stopping...')
                                    convertSnowflakeToDate(message.id, DISCORD_EPOCH)
                                    let timeleftsecs = (`${nextbumptime - currenttime}`)
                                    if (!timeleftsecs.includes('-')) {
                                          timeleftmins = (`${timeleftsecs / 60}`).split(".")
                                          message.channel.send(`The last bump was at <t:${lastbumptime}>. The next bump will be possible at <t:${nextbumptime}> which is in ${timeleftmins[0]} mins / ${timeleftsecs} seconds.`)
                                    } else {
                                          message.channel.send(`The last bump was at <t:${lastbumptime}>. The next bump is possible now.`)
                                    }
                                    return
                              }
                        }
                  })
            })
      })
      if (foundtruebump === false) {
            message.channel.send('No bump found in the last 50 messages.')
      }
}
async function current_time(message) {
      message.channel.send(`${currenttime}, <t:${currenttime}>, <t:${currenttime}:R>`)
}
async function repeat_message(message, args) {
      if (!args[1]) return
      if (isNaN(args[0])) return
      const howmany = Number(args[0])
      let howmanysent = 0;
      let messagestogo = true;
      let content = args.slice(1).join(" ");
      while (messagestogo) {
            await message.channel.send(`message #${howmanysent + 1}: ${content}`)
            howmanysent = howmanysent + 1;
            if (howmanysent >= howmany) {
                  messagestogo = false;
                  return
            }
      }
}
async function delete_vent(message, client, Discord) {
      if (message.guild.id == '912403495993368576') {
            if (message.channel.id == '912530042846871612') {
                  message.delete().catch(err => { console.log(err) })
                  const options = { limit: 100 };
                  options.before = message.id;
                  await message.channel.messages.fetch(options).then(messages => {
                        let messagesincache = [] // MESSAGES TO BE DELETED WILL GO IN HERE
                        let amountgreaterthan14days = 0; // HOW MANY MESSAGES ARE OLDER THAN 14 DAYS!?!?
                        let totalmessages = 0; // this is for the total messages detected, this will show how many have been detected if the amount detected is less than the amount chosen to delete
                        messages.forEach(async (message2) => {
                              if (message2.author.id == message.author.id) {
                                    totalmessages = totalmessages + 1;
                                    let messagetime = (`${Number(message2.id / 4194304 + DISCORD_EPOCH)}`).slice(0, -7) // what the time of the message was,cut off all decimal places so we are at seconds
                                    if (messagetime.length > 10) {
                                          messagetime = messagetime.slice(0, -1) // if the message time has 1 extra decimal place, cut it the fuck off
                                    }
                                    const messageage = currenttime - messagetime // how old the message is in seconds
                                    if (messageage <= 604740) { // is the message older than 2 weeks? any messages older than 1 week, 6 days, 13 hours, and 59 mins (1 min before a fortnight old) will not be deleted.
                                          messagesincache.push(message2)
                                    } else {
                                          amountgreaterthan14days = amountgreaterthan14days + 1 // for every message older than 14 days it adds one to a counter, by the end this will show how many were too old
                                    }
                              }
                        })
                        message.channel.bulkDelete(messagesincache).catch(err => { // ngl errors shouldnt happen like ever
                              console.log(err);
                              message.reply('There was an error deleting the messages.').catch(err => { console.log(err) })
                              return
                        }).then(() => {
                              message.channel.send('Deleted all of your messages out of the last 100 messages in this channel. Thank you for venting, I hope you are well!').then(message => { message.delete({ timeout: 10000 }).catch(err => { console.log(err) }) }).catch(err => { console.log(err) })
                        })
                  })
            } else return message.channel.send('This command can only be used in <#912530042846871612>.').catch(err => { console.log(err) })
      }


}