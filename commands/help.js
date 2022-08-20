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
    name: 'help',
    aliases: ['invite', 'ahelp'],
    description: 'sends a help message',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (cmd === 'invite') return Command_Invite(message, Discord)
        if (cmd === 'ahelp') return Command_AHelp(message, userstatus, Discord, client)
        let prefix = undefined
        if (message.guild) {
            prefix = client.prefixes.get(message.guild.id)
        }
        if (!message.guild || !prefix) {
            prefix = 'sm_'
        }
        let embedinfo = undefined
        if (!args[0]) {
            embedinfo = client.help.get('no_args_0')
        } else {
            embedinfo = client.help.get(args[0].toLowerCase())
        }
        if (!embedinfo || !embedinfo.description) return message.channel.send({ content: `Command / module not found. Please check your spelling.` })
        const helpembed = new Discord.MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
            .setTitle(embedinfo.title)
            .setDescription(embedinfo.description)
            .setColor('BLUE')
            .setFooter({ text: `requested by ${message.author.tag}` })
        if (embedinfo.buttons && embedinfo.displayButtonsWhenNonEphemeral) {
            let helpmessage = await message.channel.send({ embeds: [helpembed], components: embedinfo.buttons })
            client.helpmessageownership.set(helpmessage.id, message.author.id)
            setTimeout(() => {
                client.helpmessageownership.delete(helpmessage.id)
            }, 600000);
        } else {
            message.channel.send({ embeds: [helpembed] })
        }
    }
}

const helpcommands = [
    'Ban',
    'Un-Ban',
    'Kick',
    'Mute',
    'Un-Mute',
    'Purge',
    'Durations',
    'Targeting',
    'Modules',
    'Moderation',
    'Administration'
]

async function Command_Invite(message, Discord) {
    const helpembed = new Discord.MessageEmbed()
        .setTitle('Click here to add Ozaibot to a new server.')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=862247858740789269&permissions=30030425343&scope=bot%20applications.commands')
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] });
    return
}

async function Command_AHelp(message, userstatus, Discord, client) {
    if (userstatus == 1) {
        let printarr = []
        client.commands.forEach(entry => {
            if (entry.aliases) {
                entry.aliases.forEach(alias => {
                    printarr.push(alias)
                })
            }
            printarr.push(entry.name)
        });
        let descriptionlength = 0
        printarr.forEach(entry => {
            descriptionlength = descriptionlength + entry.length
        })
        if (descriptionlength > 4000) return message.channel.send('To many commands to say in one embed, make send in better way')
        let printmessage = printarr.filter((a) => a).toString()
        printmessage = printmessage.replace(/,/g, '\n')
        const helpembed = new Discord.MessageEmbed()
            .setTitle('Literally every command')
            .setDescription(`${printmessage}`)
            .setTimestamp()
            .setColor('BLUE')
        message.channel.send({ embeds: [helpembed] });
        return
    }
}

