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
 
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
 
const { GetMember } = require("../moderationinc")
module.exports = {
      name: 'rename',
      aliases: ['nickname', 'setnickname'],
      description: 'sets a users nickname in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.reply('You do not have permissions to do this.');
            } if (!message.guild.me.permissions.has('MANAGE_NICKNAMES')) return message.channel.send('Ozaibot does not have permissions to change nicknames in this server.');
            if (!args[0]) return message.channel.send('Usage is `sm_rename <@user> <new_name>`');
            let member = null;
            let userpinged = false;
            let name = null
            if (args[0].length == 18 || args[0].length == 17 || args[0].startsWith('<@')) {
                  if (!isNaN(args[0]) || args[0].startsWith('<@')) {
                        name = args.slice(1).join(" ");
                        if (name.length > 32) return message.reply(`Nicknames must be less than 32 characters long, this name is ${name.length} characters long.`)
                        member = await GetMember(message, args[0], Discord, false);
                        if (!member) return message.channel.send('Invalid member.');
                        userpinged = true
                  }
            } if (userpinged === false) {
                  member = message.member;
                  if (member.id == message.guild.ownerID) return message.channel.send('Cant rename a server owner, only the server owner themselves can do that.');
                  if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.channel.send('I do not have high enough permissions to rename you.')
                  name = args.slice(0).join(" ");
            } else {
                  if (member.id == message.guild.ownerID) return message.channel.send('Cant rename a server owner, only the server owner themselves can do that.');
                  if (!userstatus == 1) {
                        if (message.guild.ownerID !== message.author.id && message.author.id !== member.id) {
                              if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot rename someone someone with higher or the same roles as your own.');
                        }
                  }
                  if (member.id !== client.user.id) {
                        if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.channel.send('I do not have high enough permissions to rename this user.');
                  }
            } if (member.id == client.user.id) {
                  return botrename(message, userstatus, name)
            }
            await member.setNickname(name).catch(err => {
                  console.log(err)
                  message.channel.send('Error when renaming, given name was probably to long.')
                  return
            }).then(() => {
                  message.channel.send(`Renamed ${member}.`);
            })
      }
}
const botrename = async (message, userstatus, name) => {
      if (!userstatus == 1) {
            if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.reply('You do not have permissions to do this.');
      } if (!message.guild.me.permissions.has('CHANGE_NICKNAME')) return message.channel.send('I do not have permissions to change my own nickname.');
      await message.guild.me.setNickname(name).catch(err => { console.log(err) })
      message.channel.send('Set own nickname.')
}