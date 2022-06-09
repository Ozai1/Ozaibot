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
      name: 'unban',
      description: 'unbans a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
                  console.log('attempted to unban while ozaibot does not have unban perms')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                        .setColor(15684432)
                        .setDescription(`Ozaibot Does not have permissions to unban in this server.`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) {
                        console.log('attempted to mute while not having enough permissions')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                              .setColor(15684432)
                              .setDescription(`You do not have permissions to use this command.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
            }
            if (!args[0]) {
                  console.log('stopped, no member arg')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                        .setColor(15684432)
                        .setDescription(`Invalid member.\n\nProper useage is:\n\`unban <member_id>\``)
                  return message.channel.send({ embeds: [errorembed] })
            }
            message.guild.bans.fetch().then(bans => {
                  let member = bans.get(args[0]);
                  if (!member) {
                        console.log('attempted to mute while not having enough permissions')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor(`${message.author.tag}`, message.author.avatarURL())
                              .setColor("GREEN")
                              .setDescription(`This member is not currently banned.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
                  message.guild.members.unban(args[0], 'Unbanned by ' + message.author.tag).then(() => {
                        message.channel.send('Unbanned <@' + args[0] + '>.');
                  }).catch(err => { console.log(err) });
            })
      }
}