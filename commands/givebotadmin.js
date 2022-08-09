const mysql = require('mysql2')
require('dotenv').config();
const {GetMember}= require('../moderationinc')
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
    name: 'givebotadmin',
    aliases: ['gba'],
    description: 'gives a user access to all of the bots commands regardless of permissions',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.author.id == '508847949413875712') {
            if (!args[0]) return message.channel.send('Please give a member to give botadmin to.')
            let member =await GetMember(message,client,args[0],Discord,true,true)
            if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
            if (!member) return message.channel.send('Invalid member') // still no member
            let query = "SELECT * FROM userstatus WHERE userid = ?";
            let data = [member.id]
            connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                if (error) return console.log(error)
                if (results == ``) {
                    client.userstatus.set(member.id, 1)
                    query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                    data = [member.user.username, member.id, 1]
                    connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        message.channel.send(`${member} has been given botadmin status.`)
                        console.log(`${member.tag}(${member.id}) has been given botadmin by ${message.author.tag}.`)
                        let alllogs = client.channels.cache.get('986882651921190932')
                        if (message.author.id !== '508847949413875712'){
                        alllogs.send(`<@!508847949413875712>\n${member}(${member.user.tag}) has been given botadmin as per the above message, they were given botadmin by ${message.author.tag}`)}
                    })
                } else {
                    for (row of results) {
                        var status = row["status"];
                        if (status == 1) {// they already botadmin
                            message.channel.send('That user is already a botadmin.')
                            return
                        } else if (status == 0) {// add botadmin & remove blacklist
                            client.userstatus.set(member.id, 1)
                            query = "UPDATE userstatus SET status = ? WHERE userid = ?";
                            data = [1, member.id]
                            connection.query(query, data, function (error, results, fields) {// remove blacklist & add botadmin
                                if (error) return console.log(error)
                                message.channel.send(`${member} has been given botadmin & had their blacklist removed.`)
                                console.log(`${member.tag}(${member.id}) has been guven botadmin by ${message.author.tag}, they also had their blacklist removed removed.`)
                                let alllogs = client.channels.cache.get('986882651921190932')
                                if (message.author.id !== '508847949413875712'){
                                alllogs.send(`<@!508847949413875712>\n${member.user.tag}(${member.id}) has been given botadmin & had their blacklist removed as per the above message, they were given botadmin by by ${message.author.tag}`)}
                            })
                        }
                    }
                }
            })
        }else {message.channel.send("<https://youtu.be/sSI0WSCVHnU?t=42>")}
    }
}

