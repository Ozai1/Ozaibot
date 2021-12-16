const mysql = require('mysql2')
const serversdb = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = {
      name: 'unmute',
      description: 'unmutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole']
            serversdb.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
                  if (results == ``) {
                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                        if (!userstatus == 1) {
                              if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the permissions.");
                              if (message.guild.ownerID !== message.author.id) {
                                    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot unmute someone with the same or higher roles than your own.');
                              }
                        }
                        if (!member) return message.channel.send("You have to mention a valid member");
                        if (!muterole) return message.channel.send('The mute role for this server could not be found.') 
                        member.roles.remove(muterole).catch(err => {
                              console.log(err)
                              message.channel.send('Failed.')
                        }).then(() => {
                              message.channel.send(`${member} has been unmuted`);
                        })
                  }
            })
      }
}