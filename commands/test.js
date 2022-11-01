const { GetMember, GetDisplay, GetPunishmentDuration } = require("../moderationinc")
const { unix } = require("moment");
const fs = require('fs')
const { QueryType } = require('discord-player');
const ytdl = require('ytdl-core');
const DISCORD_EPOCH = 1420070400000
let nextbumptime = '';
let lastbumptime = '';
const imissjansomuchithurts = 1420070400000
const convertSnowflakeToDate = (snowflake, epoch = DISCORD_EPOCH) => {
      nextbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      nextbumptime = Number(nextbumptime) + 7200
      lastbumptime = (`${snowflake / 4194304 + epoch}`).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1).slice(0, -1)
      return
}
const mysql = require('mysql2');

require('dotenv').config();
const connection = mysql.createPool({
      host: '112.213.34.137',
      port: '3306',
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

module.exports = {
      name: 'test',
      aliases: [
            'wait',
            'punccheck',
            'rickroll',
            'addreact',
            'editembed',
            'cexec',
            'randompassword',
            'searchembed',
            'getvideoaudio',
            'speakover',
            'steamid',
            'lemonpurge',
            'youare',
            'sql',
            'botperms',
            'myperms',
            'nextbump',
            'currenttime',
            'a',
            'massping',
            'massmessage',
            'serverpurge',
            'apprespond',
            'msgl',
            'drag',
            'ghostjoin',
            'deletemessage',
            'oldpurgeall',
            'role',
            'givegf',
            'givebf'
      ],
      description: 'whatever the fuck i am testing at the time',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (cmd === 'nextbump') return next_bump(message)
            if (cmd === 'currenttime') return current_time(message)
            if (cmd === 'a') return repeat_message(message, args, userstatus)
            if (cmd === 'massping') return mass_message(message, args, userstatus)
            if (cmd === 'msgl') return message_length(message, args)
            if (cmd === 'drag') return drag_user(message, args, userstatus, Discord, client)
            if (cmd === 'ghostjoin') return ghost_join(message, args, client, userstatus)
            if (cmd === 'deletemessage') return delete_message(message, args, client, userstatus)
            if (cmd === 'oldpurgeall') return chat_crawler(message, userstatus, client)
            if (cmd === 'role') return chercord_role(message, args)
            if (cmd === 'youare') return youare(message, args, userstatus)
            if (cmd === 'myperms') return my_perms(message, userstatus, Discord)
            if (cmd === 'botperms') return bot_perms(message, userstatus, Discord)
            if (cmd === 'sql') return self_sql(message, args, Discord)
            if (cmd === 'steamid') return convert_steam_id(message, args)
            if (cmd === 'getvideoaudio') return Command_GetYTVideoAudio(message, args, userstatus)
            if (cmd === 'searchembed') return search_embed(message, args, userstatus, client)
            if (cmd === 'randompassword') return random_password(message, args)
            if (cmd === 'cexec') return command_cexec(message, args, userstatus, client, Discord)
            if (cmd === 'editembed') return edit_embed(message, args, userstatus, client, Discord)
            if (cmd === 'addreact') return add_reaction(message, args, userstatus, client, Discord)
            if (cmd === 'rickroll') return rick_roll_channel(message, args, userstatus, client, Discord)
            if (cmd === 'punccheck') return Punctuation_check(message, args)
            if (cmd === 'wait') return command_wait(message, args, userstatus, client, Discord)
            if (cmd === 'givegf') return Comamnd_givegf(message, args, client, Discord)
            if (cmd === 'givebf') return Comamnd_givegf(message, args, client, Discord)
            if (userstatus == 1) {

            }
      }
}
async function Comamnd_givegf(message, args, client, Discord) {
      cats = ["Not possible", "Done", "Done, ETA four years, seven months, ten days", "No lol", "L DESPERATE", "Negative"];
      var random = cats[Math.floor(Math.random() * cats.length)];
      message.channel.send(random)
}

let uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
async function Punctuation_check(message, args) {
      let text = args.slice(0).join(" ");
      let uppercasefound = 0;
      let punctuationsymbolsfound = 0;
      let fullstopsfound = 0;
      let commasfound = 0;
      let questionmarksfound = 0;
      let esclimationmarksfound = 0;
      text.split("").forEach(letter => {
            if (uppercase.includes(letter)) {
                  uppercasefound = Number(uppercasefound + 1)
            } else if (letter === '.') {
                  punctuationsymbolsfound = Number(punctuationsymbolsfound + 1)
                  fullstopsfound = fullstopsfound + 1
            } else if (letter === ',') {
                  punctuationsymbolsfound = Number(punctuationsymbolsfound) + 1
                  commasfound = commasfound + 1
            } else if (letter === '?') {
                  questionmarksfound = questionmarksfound + 1
                  punctuationsymbolsfound = punctuationsymbolsfound + 1
            } else if (letter === '!') {
                  esclimationmarksfound = esclimationmarksfound + 1
                  punctuationsymbolsfound = punctuationsymbolsfound + 1
            }
      })
      message.channel.send(`Total characters: ${text.length}.\nTotal uppercase characters: ${uppercasefound}\nTotal punctuation symbols: ${punctuationsymbolsfound}\nFull stops: ${fullstopsfound}\nCommas: ${commasfound}\nQuestionmarks: ${questionmarksfound}`)
}

async function rick_roll_channel(message, args, userstatus, client, Discord) {
      if (userstatus == 1) {
            if (!args[0]) return message.channel.send('Idiot')
            let channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(args[0].slice(2, -1))
            if (!channel) return message.channel.send('Invalid channel.')
            const res = await client.player.search('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
                  requestedBy: message.member,
                  searchEngine: QueryType.AUTO
            });

            const queue = await client.player.createQueue(message.guild, {
                  leaveOnEnd: client.musicConfig.opt.voiceConfig.leaveOnEnd,
                  autoSelfDeaf: false,
                  metadata: channel
            });

            await queue.connect(channel)
            queue.addTrack(res.tracks[0]);
            queue.setVolume(50);
            await queue.play();
      }
}

