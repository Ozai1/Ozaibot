const mysql = require('mysql2');
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
    name: 'arole',
    description: 'adds a role to a user',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.reply('Usage is "sm_addrole <@user> <role name>')
            let rolename = args.slice(1).join(" ").toLowerCase();
            if (rolename.startsWith('<@')) return message.reply('Usage is "sm_addrole <@user> <role name>')
            let chosenrole = message.guild.roles.cache.find(role => role.name.toLowerCase() === rolename);
            if (!chosenrole) return message.reply(`${rolename} was not found as a role, please check your spelling.`)
            await member.roles.add(chosenrole).catch(err => {
                console.log(err)
                message.channel.send('Failed to add the role, this is most likely due to ozaibot not having high enough permissions.');
                console.log('Failed to add the role, this is most likely due to ozaibot not having high enough permissions.')
                return
            })
            message.channel.send(`\`${rolename}\` has been added to ${member}.`)
            console.log(`\`${rolename}\` has been added to ${member.user.tag}.`)
        }
    }
}