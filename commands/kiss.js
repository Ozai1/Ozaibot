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
    name: 'kiss',
    description: 'mhm',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!args[0]) return message.channel.send('You must ping someone to kiss.')
        cats = ["https://tenor.com/view/cats-kiss-cuddle-cute-gif-10385036", "https://tenor.com/view/cat-cute-kisses-kitty-kiss-heart-gif-16375047", "https://tenor.com/view/cat-kitty-cats-kiss-kitty-kiss-kiss-gif-21156445", "https://tenor.com/view/cats-cute-cuddle-sleep-kiss-gif-17641567", "https://tenor.com/view/cat-kitten-kitty-kiss-cute-gif-5695555", "https://tenor.com/view/cat-kiss-kissing-gif-4302687"];
        var random = cats[Math.floor(Math.random() * cats.length)];
        let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
        if (!member) return message.reply('Invalid member')
        if (member === message.author) return
        message.channel.send(`**${message.author.username}** has kissed **${member.username}**!`)
        message.channel.send(random)
    }
}