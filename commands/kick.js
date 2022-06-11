const mysql = require('mysql2');
const {GetDatabasePassword} = require('../hotshit')
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: GetDatabasePassword(),
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

const { GetMember } = require("../moderationinc")
module.exports = {
      name: 'kick',
      aliases: ['k', 'skick'],
      description: 'Kicks a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (cmd === 'skick') return skick(message, args, userstatus, Discord)
            if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send('Ozaibot does not have kick permissions in this server!')
            if (!args[0]) return message.channel.send('You must add a member to kick.')
                  member = await GetMember(message, args[0], Discord, false);
            if (userstatus == 1) {
                  if (!message.member.permissions.has('KICK_MEMBERS')) {
                        if (!member) return message.author.send('no member')
                        if (!member.kickable) return message.author.send('I do not have high enough permissions for this or theyre not on the server or smth')
                        let reason = args.slice(1).join(" ");
                        if (!reason) reason = 'no reason provided';
                        message.channel.send(`Kicked ${member}.`)
                        const kickedembed = new Discord.MessageEmbed()
                              .addField(`**You have been kicked from** ${message.guild}.`, `**For**: ${reason}`)
                              .setColor('ORANGE')
                              .setTimestamp()
                        member.send({embeds: [kickedembed]}).catch(err => { })
                        console.log(`confirmation message sent to ${member.tag} for being kicked from ${message.guild} by ${message.author.tag}`)
                        await member.kick({ reason: `${reason}` }).catch(err => {
                              console.log(err)
                              message.channel.send('Failed to kick')
                              return
                        })
                        return
                  }
            }
            if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('You do not have permissions to do this!');
            if (!member) return message.reply("Usage is \"sm_kick <@user|user_id> <reason>\"");
            if (member.id === message.author.id) return message.channel.send('You cant kick yourself!');
            if (message.guild.ownerID !== message.author.id) {
                  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot kick someone with higher or the same roles as your own.');
            }
            if (!member.kickable) return message.reply("I do not have high enough permissions to kick this member.");
            let reason = args.slice(1).join(" ");
            if (!reason) reason = 'no reason provided';
            message.channel.send(`Kicked ${member}.`)
            const kickedembed = new Discord.MessageEmbed()
                  .addField(`**You have been kicked from**: ${message.guild}.`, `**Kicked by**: ${message.author} \n **For**: "${reason}".`)
                  .setColor('ORANGE')
                  .setTimestamp()
            member.send({embeds: [kickedembed]}).catch(err => { })
            console.log(`confirmation message sent to ${member.tag} for being kicked from ${message.guild} by ${message.author.tag}`)
            await member.kick({ reason: `${reason} - ${message.author.tag}` }).catch(err => {
                  console.log(err)
                  message.channel.send('Failed to kick')
                  return
            })
      }
}
async function skick(message, args, userstatus, Discord) {
      if (userstatus == 1) {
            if (!args[0]) return message.member.send('You must add a member to kick.')
            const member = await GetMember(message, args[0], Discord, false)
            if (!message.guild.me.permissions.has('KICK_MEMBERS')) return message.channel.send('Ozaibot does not have kick permissions in this server!')
            if (!member) return message.author.send('no member ')
            if (!member.kickable) return message.author.send('I do not have high enough permissions for this or theyre not on the server or smth')
            await member.kick().catch(err => {
                  console.log(err)
                  message.author.send('Failed to kick')
                  return
            })
            return
      }
}