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
      name: 'removebotadmin',
      aliases: ['rba'],
      description: 'removes a user from the botadmin status',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '254223729091936256') { // includes sun tzu
                  if (!args[0]) return message.channel.send('Please give a member to have their botadmin removed')
                  if (args[0].toLowerCase() === '@!me') {
                        let query = "DELETE FROM userstatus WHERE status='1'";
                        let data = []
                        connection.query(query, data, function (error, results, fields) {// remove ALL botadmins bar the executer
                              if (error) return console.log(error)
                              query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                              data = ['Ozai', '508847949413875712', 1]
                              connection.query(query, data, function (error, results, fields) {// add myself back
                                    if (error) return console.log(error)
                                    if (message.author.id == '508847949413875712') return // if i did the command just leave me as the only bot admin
                                    query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                                    data = ['cherry', '753454519937007696', 1]
                                    connection.query(query, data, function (error, results, fields) {// add cherry back if it wassnt me who did the command
                                          if (error) return console.log(error)
                                    })
                              })
                        })
                        return
                  }
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member') // still no member
                  if (member.id == '508847949413875712') return message.channel.send(`${member} has had their botadmin removed.`)
                  let query = "SELECT * FROM userstatus WHERE userid = ?";
                  let data = [member.id]
                  connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) { // if they not in db, they get botadmin
                              return message.channel.send('This user is not a botadmin.')
                        } else {
                              for (row of results) {
                                    var status = row["status"];
                                    if (status == 0) {// they already blacklisted
                                          return message.channel.send('This user is not a botadmin, infact they are blacklisted.')
                                    } else if (status == 1) {// remove bot admin and blacklist
                                          let query = "DELETE FROM userstatus WHERE userid = ?";
                                          data = [member.id]
                                          connection.query(query, data, function (error, results, fields) {// remove bot admin and blacklist
                                                if (error) return console.log(error)
                                                message.channel.send(`${member} has had their botadmin removed`)
                                                console.log(`${member.tag}(${member.id}) has had their botadmin removed by ${message.author.tag}`)
                                                let alllogs = client.channels.cache.get('882845463647256637')
                                                if (message.author.id !== '508847949413875712'){
                                                alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has had their botadmin removed as per the above message, this was done by by ${message.author.tag}`)}
                                                return
                                          })

                                    }
                              }
                        }
                  })
            }
      }
}