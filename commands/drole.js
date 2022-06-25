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

module.exports = {
    name: 'drole',
    description: 'deletes a role',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            let rolename = args.slice(0).join(" ").toLowerCase();
            let chosenrole = message.guild.roles.cache.find(role => role.name.toLowerCase() === rolename);
            if (!chosenrole) return message.reply(`\`${rolename}\` was not found as a role, please check your spelling.`);
            await chosenrole.delete().catch(err => {
                console.log(err)
                message.channel.send('Failed to Delete the role, this is most likely due to ozaibot not having high enough permissions.');
                return
            })
            message.channel.send(`Role deleted.`);
        }
    }
}