/*
            if (cmd === 'zhelp') {
                // HELP EMBED
                if (!args[0]) {

                    let embed = new Discord.MessageEmbed()

                        .addFields({
                            name: 'Fun',
                            value: '`z!help fun`',
                            inline: true
                        }, {
                            name: 'Stats',
                            value: '`z!help stats`',
                            inline: true
                        }, {
                            name: 'Staff',
                            value: '`z!help staff`',
                            inline: true
                        }, {
                            name: 'Other',
                            value: '`z!help other`',
                            inline: true
                        }, {

                            name: 'Rep',
                            value: '`z!help rep`',
                            inline: true
                        }, { //

                            name: 'Prefix',
                            value: '`z!`',
                            inline: true
                        })

                        .setAuthor('ZackieBot Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
                        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
                        .setColor(`#00ff04`)
                        .setFooter(`If you want any commands added please suggest them.`);

                    message.channel.send({ embeds: [embed] });;
                } console.log(`${message.author.username} has used z!help`)
            } else if (args[0] === `fun` && !args[1]) {
                // FUN COMMANDS
                let embed = new Discord.MessageEmbed();
                let commands = ['howgay', 'simprate', 'pograte', 'ban', 'pp', 'cookie', 'givecookie', 'rate', 'love', 'random', 'react', 'privatemsg', 'piss', 'kill', 'quote', 'ship', 'compliment', 'inspire',]
                for (cmd of commands) {
                    embed.addField('\u200B', '`z!' + cmd + '`', true);
                }

                embed.setAuthor('ZackieBot Fun Commands [PAGE 1]', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
                    .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
                    .setColor(`#00ff04`)
                    .setFooter(`If you want any commands added please suggest them.`)

                message.channel.send({ embeds: [embed] });
            } console.log(`${message.author.username} has used z!help fun`)
        }
        
         else if(args[0] === `fun` && args[1] === `2`) {
    //FUN COMMANDS PAGE 2
    let embed = new Discord.MessageEmbed();
    let commands = ['hug', 'kiss', 'juice', `handhold`, `pat`, `fistbump`, `highfive`]
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }

    embed.setAuthor('ZackieBot Fun Commands [PAGE 2]', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help fun 2`)

                } else if (args[0] === `stats`) {
    // STATS COMMANDS
    let embed = new Discord.MessageEmbed();
    let commands = ['members', 'roadto', `serverinfo`, `userinfo`]
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }

    embed.setAuthor('ZackieBot Stats Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help stats`)

                } else if (args[0] === `staff`) {
    // STAFF COMMANDS
    let embed = new Discord.MessageEmbed();
    let commands = ['appdeny', 'appaccept', 'appvote', 'mute', 'unmute', 'promote', 'demote', 'staffapp']
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }
    embed.setAuthor('ZackieBot Staff Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help staff`)

                } else if (args[0] === `other`) {
    // OTHER COMMANDS
    let embed = new Discord.MessageEmbed();
    let commands = ['vote', 'roll', 'suggest', 'voted', 'ping', 'green', 'nogreen', 'say', 'deadchat', 'verify', 'info', 'list', 'avatar', 'christmas'];
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }

    embed.setAuthor('ZackieBot Other Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help other`)

                } else if (args[0] === `ds`) {
    // DS COMMANDS
    let embed = new Discord.MessageEmbed();
    let commands = ['z!slap', 'z!slay', 'z!giveadmin', 'z!removeadmin', `sm_ban`, `sm_fftoggle`, `sm_ff`];
    for (cmd of commands) {
        embed.addField('\u200B', '`' + cmd + '`', true);
    }
    embed.setAuthor('ZackieBot DS Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help other`)

                } else if (args[0] === `rep`) {
    let embed = new Discord.MessageEmbed();
    let commands = ['rep', 'lb [page]', 'reps', 'reps [@user]', 'reptime', 'repremind', 'repstats', 'totalreps'];
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }
    embed.setAuthor('ZackieBot Rep Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help rep`)

                } else if (args[0] === `bday`) {
    let embed = new Discord.MessageEmbed();
    let commands = ['bday help', 'bday add', 'bday', 'bday edit', 'bday delete', 'bday get'];
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }
    embed.setAuthor('ZackieBot Bday Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help bday`)

                } else if (args[0] === `cookie`) {
    let embed = new Discord.MessageEmbed();
    let commands = ['cookie', 'cookies', 'totalcookies', 'eatcookie', 'shop', 'buy', 'opencrate', 'inv', 'catname', 'rockname', 'cookielb'];
    for (cmd of commands) {
        embed.addField('\u200B', '`z!' + cmd + '`', true);
    }
    embed.setAuthor('ZackieBot Cookie Commands', 'https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png')
        .setThumbnail(`https://cdn.discordapp.com/attachments/763901076423704626/817004809680060436/happyocto.png`)
        .setColor(`#00ff04`)
        .setFooter(`If you want any commands added please suggest them.`)

    message.channel.send({ embeds: [embed] });
} console.log(`${message.author.username} has used z!help bday`)
                } else {
    return message.reply(`You must use either **z!help fun**, **z!help stats**, **z!help staff**, **z!help other** or **z!help rep**.`)
}
return
            } // ozaibot from here
            */