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
    name: 'hug',
    description: 'gibes a hug <3',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (!args[0]) return message.channel.send('You must ping someone to hug.')
        let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]);
        if (!member) return message.channel.send('Invalid member silly')
        cats = ["https://tenor.com/view/sweet-kitty-love-cats-couple-gif-12796047", "https://tenor.com/view/sweet-sleep-love-kitties-hug-gif-12304006", "https://tenor.com/view/cat-hug-love-cuddle-snuggle-gif-8656017", "https://tenor.com/view/snuggle-cats-hugging-cat-gif-18465708"];
        var random = cats[Math.floor(Math.random() * cats.length)];
        if (!member) return message.reply('You need to ping the person you want to hug!')
        if (member === message.author) return message.reply('You know, there is bound to be people who want to hug you! you dont need to be lonely.')
        message.channel.send(`Awwww **${message.author.username}** has hugged **${member.username}**. Thats sweet.`, )
        message.channel.send(random)
    }
}