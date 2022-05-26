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
const NoWaitConnection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibot',
    waitForConnections: false,
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
const NoWaitServersDB = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibotservers',
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    name: 'poll',
    aliases: ['vote'],
    description: 'sets up a poll for people to vote on',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        let prefix = 'sm_';
        let query = "SELECT * FROM prefixes WHERE serverid = ?";
        let data = [message.guild.id]
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
            for (row of results) {
                prefix = row["prefix"];
            }
            args = message.content.slice(prefix.length).split('"');
            //🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿 ☑️✅❎✖️❌
            let pollembed = new Discord.MessageEmbed()
            if (!args[1]) return message.reply('Useage is `sm_poll "poll name" "option1" "option2" "option3" ect. ` all options are optional. You can have up to ten options.')
            if (args[23]) return message.reply('To many options! Usage is `sm_poll "poll name" "option1" "option2" "option3" ect. ` all options are optional. You can have up to ten options.')
            if (args[21]) {
                let pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}\n🇫 ${args[13]}\n🇬 ${args[15]}\n🇭 ${args[17]}\n🇮 ${args[19]}\n🇯 ${args[21]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    message.react('🇫').catch(err => { console.log(err) });
                    message.react('🇬').catch(err => { console.log(err) });
                    message.react('🇭').catch(err => { console.log(err) });
                    message.react('🇮').catch(err => { console.log(err) });
                    message.react('🇯').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[19]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}\n🇫 ${args[13]}\n🇬 ${args[15]}\n🇭 ${args[17]}\n🇮 ${args[19]}`)
                    .setColor('BLUE')
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    message.react('🇫').catch(err => { console.log(err) });
                    message.react('🇬').catch(err => { console.log(err) });
                    message.react('🇭').catch(err => { console.log(err) });
                    message.react('🇮').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[17]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}\n🇫 ${args[13]}\n🇬 ${args[15]}\n🇭 ${args[17]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    message.react('🇫').catch(err => { console.log(err) });
                    message.react('🇬').catch(err => { console.log(err) });
                    message.react('🇭').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[15]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}\n🇫 ${args[13]}\n🇬 ${args[15]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    message.react('🇫').catch(err => { console.log(err) });
                    message.react('🇬').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[13]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}\n🇫 ${args[13]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    message.react('🇫').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[11]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}\n🇪 ${args[11]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    message.react('🇪').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[9]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}\n🇩 ${args[9]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    message.react('🇩').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[7]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧 ${args[5]}\n🇨 ${args[7]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    message.react('🇨').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[5]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}\n🇧`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    message.react('🇧').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else if (args[3]) {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**\n🇦 ${args[3]}`)
                    .setColor('BLUE');
                message.channel.send({ embeds: [ pollembed], }).then(message => {
                    message.react('🇦').catch(err => { console.log(err) });
                    return
                }).catch(err => {
                    message.channel.send('Poll failed, most likely it was to long, you can have as many options as you had but the options must not be so long.')
                    console.log(err)
                });
            } else {
                pollembed = new Discord.MessageEmbed()
                    .setDescription(`**${args[1]}**`)
                    .setColor('BLUE');
                message.react('✅')
                message.react('❎')
                return
            }

        })
    }
}