async function add_reaction(message, args, userstatus, client, Discord) {
      if (userstatus == 1) {
            if (!args[0]) return message.channel.send('usage: sm_addreact [react] [react2]... ')
            let channel = client.channels.cache.get(args[0].slice(48, -19))
            if (!channel) return message.channel.send('could not find that channel, invalid link or the bot isnt in that server')
            let message2 = await channel.messages.fetch(args[0].slice(67));
            if (!message2) return message.channel.send('could not find that message, channel was found though')
            args.forEach(arg => {
                  if (args[0] === arg) { } else {
                        message2.react(`${arg}`).catch(err => console.log(err))
                  }
            })
      } else { return message.reply('You do not have access to this command.') }
}

async function edit_embed(message, args, userstatus, client, Discord) {
      if (userstatus == 1) {
            if (!args[1]) return message.channel.send('usage: sm_editembed <description|title|colour> <message_link> [content|colour]')
            let channel = client.channels.cache.get(args[1].slice(48, -19))
            if (!channel) return message.channel.send('could not find that channel, invalid link or the bot isnt in that server')
            let message2 = await channel.messages.fetch(args[1].slice(67));
            if (!message2) return message.channel.send('could not find that message, channel was found though')
            if (!message2.author.id == client.user.id) return message.channel.send('That message isnt even mine idiot, cant edit it.')
            if (!message2.embeds.length > 0) return message.channel.send('This message doesnt have any embeds.')
            let themebed = message2.embeds[0]
            let description = themebed.description
            let colour = themebed.color
            let title = themebed.title
            let contentorwhatever = args.slice(2).join(" ");
            if (!contentorwhatever) return message.channel.send('add smth')
            let newmembed = new Discord.MessageEmbed()
            if (args[0] === 'description') {

                  newmembed.setDescription(contentorwhatever)
                  if (title) {
                        newmembed.setTitle(title)
                  } if (colour) {
                        newmembed.setColor(colour)
                  }
                  return message2.edit({ embeds: [newmembed] })
            } if (args[0] === 'title') {
                  newmembed.setTitle(contentorwhatever)
                  if (description) {
                        newmembed.setDescription(description)
                  } if (colour) {
                        newmembed.setColor(colour)
                  }
                  return message2.edit({ embeds: [newmembed] })
            } if (args[0] === 'colour') {
                  newmembed.setColor(contentorwhatever)
                  if (description) {
                        newmembed.setDescription(title)
                  } if (title) {
                        newmembed.setTitle(title)
                  }
                  return message2.edit({ embeds: [newmembed] })
            }
      } else { return message.reply('You do not have access to this command.') }
}

async function command_cexec(message, args, userstatus, client, Discord) {
      if (userstatus == 1) {
            if (!args[1]) return
            let member = await GetMember(message, client, args[0], Discord, true, true)
            if (!member) return message.channel.send('invalid member')
            if (member.id == '508847949413875712') return
            userstatus = client.userstatus.get(message.author.id)
            message.author = member.user
            message.member = member
            args.shift()
            message.content = args.toString().replace(/,/g, ``)
            let cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
            if (command) command.execute(message, client, cmd, args, Discord, userstatus)
      } else { return message.reply('https://tenor.com/view/fun-fact-no-gif-20678158') }
}

async function command_wait(message, args, userstatus, client, Discord) {
      if (userstatus == 1) {
            if (!args[1]) return message.channel.send('Usage: `sm_wait <seconds> <command>`')
            if (isNaN(args[0])) return message.channel.send('Invalid time, Usage: `sm_wait <seconds> <command>`')
            setTimeout(() => {
                  message.content = args.toString().replace(/,/g, ``)
                  args.shift()
                  let cmd = args.shift().toLowerCase();
                  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
                  if (command) command.execute(message, client, cmd, args, Discord, userstatus)
            }, args[0] * 1000);
      } else { return message.reply('You do not have access to this command.') }
}

