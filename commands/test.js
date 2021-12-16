const { unix } = require("moment");
const DISCORD_EPOCH = 1420070400000
let nextbumptime = '';
let lastbumptime = '';
const convertSnowflakeToDate = (snowflake, epoch = DISCORD_EPOCH) => {
      nextbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      nextbumptime = Number(nextbumptime) + 7200
      lastbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      return
}
module.exports = {
      name: 'test',
      aliases: ['nextbump'],
      description: 'whatever the fuck i am testing at the time',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'nextbump') return next_bump(message)
            if (userstatus == 1) {
                  let member = message.guild.members.cache.get(args[0].slice(3, -1))
                  let user = client.users.cache.get(args[0])
                  message.channel.send()
                  /*
                  if (!args[0]) return message.channel.send('U must add an arg')
                  let content = args.slice(0).join(" ");
                  if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
                  if (message.guild.id == '750558849475280916') {
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
                  */
                  /* User error embed for cmds
                    const bannedembed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL())
                        .setColor('RED')
                        .setDescription(`Invalid member argurment.\n\nProper useage is:\n`mute <member>``)
                  message.channel.send(bannedembed)
                  */
            }
      }
}
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
                                    let currenttime = (`${(Date.now(unix))}`).slice(0, -1).slice(0, -1).slice(0, -1)
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