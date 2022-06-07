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



module.exports = {
      name: 'unblacklist',
      description: 'allows a user to use the bot again',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1 || message.author.id == '508847949413875712') {
                  if (!args[0]) return message.channel.send('Please give a member to unblacklist')
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member') // still no member
                  let query = "SELECT * FROM userstatus WHERE userid = ?";
                  let data = [member.id]
                  connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) { // if they not in db, they get botadmin
                              return message.channel.send('This user is not blacklisted.')
                        } else {
                              for (row of results) {
                                    var status = row["status"];
                                    if (status == 1) {// they already blacklisted
                                          return message.channel.send('This user is not blacklisted, infact they are a botadmin.')
                                    } else if (status == 0) {// remove bot admin and blacklist
                                          let query = "DELETE FROM userstatus WHERE userid = ?";
                                          data = [member.id]
                                          connection.query(query, data, function (error, results, fields) {// remove bot admin and blacklist
                                                if (error) return console.log(error)
                                                message.channel.send(`${member} has been unblacklisted`)
                                                console.log(`${member.tag}(${member.id}) has been unblacklisted by ${message.author.tag}`)
                                                let alllogs = client.channels.cache.get('882845463647256637')
                                                if (message.author.id == '508847949413875712') return
                                                alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been unblacklisted as per the above message, this was done by by ${message.author.tag}`)
                                                return
                                          })
                                    }
                              }
                        }
                  })
            }
      }
}