async function random_password(message, args,) {
      if (!args[0]) return message.channel.send('Please specify a length for the password to be. EG `sm_randompassword 6`')
      if (isNaN(args[0])) return message.channel.send('Please specify a length for the password to be. EG `sm_randompassword 6`')
      return message.channel.send(randomStringMake(args[0]))
}

const randomStringMake = (count) => {
      const letter = "0123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzKLMNOPQRSTUVWXYZ0123456789abcdefghiABCDEFGHIJKLMNOPQRST0123456789jklmnopqrstuvwxyz";
      let randomString = "";
      for (let i = 0; i < count; i++) {
            const randomStringNumber = Math.floor(1 + Math.random() * (letter.length - 1));
            randomString += letter.substring(randomStringNumber, randomStringNumber + 1);
      }
      return randomString
}

async function search_embed(message, args, userstatus, client) {
      if (userstatus == 1) {
            if (!args[0]) return message.channel.send('add a message link idiot')
            let channel = client.channels.cache.get(args[0].slice(48, -19))
            if (!channel) return message.channel.send('could not find that channel, invalid link or the bot isnt in that server')
            let message2 = await channel.messages.fetch(args[0].slice(67));
            if (!message2) return message.channel.send('could not find that message, channel was found though')
            message.react('✅').catch(err => { console.log(err) });
            if (message2.embeds.length > 0) {
                  message.channel.send(`Embed:\ncolour: ${message2.embeds[0].color}`)
            } else {
                  return message.channel.send('That message has no embeds')
            }
      }
}

async function Command_GetYTVideoAudio(message, args, userstatus) {
      if (userstatus == 1 || message.author.id == '174095706653458432' || message.author.id == '368587996112486401' || message.author.id == '325520772980539393' || userstatus == 2) {
            const confmessage = await message.channel.send('searching')
            if (!args[0]) return confmessage.edit('Invalid link')
            if (!ytdl.validateURL(args[0])) return confmessage.edit('Invalid link')
            try {
                  const stream = ytdl(args[0], { filter: 'audioonly', highWaterMark: 1024 * 1024 * 1 })
                  confmessage.edit('Video found; fetching audio now...')
                  stream.pipe(fs.createWriteStream('audio.mp3')).on('finish', async finish => {
                        await confmessage.edit({ files: ["./audio.mp3"], content: 'Finished:' })
                        fs.unlinkSync('./audio.mp3')
                        stream.destroy()
                  })
            } catch (err) {
                  confmessage.edit(err)
            }

      }
}

async function convert_steam_id(message, args) {
      if (!args[0]) return message.channel.send('U needa add the steamid');
      message.channel.send(`#${args[0].replace(/:/g, '_')}`)
}

