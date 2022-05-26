const mysql = require('mysql2')
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
 
const { GetMember } = require("../functions")
module.exports = {
      name: 'unmute',
      aliases: ['muterole', 'unm'],
      description: 'unmutes a user in a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (cmd === 'muterole') return mute_role(message, cmd, args, userstatus, Discord)
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole']
            serversdb.query(query, data, async function (error, results, fields) {
                  if (error) return console.log(error)
                  if (results == ``) {
                        return message.channel.send('There is currently no mute role for this server. Please set a mute role to mute using `sm_muterole`.')
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid)
                        member = await GetMember(message, args[0], Discord, false);
                        if (!userstatus == 1) {
                              if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("You don't have the permissions.");
                              if (message.guild.ownerID !== message.author.id) {
                                    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send('You cannot unmute someone with the same or higher roles than your own.');
                              }
                        }
                        if (!member || !args[0]) return message.channel.send("You have to mention a valid member");
                        if (!muterole) return message.channel.send('The mute role for this server could not be found.')
                        if (!member.roles.cache.some(role => role.id == muterole.id)) return message.channel.send('This member is not currently muted.')
                        member.roles.remove(muterole).catch(err => {
                              console.log(err)
                              message.channel.send('Failed.')
                        }).then(() => {
                              message.channel.send(`${member} has been unmuted`);
                        })
                        query = "SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?";
                        data = [member.id, message.guild.id, 'mute']
                        connection.query(query, data, function (error, results, fields) {
                              if (error) {
                                    console.log('backend error for checking active bans')
                                    return console.log(error)
                              }
                              for (row of results) {
                                    query = "DELETE FROM activebans WHERE id = ?";
                                    data = [row["id"]]
                                    let count = [row['count']]
                                    connection.query(query, data, function (error, results, fields) {
                                          if (error) return console.log(error)
                                    })
                              }
                        })
                  }
            })
      }
}
async function mute_role(message, cmd, args, userstatus, Discord) {
      if (!userstatus == 1) {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You do not have enough permissions to use this command.");
      }
      if (!args[0]) {
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        const embed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('BLUE')
                              .setDescription(`This server currently has no mute role set.\n\nSet a mute role using \n\`sm_muterole set [@role/role_id]\`\n\nAlternatively you may create a new mute role using \n\`sm_muterole create\`.\n\nThe mute command currently cannot be used due to the lack of a mute role.`);
                        return message.channel.send(embed);
                  }
                  for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = message.guild.roles.cache.get(muteroleid);
                        const embed = new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.avatarURL())
                              .setColor('BLUE')
                              .setDescription(`This server's mute role is currently ${muterole}.\n\nYou may stop the bot using this role with \n\`sm_muterole remove\`.\n\nIf you would like to set a new mute role you can do so using\n\`sm_muterole set [@role/role_id]\`.\n\nIf you remove the mute role and do not set another the mute command will stop working.`);
                        return message.channel.send({ embeds: [embed] });

                  }
            });
            return;
      }
      if (args[0].toLowerCase() !== 'set' && args[0].toLowerCase() !== 'create' && args[0].toLowerCase() !== 'remove') return message.channel.send('Usage is `sm_muterole [set|create|remove] [@role/role_id]`')
      if (args[0].toLowerCase() === 'set') {
            let role = message.guild.roles.cache.get(args[1].slice(3, -1)) || message.guild.roles.cache.get(args[1]);
            if (!role)
                  return message.channel.send('Invalid role.');
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO ${message.guild.id}config (type, details) VALUES (?, ?)`;
                        let data = ['muterole', role.id];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                  } else {
                        let query = `UPDATE ${message.guild.id}config SET details = ? WHERE type = ?`;
                        let data = [role.id, 'muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Set mute role.');
                        });
                  }
            });


      } else if (args[0].toLowerCase() === 'create') {
            let muterole = await message.guild.roles.create({
                  name: "Muted",
                  permissions: [],
            }).catch(err => {
                  console.log(err);
                  message.channel.send('Failed to create a muted role.');
            });
            await message.guild.channels.fetch()
            await message.guild.channels.cache.forEach(async (channel) => {
                  if (channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                        if (channel) {
                              if (channel.permissionOverwrites) {
                                    await channel.permissionOverwrites.edit(muterole.id, { SEND_MESSAGES: false, ADD_REACTIONS: false, CONNECT: false, SEND_MESSAGES_IN_THREADS: false }).catch(err => {console.log(err)})

                              }
                        }
                  }
            });
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        let query = `INSERT INTO ${message.guild.id}config (type, details) VALUES (?, ?)`;
                        let data = ['muterole', muterole.id];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                  } else {
                        let query = `UPDATE ${message.guild.id}config SET details = ? WHERE type = ?`;
                        let data = [muterole.id, 'muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                        });
                  }
            });
            message.channel.send(`Created the <@&${muterole.id}> role and set permissions in all channels *that ozaibot has access to editing*. This is now the mute role for Ozaibot.`);
      } else if (args[0].toLowerCase() === 'remove') {
            let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
            let data = ['muterole'];
            serversdb.query(query, data, function (error, results, fields) {
                  if (error)
                        return console.log(error);
                  if (results == ``) {
                        message.channel.send('There is currently no mute role for this server.');
                  } else {
                        let query = `DELETE FROM ${message.guild.id}config WHERE type = ?`;
                        let data = ['muterole'];
                        serversdb.query(query, data, function (error, results, fields) {
                              if (error)
                                    return console.log(error);
                              message.channel.send('Removed the mute role for this server, the role still exists but Ozaibot will no longer use it for the mute command. You will need to set a new mute role in order to be able to mute again.');
                        });
                  }
            });
      }
}
