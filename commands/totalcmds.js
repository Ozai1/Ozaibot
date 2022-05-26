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
 
module.exports = {
      name: 'totalcmds',
      aliases: ['cmdcount'],
      description: 'shows how many commands have been sent',
      async execute(message, client, cmd, args, Discord, userstatus) {
            query = "SELECT * FROM totalcmds WHERE userid = ?";
            data = [message.author.id]
            connection.query(query, data, function (error, results, fields) {
                  if (error) return console.log(error)
                  for (row of results) {
                        usercmdcount = Number(row["cmdcount"]);
                  }
                  query = "SELECT SUM(cmdcount) FROM totalcmds";
                  data = []
                  connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                        let totalcmdcount = results[0]['SUM(cmdcount)']
                        const cmdembed = new Discord.MessageEmbed()
                              .addField(`Command recorder thing.`, `** **                     \n**${message.author.username}'s** command count is: **${usercmdcount}**.\nThe total command count for all users is: **${totalcmdcount}**.`)
                              .setFooter(`This counter started on the 30/10/2021`)
                              .setColor('GREEN')
                        message.channel.send({embeds: [cmdembed]})
                  });
            });

      }
}