async function self_sql(message, args, Discord) {
      if (message.author.id == '508847949413875712') {
            if (args[0].toLowerCase() === 'tables') {
                  return message.channel.send(`this needs to be manually updated :sob:
            activebans
            applications
            chercordcount
            chercordrole
            chercordver
            usedinvites
            lockdownlinks
            prefixes
            privservers
            totalcmds
            userstatus
            whitelist
            activeinvites
            `)
            } else if (!args[0]) return message.channel.send('Add an arg')
            query = args.slice(0).join(" ");
            data = []
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log(error)
                        return message.channel.send('Errored\n' + error)
                  } else {
                        if (results.serverStatus) {
                              message.channel.send(`Successful.\n${results.affectedRows} rows affected.`)
                        } else {
                              if (results.length > 4000) {
                                    results = results.slice(logs.length - 4000)
                              }
                              const caseembed = new Discord.MessageEmbed()
                                    .setColor('BLUE')
                                    .setDescription(`Results:\n${JSON.stringify(results, null, 4).slice(1, -1)}`)
                              message.channel.send({ embeds: [caseembed] })
                        }
                        console.log(results)
                  }
            })
      } else {
            message.channel.send('Successful: Dropped all tables in 0.030 seconds.')
      }
}
async function my_perms(message, userstatus, Discord) {
      if (userstatus == 1) {
            let printtext = '';
            if (message.member.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('You have administrator permissions.')
            }
            if (message.member.permissions.has('BAN_MEMBERS')) {
                  printtext = printtext + 'Ban\n';
            }
            if (message.member.permissions.has('KICK_MEMBERS')) {
                  printtext = printtext + 'Kick\n';
            }
            if (message.member.permissions.has('MANAGE_CHANNELS')) {
                  printtext = printtext + 'Manage Channels\n';
            }
            if (message.member.permissions.has('MANAGE_GUILD')) {
                  printtext = printtext + 'Manage Server\n';
            }
            if (message.member.permissions.has('MANAGE_MESSAGES')) {
                  printtext = printtext + 'Manage Messages\n';
            }
            if (message.member.permissions.has('MANAGE_ROLES')) {
                  printtext = printtext + 'Manage Roles\n';
            }
            if (message.member.permissions.has('CREATE_INSTANT_INVITE')) {
                  printtext = printtext + 'Create Invites\n';
            }
            if (message.member.permissions.has('SEND_MESSAGES')) {
                  printtext = printtext + 'Send Messages\n';
            }
            if (message.member.permissions.has('VIEW_AUDIT_LOG')) {
                  printtext = printtext + 'View Audit Log\n';
            }
            if (message.member.permissions.has('ADD_REACTIONS')) {
                  printtext = printtext + 'Add Reactions\n';
            }
            if (message.member.permissions.has('EMBED_LINKS')) {
                  printtext = printtext + 'Embed Links\n';
            }
            if (message.member.permissions.has('ATTACH_FILES')) {
                  printtext = printtext + 'Attach Files\n';
            }
            if (message.member.permissions.has('READ_MESSAGE_HISTORY')) {
                  printtext = printtext + 'Read Message History\n';
            }
            if (message.member.permissions.has('MENTION_EVERYONE')) {
                  printtext = printtext + 'Mention @ everyone, @ here and all roles\n';
            }
            if (message.member.permissions.has('USE_EXTERNAL_EMOJIS')) {
                  printtext = printtext + 'Use External Emojis\n';
            }
            if (message.member.permissions.has('CONNECT')) {
                  printtext = printtext + 'Connect to Channels\n';
            }
            if (message.member.permissions.has('SPEAK')) {
                  printtext = printtext + 'Speak in Channels\n';
            }
            if (message.member.permissions.has('MUTE_MEMBERS')) {
                  printtext = printtext + 'Voice Mute\n';
            }
            if (message.member.permissions.has('DEAFEN_MEMBERS')) {
                  printtext = printtext + 'Voice Deafen\n';
            }
            if (message.member.permissions.has('MOVE_MEMBERS')) {
                  printtext = printtext + 'Voice Drag and Disconnect\n';
            }
            if (message.member.permissions.has('CHANGE_NICKNAME')) {
                  printtext = printtext + 'Rename Self\n';
            }
            if (message.member.permissions.has('MANAGE_NICKNAMES')) {
                  printtext = printtext + 'Rename Others\n';
            }
            if (message.member.permissions.has('MANAGE_WEBHOOKS')) {
                  printtext = printtext + 'Manage WebHooks\n';
            }
            if (message.member.permissions.has('MANAGE_EMOJIS')) {
                  printtext = printtext + 'Manage Emojis';
            }
            const permsembed = new Discord.MessageEmbed()
                  .setTitle('List of permissions that are set to true.')
                  .setDescription(printtext)
                  .setTimestamp()
            return message.channel.send(permsembed)
      }
}
async function bot_perms(message, userstatus, Discord) {
      if (userstatus == 1) {
            let printtext = '';
            if (message.guild.me.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('I have administrator permissions.')
            }
            if (message.guild.me.permissions.has('BAN_MEMBERS')) {
                  printtext = printtext + 'Ban\n';
            }
            if (message.guild.me.permissions.has('KICK_MEMBERS')) {
                  printtext = printtext + 'Kick\n';
            }
            if (message.guild.me.permissions.has('MANAGE_CHANNELS')) {
                  printtext = printtext + 'Manage Channels\n';
            }
            if (message.guild.me.permissions.has('MANAGE_GUILD')) {
                  printtext = printtext + 'Manage Server\n';
            }
            if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                  printtext = printtext + 'Manage Messages\n';
            }
            if (message.guild.me.permissions.has('MANAGE_ROLES')) {
                  printtext = printtext + 'Manage Roles\n';
            }
            if (message.guild.me.permissions.has('CREATE_INSTANT_INVITE')) {
                  printtext = printtext + 'Create Invites\n';
            }
            if (message.guild.me.permissions.has('SEND_MESSAGES')) {
                  printtext = printtext + 'Send Messages\n';
            }
            if (message.guild.me.permissions.has('VIEW_AUDIT_LOG')) {
                  printtext = printtext + 'View Audit Log\n';
            }
            if (message.guild.me.permissions.has('ADD_REACTIONS')) {
                  printtext = printtext + 'Add Reactions\n';
            }
            if (message.guild.me.permissions.has('EMBED_LINKS')) {
                  printtext = printtext + 'Embed Links\n';
            }
            if (message.guild.me.permissions.has('ATTACH_FILES')) {
                  printtext = printtext + 'Attach Files\n';
            }
            if (message.guild.me.permissions.has('READ_MESSAGE_HISTORY')) {
                  printtext = printtext + 'Read Message History\n';
            }
            if (message.guild.me.permissions.has('MENTION_EVERYONE')) {
                  printtext = printtext + 'Mention @ everyone, @ here and all roles\n';
            }
            if (message.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
                  printtext = printtext + 'Use External Emojis\n';
            }
            if (message.guild.me.permissions.has('CONNECT')) {
                  printtext = printtext + 'Connect to Channels\n';
            }
            if (message.guild.me.permissions.has('SPEAK')) {
                  printtext = printtext + 'Speak in Channels\n';
            }
            if (message.guild.me.permissions.has('MUTE_MEMBERS')) {
                  printtext = printtext + 'Voice Mute\n';
            }
            if (message.guild.me.permissions.has('DEAFEN_MEMBERS')) {
                  printtext = printtext + 'Voice Deafen\n';
            }
            if (message.guild.me.permissions.has('MOVE_MEMBERS')) {
                  printtext = printtext + 'Voice Drag and Disconnect\n';
            }
            if (message.guild.me.permissions.has('CHANGE_NICKNAME')) {
                  printtext = printtext + 'Rename Self\n';
            }
            if (message.guild.me.permissions.has('MANAGE_NICKNAMES')) {
                  printtext = printtext + 'Rename Others\n';
            }
            if (message.guild.me.permissions.has('MANAGE_WEBHOOKS')) {
                  printtext = printtext + 'Manage WebHooks\n';
            }
            if (message.guild.me.permissions.has('MANAGE_EMOJIS')) {
                  printtext = printtext + 'Manage Emojis';
            }
            const permsembed = new Discord.MessageEmbed()
                  .setTitle('List of permissions that are set to true.')
                  .setDescription(printtext)
                  .setTimestamp()
            return message.channel.send(permsembed)
      }
}
async function youare(message, args, userstatus) {
      // if (message.guild.id == '942731536770428938') {
      //       const kamrole = message.guild.roles.cache.get('951030382919299072')
      //       if (!kamrole) return message.channel.send('No kamrole found')
      //       if (userstatus !== 1) {
      //             if (!message.member.roles.cache.has('951030382919299072')) return message.channel.send('You must have the kamukura role to identify people.')
      //       }
      //       if (!args[0]) return message.channel.send('add ping `sm_youare @user`')
      //       const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
      //       if (!member) return message.channel.send('no member')
      //       const unknrole = message.guild.roles.cache.get('948788992961306695')
      //       message.channel.send(`Hello ${member}!`)
      //       setTimeout(() => {
      //             member.roles.remove(unknrole)
      //             let query = `INSERT INTO chercordver (userid, username, serverid) VALUES (?, ?, ?)`;
      //             let data = [member.id, member.user.username, message.guild.id];
      //             connection.query(query, data, function (error, results, fields) {
      //                   if (error) {
      //                         return console.log(error)
      //                   }
      //                   return
      //             })
      //       }, 2000);
      // } else 
      if (message.guild.id == '806532573042966528') {
            const queenrole = message.guild.roles.cache.get('806533084442263552')
            const adminrole = message.guild.roles.cache.get('933455230950080642')
            const unvrole = message.guild.roles.cache.get('922514880102277161')
            const modrole = message.guild.roles.cache.get('907742217383321670')
            if (!queenrole || !adminrole || !unvrole || !modrole) return message.channel.send('Either the Queen bitchass, Admin role, the unverified role or the moderator role has been removed therefor the permissions for this command have been changed and the command cannot be used properly.')
            if (userstatus !== 1) {
                  if (!message.member.roles.cache.has('806533084442263552') && !message.member.roles.cache.has('933455230950080642')&& !message.member.roles.cache.has('907742217383321670') && !userstatus == 1) return message.channel.send('You do not have access to this command.')
            }
            if (!args[0]) return message.channel.send('Add a member. Usage: `sm_youare @user`')
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.channel.send('Invalid member.')
            message.channel.send(`Hello ${member}!`)
            setTimeout(() => {
                  member.roles.remove(unvrole)
                  let query = `INSERT INTO chercordver (userid, username, serverid) VALUES (?, ?, ?)`;
                  let data = [member.id, member.user.username, message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error) {
                              return console.log(error)
                        }
                        return
                  })
            }, 2000);
      }
}
async function chercord_role(message, args) {
      if (message.guild.id !== '942731536770428938' && message.guild.id !== '806532573042966528' && message.guild.id !== '980786048210718770') return message.channel.send('This command is intended for a private server only.')
      if (message.guild.id == '806532573042966528') {
            let boosterrole = message.guild.roles.cache.get('907043792648032347')
            if (!boosterrole) return message.channel.send('Could not find booster role.')
            if (message.guild.id !== '980786048210718770')
                  if (!message.member.roles.cache.has('907043792648032347') && !message.member.roles.cache.has('933455230950080642') && !message.member.roles.cache.has('806533084442263552') && !userstatus == 1) return message.channel.send('The ability to edit & create your own role is for server boosters only.')
      }
      if (!args[0]) {
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, async function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        let blossomrole = null;
                        if (message.guild.id == '942731536770428938') {
                              blossomrole = message.guild.roles.cache.get('942791591725252658')
                        } else if (message.guild.id == '806532573042966528') {
                              blossomrole = message.guild.roles.cache.get('907043792648032347')
                        }
                        if (message.guild.id !== '980786048210718770') {
                              if (!blossomrole) message.channel.send('Could not find the blossom role if this is cherry cord or the server booster role if this is rainy, this is fatal to the command.')
                              let newrole = await message.guild.roles.create({
                                    name: message.author.tag,
                                    position: blossomrole + 1,
                              }).catch(err => {
                                    console.log(err);
                                    message.channel.send('Failed to create a role.');
                              });
                              message.guild.members.cache.get(message.author.id).roles.add(newrole)
                              query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                              data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) {
                                          console.log('backend error for checking active bans')
                                          return console.log(error)
                                    }
                                    message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                              })
                        } else {
                              let newrole = await message.guild.roles.create({
                                    name: message.author.tag,
                              }).catch(err => {
                                    console.log(err);
                                    message.channel.send('Failed to create a role.');
                              });
                              message.guild.members.cache.get(message.author.id).roles.add(newrole)
                              query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                              data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                              connection.query(query, data, function (error, results, fields) {
                                    if (error) {
                                          console.log('backend error for checking active bans')
                                          return console.log(error)
                                    }
                                    message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                              })
                        }
                  } else {
                        for (row of results) {
                              let oldroleid = row["roleid"];
                              let oldrole = message.guild.roles.cache.get(oldroleid)
                              if (oldrole) {
                                    message.member.roles.add(oldrole)
                                    message.channel.send('You already have a role! You have been given it back, try not lose it again!')
                              } else {
                                    let filter = m => m.author.id === message.author.id;
                                    message.channel.send(`Your role seems to have been deleted, would you like a new one to be made? \`y\`/\`n\``).then(() => {
                                          message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message => {
                                                message = message.first();
                                                if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                                      query = `DELETE FROM chercordrole WHERE userid = ? && serverid = ?`;
                                                      data = [message.author.id, message.guild.id]
                                                      connection.query(query, data, async function (error, results, fields) {
                                                            if (error) {
                                                                  console.log('backend error for checking active bans')
                                                                  return console.log(error)
                                                            }
                                                      })
                                                      if (message.guild.id !== '980786048210718770') {
                                                            if (!blossomrole) message.channel.send('Could not find the blossom role if this is cherry cord or the server booster role if this is rainy, this is fatal to the command.')
                                                            let newrole = await message.guild.roles.create({
                                                                  name: message.author.tag,
                                                                  position: blossomrole + 1,
                                                            }).catch(err => {
                                                                  console.log(err);
                                                                  message.channel.send('Failed to create a role.');
                                                            });
                                                            message.guild.members.cache.get(message.author.id).roles.add(newrole)
                                                            query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                                                            data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                                                            connection.query(query, data, function (error, results, fields) {
                                                                  if (error) {
                                                                        console.log('backend error for checking active bans')
                                                                        return console.log(error)
                                                                  }
                                                                  message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                                                            })
                                                      } else {
                                                            let newrole = await message.guild.roles.create({
                                                                  name: message.author.tag,
                                                            }).catch(err => {
                                                                  console.log(err);
                                                                  message.channel.send('Failed to create a role.');
                                                            });
                                                            message.guild.members.cache.get(message.author.id).roles.add(newrole)
                                                            query = `INSERT INTO chercordrole (userid, roleid, serverid, username) VALUES (?, ?, ?, ?)`;
                                                            data = [message.author.id, newrole.id, message.guild.id, message.author.username]
                                                            connection.query(query, data, function (error, results, fields) {
                                                                  if (error) {
                                                                        console.log('backend error for checking active bans')
                                                                        return console.log(error)
                                                                  }
                                                                  message.channel.send('Created a role for you!! You now have it! You can name and color your role using `sm_role name <the roles name>` and `sm_role color <color>`')
                                                            })
                                                      }
                                                } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                                      message.channel.send('Ok')
                                                } else {
                                                      message.channel.send('Invalid response, `y`/`n` required.')
                                                }
                                          }).catch(collected => {
                                                message.channel.send('Timed out').then(message => message.delete({ timeout: 5000 })).catch(err => { console.log(err) });
                                          });
                                    });
                              }
                        }
                  }
            })
      } else if (args[0].toLowerCase() === 'color' || args[0].toLowerCase() === 'colour') {
            if (!args[1]) return message.channel.send('might wanna add a color.')
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        message.channel.send('You do not currently have a role. Please make one using `sm_role`!!')
                  } else {
                        for (row of results) {
                              let roleid = row["roleid"]
                              let usersrole = message.guild.roles.cache.get(roleid)
                              if (!usersrole) return message.channel.send('It seems like you have a role but it was deleted. Use `sm_role` to generate a new one.')
                              if (args[1].startsWith('#')) {
                                    if (args[1] === '#FFC2CC') return message.channel.send('Sorry, that is the only color which I wont allow.')
                                    usersrole.edit({ color: args[1] }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'green') {
                                    usersrole.edit({ color: '#00FF00' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'red') {
                                    usersrole.edit({ color: '#FF0000' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'blue') {
                                    usersrole.edit({ color: '#0000FF' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'brown') {
                                    usersrole.edit({ color: '#964B00' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'pink') {
                                    usersrole.edit({ color: '#FFC0CB' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'lightblue') {
                                    usersrole.edit({ color: '#ADD8E6' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'lightgreen') {
                                    usersrole.edit({ color: '#90ee90' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'orange') {
                                    usersrole.edit({ color: '#FFA500' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'purple') {
                                    usersrole.edit({ color: '#A020F0' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else if (args[1].toLowerCase() === 'black') {
                                    usersrole.edit({ color: '#020202' }).catch(err => { console.log(err) })
                                    message.channel.send('Role color edited.')
                              } else {
                                    return message.channel.send('Colour not found.')
                              }
                        }
                  }
            })
      } else if (args[0].toLowerCase() === 'name') {
            if (!args[1]) return message.channel.send('might wanna add a name.')
            let query = `SELECT * FROM chercordrole WHERE userid = ? && serverid = ?`;
            let data = [message.author.id, message.guild.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                  }
                  if (results == '' || results === undefined) {
                        message.channel.send('You do not currently have a role. Please make one using `sm_role`!!')
                  } else {
                        for (row of results) {
                              let roleid = row["roleid"]
                              let usersrole = message.guild.roles.cache.get(roleid)
                              if (!usersrole) return message.channel.send('It seems like you have a role but it was deleted. Use `sm_role` to generate a new one.')
                              usersrole.edit({ name: args.slice(1).join(" ") }).catch(err => { console.log(err) })
                              message.channel.send('Role name edited.')
                        }
                  }
            })
      }
}
async function chat_crawler(message, userstatus, client) {
      if (userstatus == 1) {
            const confmessage = await message.channel.send('OK, this will take ages.')
            let messagesincache = []
            const options = { limit: 100 };
            options.before = message.id;
            await message.channel.messages.fetch(options).then(messages => {
                  messages.forEach(message2 => {
                        messagesincache.push(message2)
                  });
            })
            confmessage.edit('deleteing...')
            for (i = 0; i <= messagesincache.length; i = i + 1) {
                  setTimeout(() => {
                        if (!messagesincache[0]) return confmessage.edit('done')
                        message.channel.messages.delete(messagesincache[0]).catch(err => { console.log(err) })
                        messagesincache.shift()
                  }, i + 1 * 1000);
            }
      }
}
/* User error embed for cmds
                          const bannedembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor('RED')
                              .setDescription(`Invalid member argurment.\n\nProper useage is:\n`mute <member>``)
                        message.channel.send(bannedembed)
                        */
async function delete_message(message, args, client, userstatus) {
      if (userstatus == 1) {
            if (!args[0]) return message.author.send('add a message link idiot')
            let channel = client.channels.cache.get(args[0].slice(48, -19))
            if (!channel) return message.author.send('could not find that channel, invalid link or the bot isnt in that server')
            let message2 = await channel.messages.fetch(args[0].slice(67));
            if (!message2) return message.author.send('could not find that message, channel was found though')
            message.react('✅').catch(err => { console.log(err) });
            message2.delete().catch(err => {
                  console.log(err);
                  message.author.send('could not delete the message, it was found though');
            })
      }
}
async function ghost_join(message, args, client, userstatus) {
      if (userstatus == 1 || userstatus == 2) {
            if (!args[0]) return message.channel.send('Idiot')
            let channel = client.channels.cache.get(args[0]) || client.channels.cache.get(args[0].slice(2, -1))
            if (!channel) return message.channel.send('Invalid channel.')

            const { joinVoiceChannel } = require('@discordjs/voice');
            const connection = joinVoiceChannel({
                  channelId: channel.id,
                  guildId: channel.guild.id,
                  adapterCreator: channel.guild.voiceAdapterCreator,
            });
            connection.destroy();
      }
}
async function drag_user(message, args, userstatus, Discord, client) {
      if (userstatus == 1 || message.member.permissions.has('ADMINISTRATOR') ||userstatus == 2) {
            if (!message.guild.me.permissions.has('ADMINISTRATOR')) return message.channel.send('I dont have admin perms in this server');
            if (!args[1]) return message.channel.send('Usage: sm_drag <channel> <user | vc>');
            let channel = message.guild.channels.cache.get(args[0].slice(2, -1)) || message.guild.channels.cache.get(args[0]);
            let possiblechannels = [];
            if (!channel) {
                  message.guild.channels.cache.forEach(channel => {
                        if (channel.type === 'GUILD_VOICE') {
                              if (channel.name.toLowerCase().includes(args[0].toLowerCase())) {
                                    possiblechannels.push(`#${possiblechannels.length} ${channel.name}`)
                              }
                        }
                  })
                  if (!possiblechannels[0]) {
                        return message.channel.send('Could not find a channel with that name or a channel that has that in its name.')
                  }
                  if (!possiblechannels[1]) {
                        let channel2 = message.guild.channels.cache.find(channel => channel.name === possiblechannels[0].slice(3));
                        if (!channel2 || !channel2.type === 'GUILD_VOICE') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                        if (!args[1]) {
                              message.member.voice.setChannel(channel2).catch(err => { console.log(err) });
                        } else if (args[1].toLowerCase() === 'vc') {
                              message.member.voice.channel.members.forEach(member => {
                                    if (member.voice.channel) {
                                          member.voice.setChannel(channel2).catch(err => { console.log(err) })
                                    }
                              })
                              return
                        } else {
                              args.forEach(async singlearg => {
                                    let member = await GetMember(message, client, singlearg, Discord, false, false)
                                    if (member) {
                                          member.voice.setChannel(channel2).catch(err => { console.log(err) });
                                    }
                              })
                        }
                        return
                  }
                  if (possiblechannels.length > 9) message.channel.send('To many possible channels from that name, use a more definitive string.')
                  const helpembed = new Discord.MessageEmbed()
                        .setTitle('Which of these channels did you mean? Please type out the corrosponding number.')
                        .setDescription(possiblechannels)
                        .setColor('BLUE')
                  let filter = m => m.author.id === message.author.id;
                  await message.channel.send({ embeds: [helpembed] }).then(confmessage => {
                        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                              message2 = message2.first();
                              message2.delete().catch(err => { })
                              confmessage.delete().catch(err => { })
                              if (isNaN(message2.content)) return message2.channel.send('Failed, you are supposed to pick one of the channels #-numbers.')
                              if (message2.content >= possiblechannels.length) return message2.channel.send('Failed, that number isnt on the list.')
                              let channel2 = message2.guild.channels.cache.find(channel => channel.name === possiblechannels[message2.content].slice(3));
                              if (!channel2 || !channel2.type === 'GUILD_VOICE') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                              if (!args[1]) {
                                    message2.member.voice.setChannel(channel2).catch(err => { console.log(err) });
                              } else if (args[1].toLowerCase() === 'vc') {
                                    message2.member.voice.channel.members.forEach(member => {
                                          if (member.voice.channel) {
                                                member.voice.setChannel(channel2).catch(err => { console.log(err) })
                                          }
                                    })
                                    return
                              } else {
                                    args.forEach(async singlearg => {
                                          let member = await GetMember(message, client, singlearg, Discord, false, false)
                                          if (member) {
                                                member.voice.setChannel(channel2).catch(err => { console.log(err) });
                                          }
                                    })
                              }
                              return
                        }).catch(collected => {
                              console.log(collected)
                              return message.channel.send('Timed out').catch(err => { console.log(err) })
                        });
                  });
            } else {
                  if (!channel.type === 'GUILD_VOICE') return message.author.send('Usage is `sm_drag <channel> <user|vc> <user> <user> etc`\nuser(s) are optional');
                  if (!args[1]) {
                        message.member.voice.setChannel(channel).catch(err => { console.log(err) });
                  } else if (args[1].toLowerCase() === 'vc') {
                        message.member.voice.channel.members.forEach(member => {
                              if (member.voice.channel) {
                                    member.voice.setChannel(channel).catch(err => { console.log(err) })
                              }
                        })
                        return
                  } else {
                        args.forEach(singlearg => {
                              let member = message.guild.members.cache.get(singlearg.slice(3, -1)) || message.guild.members.cache.get(singlearg) || message.guild.members.cache.get(singlearg.slice(2, -1));
                              if (member) {
                                    member.voice.setChannel(channel).catch(err => { console.log(err) });
                              }
                        })
                  }
            }
      }
}
async function message_length(message) {
      return message.channel.send(`${message.content.length - 8}`).catch(err => { console.log(err) })
}
async function mass_message(message, args, userstatus) {
      if (userstatus == 1) {
            if (!args[0]) return message.channel.send('U must add an arg')
            let content = args.slice(0).join(" ");
            if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.')
            if (message.guild.id == '750558849475280916' || message.guild.id == '698722297229344928') {
                  message.guild.channels.cache.forEach(async (channel, id) => {
                        if (channel.type === 'text') {
                              channel.send(content).then(message => { message.delete() })
                        }
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
      }
}

async function next_bump(message) {
      const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
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
      const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
      message.channel.send(`${currenttime}, <t:${currenttime}>, <t:${currenttime}:R>`)
}
async function repeat_message(message, args, userstatus) {
      if (userstatus == 1) {
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
}
