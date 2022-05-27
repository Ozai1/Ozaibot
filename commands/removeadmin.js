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
    name: 'removeadmin',
    description: 'removes the ADMIN LIKE ALL PERMS ADMIN role from a user',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (!args[0]) return message.channel.send('Please give a member to remove admin from')
            if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.author.send('Ozaibot does not have permissions to change any roles.').catch(err => { console.log(err) })
            let muterole = message.guild.roles.cache.find(role => role.name.toLowerCase() === "admin like all perms admin");
            let member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (!member) return message.channel.send("You have to mention a valid member").then(message => message.delete({ timeout: 2000 }))
            member.roles.remove(muterole).catch(err => { console.log(err) })
        }
    }
}

