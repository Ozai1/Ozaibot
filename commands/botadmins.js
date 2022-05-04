const mysql = require('mysql2');
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
    name: 'botadmins',
    description: 'bAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus !== 1) {
            let query = `SELECT * FROM userstatus WHERE status = ?`;
            let data = [1]
            connection.query(query, data, function (error, results, fields) {
                if (error) {
                    console.log('backend error for checking active bans')
                    return console.log(error)
                }
                if (results !== `` || results === undefined) {
                    let printstring = [];
                    for (row of results) {
                        let userid = row["userid"]
                        let username = row["username"]
                        printstring.push(`<@${userid}> (${userid}) "${username}"`)
                    }
                    let finalarr = []
                    let extra = ''
                    if (finalarr.length > 67) {
                        extra = `plus ${finalarr.length - 67} more.`
                        finalarr.pop(finalarr.length - 67)
                    }
                    printstring.forEach(entry => {
                        finalarr.push(entry)
                    })
                    if (!finalarr[0]) return message.channel.send('no botadmins found')
                    let printmessage = finalarr.filter((a) => a).toString()
                    printmessage = printmessage.replace(/,/g, '\n')
                    const helpembed = new Discord.MessageEmbed()
                        .setDescription(printmessage)
                    if (!extra === '') { helpembed.setFooter(extra) }
                    helpembed.setColor('BLUE')
                    message.channel.send(helpembed)
                }
            })
        }
    }
}