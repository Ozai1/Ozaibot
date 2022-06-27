const mysql = require('mysql2')
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

module.exports = {
      name: 'blacklist',
      description: 'bans someone from bot use',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1 || message.author.id == '508847949413875712') {
                  if (!args[0]) return message.channel.send('Please give a member to blacklist')
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member') // still no member
                  if (!message.author.id == '508847949413875712') {
                        if (member.id == '508847949413875712') return message.channel.send(`${member} has been blacklisted from bot use & had their botadmin removed.`);
                  }
                  let status = client.userstatus.get(member.id)
                  if (status === undefined) { // if they not in db, they get blacklisted
                        client.userstatus.set(member.id, 0)
                        query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                        data = [member.username, member.id, 0]
                        connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                              if (error) return console.log(error)
                              message.channel.send(`${member} has been blacklisted from bot use.`)
                              console.log(`${member.tag}(${member.id}) has been blacklisted by ${message.author.tag}.`)
                              let alllogs = client.channels.cache.get('986882651921190932')
                              if (message.author.id == '508847949413875712') return
                              alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been blacklisted as per the above message, they were blacklisted by ${message.author.tag}`)
                              return
                        })
                  } else {
                        if (status == 0) return message.channel.send('That user is already blacklisted.')// they already blacklisted
                        if (status == 1) {// remove bot admin and blacklist
                              client.userstatus.delete(member.id)
                              client.userstatus.set(member.id, 0)
                              query = "UPDATE userstatus SET status = ? WHERE userid = ?";
                              data = [0, member.id]
                              connection.query(query, data, function (error, results, fields) {// remove bot admin and blacklist
                                    if (error) return console.log(error)
                                    message.channel.send(`${member} has been blacklisted from bot use & had their botadmin removed.`)
                                    console.log(`${member.tag}(${member.id}) has been blacklisted by ${message.author.tag}, they also had botadmin removed.`)
                                    let alllogs = client.channels.cache.get('986882651921190932')
                                    if (message.author.id == '508847949413875712') return
                                    alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been blacklisted & has had their botadmin removed as per the above message, they were blacklisted by ${message.author.tag}`)
                                    return
                              })
                        }
                  }
            }
      }
}