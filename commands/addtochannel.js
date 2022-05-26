const { GetMember } = require("../functions")
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
 
module.exports = {
      name: 'addtochannel',
      description: 'adds a user to a channel',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (message.member.permissions.has('ADMINISTRATOR') || userstatus == 1) {
                  let channelselected = message.channel;
                  if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.author.send('Ozaibot does not have permissions to edit channels in this server.');
                  if (!args[0]) return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                  if (args[1]) {
                        if (!isNaN(args[1])) {
                              channelselected = message.guild.channels.cache.get(args[1]);
                              if (!channelselected) return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else if (args[1].startsWith('<#')) {
                              channelselected = message.guild.channels.cache.get(args[1].slice(2, -1));
                              if (!channelselected) return message.reply('Invalid channel or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                        } else return message.reply('Invalid channel id or wrong arguements. Usage is "sm_addtochannel <@user | user_id> <#channel | channel_id(optional)>"');
                  }
                  let member = await GetMember(message, args[0], Discord, false)
                  if (!member) return message.reply('Invalid user.');
                  channelselected.permissionOverwrites.edit(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ADD_REACTIONS: true }).catch(err => {
                        message.channel.send('failed')
                        console.log(err)
                  })
                  return message.channel.send(`${member} has been added to ${channelselected.name}.`);
            }
      }
}