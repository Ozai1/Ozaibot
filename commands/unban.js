const mysql = require('mysql2');

require('dotenv').config();
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const { unix } = require('moment');
module.exports = {
      name: 'unban',
      aliases: ['un-ban'],
      description: 'unbans a user from a guild',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
                  console.log('attempted to unban while ozaibot does not have unban perms')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Ozaibot Does not have permissions to unban in this server.`)
                  return message.channel.send({ embeds: [errorembed] })
            }
            if (!userstatus == 1) {
                  if (!message.member.permissions.has('BAN_MEMBERS')) {
                        console.log('attempted to unban while not having enough permissions')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor(15684432)
                              .setDescription(`You do not have permissions to use this command.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
            }
            if (!args[0]) {
                  console.log('stopped, no member arg')
                  const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor(15684432)
                        .setDescription(`Invalid member.\n\nProper useage is:\n\`unban <member_id>\``)
                  return message.channel.send({ embeds: [errorembed] })
            }
            message.guild.bans.fetch().then(bans => {
                  let member = bans.get(args[0]);
                  if (!member) {
                        console.log('attempted unban on user which is not banned')
                        const errorembed = new Discord.MessageEmbed()
                              .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                              .setColor("GREEN")
                              .setDescription(`This member is not currently banned.`)
                        return message.channel.send({ embeds: [errorembed] })
                  }
                  message.guild.members.unban(args[0], 'Unbanned by ' + message.author.tag).then(() => {
                        const returnembed = new Discord.MessageEmbed()
                        .setDescription(`<:check:988867881200652348> <@${args[0]}> has been un-banned.`)
                        .setColor("GREEN")
                    message.channel.send({ embeds: [returnembed] })
                  }).catch(err => { console.log(err) });
                  let reason = args.slice(1).join(" ");
                  query = `SELECT MAX(casenumber) FROM serverpunishments WHERE serverid = ?`;
                  data = [message.guild.id];
                  connection.query(query, data, function (error, results, fields) {
                        if (error) {
                              message.channel.send('Error logging ban. Ban will still be instated but will not show up in punishment searches.');
                              return console.log(error);
                        }
                        let casenumber = 1
                        if (!results == ``) {
                              for (row of results) {
                                    casenumber = row["MAX(casenumber)"] + 1
                              }
                        }
                        if (casenumber == undefined || casenumber === null) {
                              casenumber = 1
                        }
                        let query = `INSERT INTO serverpunishments (serverid, casenumber, userid, adminid, timeexecuted, reason, type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        let data = [message.guild.id, casenumber, args[0], message.author.id, Number(Date.now(unix).toString().slice(0, -3)), reason, 'Un-ban'];
                        connection.query(query, data, function (error, results, fields) {
                              if (error) {
                                    message.channel.send('Error logging unban. Unban will still be instated but will not show up in punishment searches.');
                                    return console.log(error);
                              }
                        });
                  });
            })
      }
}