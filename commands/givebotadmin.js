const mysql = require('mysql2')
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: 'P0V6g5',
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    name: 'givebotadmin',
    description: 'gives a user access to all of the bots commands regardless of permissions',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '753454519937007696' || message.author.id == '508847949413875712') {
            if (message.author.id == '753454519937007696') {
                if (!userstatus == 1) return message.channel.send('sorry but you must have botadmin to do this <3, still you and i are the only ones with access tho')
            }
            if (!args[0]) return message.channel.send('Please give a member to give botadmin to')
            let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
            if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
            if (!member) return message.channel.send('Invalid member') // still no member
            let query = "SELECT * FROM userstatus WHERE userid = ?";
            let data = [member.id]
            connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                if (error) return console.log(error)
                if (results == ``) { // if they not in db, they get blacklisted
                    query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                    data = [member.username, member.id, 1]
                    connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        message.channel.send(`${member} has been given botadmin status.`)
                        console.log(`${member.tag}(${member.id}) has been given botadmin by ${message.author.tag}.`)
                        let alllogs = client.channels.cache.get('882845463647256637')
                        if (message.author.id !== '508847949413875712'){
                        alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been given botadmin as per the above message, they were blacklisted by ${message.author.tag}`)}
                        return
                    })
                } else {
                    for (row of results) {
                        var status = row["status"];
                        if (status == 1) {// they already botadmin
                            message.channel.send('That user is already a botadmin.')
                            return
                        } else if (status == 0) {// add botadmin & remove blacklist
                            query = "UPDATE userstatus SET status = ? WHERE userid = ?";
                            data = [1, member.id]
                            connection.query(query, data, function (error, results, fields) {// remove blacklist & add botadmin
                                if (error) return console.log(error)
                                message.channel.send(`${member} has been given botadmin & had theyre blacklist removed.`)
                                console.log(`${member.tag}(${member.id}) has been guven botadmin by ${message.author.tag}, they also had theyre blacklist removed removed.`)
                                let alllogs = client.channels.cache.get('882845463647256637')
                                if (message.author.id !== '508847949413875712'){
                                alllogs.send(`<@!508847949413875712>\n${member}(${member.tag}) has been given botadmin & had theyre blacklist removed as per the above message, they were blacklisted by ${message.author.tag}`)}
                                return
                            })

                        }
                    }
                }
            })
        }
    }
}

