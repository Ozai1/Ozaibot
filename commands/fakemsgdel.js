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
 
 
 
module.exports = {
    name: 'fakemsgdel',
    description: 'pretends to catch someone deleting a message',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            const member = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
            if (message.deletable) message.delete().catch(err => { console.log(err) })
            if (!args[0]) return
            let content = args.slice(1).join(" ");
            const lolembed = new Discord.MessageEmbed()
                .setTitle('Message deleted!')
                .addField('Message author:', `${member}`)
                .addField('Message content:', `${content}`)
                .setFooter('Anti Message Delete!', client.user.displayAvatarURL())
                .setColor('RED')
                .setTimestamp()
            message.channel.send({embeds: [lolembed]}).catch(err => { console.log(err) })
            return
        }
    }
}