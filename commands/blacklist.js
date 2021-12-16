const mysql = require('mysql2')
const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = {
      name: 'blacklist',
      description: 'bans someone from bot use',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id) {
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member') // still no member
                  if (member.id == '508847949413875712') return message.channel.send(`${member} has been blacklisted from bot use & had theyre botadmin removed.`);
                  if (member.id == '753454519937007696') {
                        if (message.author.id !== '508847949413875712') return message.channel.send(`${member} has been blacklisted from bot use & had theyre botadmin removed.`);
                  }
                  let query = "SELECT * FROM userstatus WHERE userid = ?";
                  let data = [member.id]
                  connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) { // if they not in db, they get blacklisted
                              query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                              data = [member.username, member.id, 0]
                              connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                                    if (error) return console.log(error)
                                    message.channel.send(`${member} has been blacklisted from bot use.`)
                                    console.log(`${member.tag}(${member.id}) has been blacklisted by ${message.author.tag}.`)
                                    let alllogs = client.channels.cache.get('882845463647256637')
                                    alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been blacklisted as per the above message, they were blacklisted by ${message.author.tag}`)
                                    return
                              })
                        } else {
                              for (row of results) {
                                    var status = row["status"];
                                    if (status == 0) {// they already blacklisted
                                          message.channel.send('That user is already blacklisted.')
                                          return
                                    } else if (status == 1) {// remove bot admin and blacklist
                                          query = "UPDATE userstatus SET status = ? WHERE userid = ?";
                                          data = [0, member.id]
                                          connection.query(query, data, function (error, results, fields) {// remove bot admin and blacklist
                                                if (error) return console.log(error)
                                                message.channel.send(`${member} has been blacklisted from bot use & had theyre botadmin removed.`)
                                                console.log(`${member.tag}(${member.id}) has been blacklisted by ${message.author.tag}, they also had botadmin removed.`)
                                                let alllogs = client.channels.cache.get('882845463647256637')
                                                alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been blacklisted & has had theyre botadmin removed as per the above message, they were blacklisted by ${message.author.tag}`)
                                                return
                                          })

                                    }
                              }
                        }
                  })
            }
      }
}