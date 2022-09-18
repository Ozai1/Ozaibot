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
      name: 'getguildinvite',
      description: 'grabs an invite for the server id given',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (!args[0]) return
                  let selectedguild = client.guilds.cache.get(args[0])
                  if (!selectedguild) return message.channel.send('Invalid server id')
                  if (!selectedguild.me.permissions.has('MANAGE_GUILD')) return message.channel.send('cannot see invite for this server due to low perms');
                  const invites = await selectedguild.invites.fetch().catch(err => {
                        return message.channel.send('Failed to fetch invites(s)')
                  })
                  let dainvite = invites.first()
                  if (dainvite) {
                        message.channel.send(`discord.gg/${dainvite.code}`)
                  } else {
                        message.channel.send('This server does not have any invites active which i can steal')
                  }
            }
      }
}