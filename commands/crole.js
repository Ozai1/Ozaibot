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
      name: 'crole',
      description: 'creates a role',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (userstatus == 1 || message.member.permissions.has('ADMINISTRATOR')) {
                  if (!message.guild.me.permissions.has('MANAGE_ROLES') && !message.guild.me.permissions.has('MANAGE_CHANNELS')) {
                        if (message.member.permissions.has('ADMINISTRATOR')) {
                              message.channel.send('Ozaibot does not have Manage Roles permissions so it cannot create your role.')
                        } else {
                              message.author.send('Ozaibot doesnt have perms for roles in this server zzzzz')
                        }
                  }
                  if (!args[0]) return message.reply('you must choose a role name for the command to work!');
                  if (!args[0].startsWith('#')) {
                        await message.guild.roles.create({
                              name: args.slice(0).join(" "),
                              permissions: [],
                        }).catch(err => {
                              console.log(err);
                              message.channel.send('Failed to create a muted role.');
                        });
                        return
                  } if (args[0].startsWith('#')) {
                        await message.guild.roles.create({
                              name: args.slice(0).join(" "),
                              permissions: [],
                        }).catch(err => {
                              console.log(err);
                              message.channel.send('Failed to create a muted role.');
                        });
                        return
                  }
            }
      }
}