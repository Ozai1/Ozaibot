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
      name: 'getguildinvite',
      description: 'grabs an invite for the server id given',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  if (!args[0]) return
                  let selectedguild = client.guilds.cache.get(args[0])
                  if (!selectedguild) return message.channel.send('Invalid server id')
                  if (!selectedguild.me.permissions.has('CREATE_INSTANT_INVITE')) return message.channel.send('cannot create invite for this server due to low perms');
                  let channelsarr = [];
                  selectedguild.channels.cache.forEach(async (channel, id) => {
                        if (!channelsarr[0]) {
                              if (channel.type !== 'category') {
                                    channelsarr.push(channel.id)
                              }
                        }
                  });
                  if (!channelsarr[0]) return message.channel.send('This server has no channels, so no invite could be generated.')
                  let invchannel = client.channels.cache.get(channelsarr[0])
                  if (!invchannel) return message.channel.send('Error getting channel')
                  let invite = await invchannel.createInvite({ maxAge: 0, maxUses: 0 }).catch(err => {
                        console.log(err)
                        message.channel.send('Failed.')
                        return
                  })
                  message.channel.send(`${invite}`)
            }
      }
}