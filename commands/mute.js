const { unix } = require('moment');
const mysql = require('mysql2');
const { GetMember, GetDisplay, GetPunishmentDuration, LogPunishment, NotifyUser, HasPerms } = require("../moderationinc")

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
      name: 'mute',
      aliases: ['m'],
      description: 'mutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.guild) return message.channel.send('This command must be used in a server.')
            if (userstatus !== 1) {
                  let perms = await HasPerms(message, message.member, client, 'c', 'l')
                  if (!message.member.permissions.has("MANAGE_CHANNELS") && perms !== 1 || perms == 2) {
                      const errorembed = new Discord.MessageEmbed()
                          .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                          .setColor(15684432)
                          .setDescription(`You do not have access to this command.`)
                      return message.channel.send({ embeds: [errorembed] })
                  }
              } if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
                  console.log('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.')
                  return message.channel.send('Ozaibot does not have Permissions to edit roles in this server! I cannot mute without this permission.');
            }
            let muteroleid = client.muteroles.get(message.guild.id)
            if (!muteroleid) {
                  console.log('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
            }
            if (!args[0]) {
                  console.log('Add a member arguement.')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Add a member arguement.\n\nProper useage is:\n\`mute <@member|member_id> <time> <reason>\``)
                  return message.channel.send({ embeds: [errorembed] })
            }
            const muterole = message.guild.roles.cache.get(muteroleid)
            if (!muterole) {
                  console.log('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
                  return message.channel.send('The mute role for this server could not be found, please set a new one with `sm_muterole` in order to mute')
            }
            if (message.guild.me.roles.highest.position <= muterole.position) {
                  console.log('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
                  return message.channels.send('Ozaibot does not have high enough permissions to interact with the mute role, please drag my permissions above the mute role in order to mute successfully.')
            }
            let member = await GetMember(message, client, args[0], Discord, true, false);
            if (member === 'cancelled') return
            if (!member) {
                  console.log('invalid member')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid member.\n\nProper useage is:\n\`mute <@member|member_id> <time> <reason>\``)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (member.id === message.author.id) {
                  console.log('attempted self mute, canceling')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`You cannot mute yourself.`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (member.id == client.user.id) {
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Why do you want to mute me :(`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (message.guild.ownerId !== message.author.id) {
                  if (member.id == message.guild.ownerId || member.permissions.has('ADMINISTRATOR')) {
                        console.log('attempted mute against administrator, canceling')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor(15684432)
                              .setDescription(`You cannot mute members with Administrator Permissions.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
                  if (message.author.id !== '508847949413875712') {
                        if (message.member.roles.highest.position <= member.roles.highest.position || member.id == message.guild.ownerId) {
                              console.log('attempted mute against someone of higher rank, canceling')
                              const errorembed = new Discord.MessageEmbed()
                                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                                    .setColor(15684432)
                                    .setDescription(`You cannot mute members with higher or the same permissions as your own.`)
                              return message.channel.send({ embeds: [errorembed] })
                        }
                  }
            }
            if (member.roles.cache.some(role => role.id == muterole.id)) {
                  console.log('attempted mute against someone already muted, canceling')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`This member is already muted.`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            let casenumber = client.currentcasenumber.get(message.guild.id) + 1
            member.roles.add(muterole, `User muted by ${message.author.tag} (${message.author.id}) - Case #${casenumber}`).catch(err => {
                  console.log(err)
                  console.log('Failed; unable to add muterole to member')
                  return message.channel.send('Failed; unable to add muterole to member')
            });
            const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
            let muteduration = await GetPunishmentDuration(args[1])
            if (muteduration === Infinity) {
                  console.log('attempted mute with some bullshit time inputed')
                  member.roles.remove(muterole).catch(err => {
                        console.log(err)
                        console.log('Failed; unable to add muterole to member')
                        return message.channel.send('Failed; unable to remove muterole from member because a dumb time was inputed')
                  });
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid time.`)
                  return message.channel.send({ embeds: [errorembed] });
            }
            let reason = args.slice(1).join(" ");
            let display = ''
            let timeunban = 9999999999;
            if (muteduration) {
                  timeunban = muteduration + currenttime
                  display = GetDisplay(muteduration, true)
                  reason = args.slice(2).join(" ");
            } else {
                  muteduration = 0
            }
            const returnembed = new Discord.MessageEmbed()
                  .setTitle(`Case #${casenumber}`)
                  .setDescription(`<:check:988867881200652348> ${member} has been **muted**${display}.`)
                  .setColor("GREEN")
            message.channel.send({ embeds: [returnembed] })
            NotifyUser(3, message, `You have been muted in ${message.guild}`, member, reason, muteduration, client, Discord)
            let query = "INSERT INTO activebans (userid, adminid, serverid, timeunban, casenumber, length, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
            let data = [member.id, message.author.id, message.guild.id, timeunban, casenumber, muteduration, 'mute']
            connection.query(query, data, function (error, results, fields) {
                  if (error) {
                        message.channel.send('Creating unmute time in database failed. User is still muted but will not be automatically unmuted.')
                        return console.log(error)
                  }
                  return
            })
            LogPunishment(message, client, member.id, 3, muteduration, reason, Discord, casenumber, true)
            console.log(`user has been muted${display}.`)
      }
}