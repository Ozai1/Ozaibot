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
const Help_Responses = new Map()
module.exports = {
    name: 'help',
    aliases: ['zhelp', 'invite', 'ahelp'],
    description: 'sends a help message',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (cmd === 'invite') return Command_Invite(message, Discord)
        if (cmd === 'ahelp') return Command_AHelp(message, userstatus, Discord, client)
        let prefix = 'sm_';
        query = "SELECT * FROM prefixes WHERE serverid = ?";
        if (message.guild) {
            data = [message.guild.id]
        } else {
            data = [7777]
        }
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
            for (row of results) {
                prefix = row["prefix"];
            }
            if (!args[0]) {
                message.channel.send('dbdasf')
            } else {
                if (Help_Responses.has(args[0].toLowerCase())) {
                    const returnmessage = Help_Responses.get(args[0].toLowerCase())
                    returnmessage(message, Discord, userstatus)
                } else {
                    message.channel.send({ content: `Command / module not found. Please check your spelling.` })
                }
            }
        })
    }
}
const helpcommands = [
    'Ban',
    'Un-Ban',
    'Kick',
    'Mute',
    'Un-Mute',
    'Purge',
    'durations',
    'targeting'
]
module.exports.Help_INIT2 = () => {
    //ban
    Help_Responses.set('ban', HELP_EMBED_BAN)
    Help_Responses.set('b', HELP_EMBED_BAN)
    Help_Responses.set('unban', HELP_EMBED_UNBAN)
    //kick
    Help_Responses.set('kick', HELP_EMBED_KICK)
    Help_Responses.set('k', HELP_EMBED_KICK)
    //mute
    Help_Responses.set('mute', HELP_EMBED_MUTE)
    Help_Responses.set('m', HELP_EMBED_MUTE)
    Help_Responses.set('unmute', HELP_EMBED_UNMUTE)
    Help_Responses.set('un-mute', HELP_EMBED_UNMUTE)
    Help_Responses.set('unm', HELP_EMBED_UNMUTE)

    //rename
    Help_Responses.set('rename', HELP_EMBED_RENAME)
    //purge
    Help_Responses.set('purge', HELP_EMBED_PURGE)
    Help_Responses.set('clear', HELP_EMBED_PURGE)
    Help_Responses.set('prune', HELP_EMBED_PURGE)
    //user
    Help_Responses.set('user', HELP_EMBED_USER_COMMAND)
    Help_Responses.set('ui', HELP_EMBED_USER_COMMAND)
    Help_Responses.set('who', HELP_EMBED_USER_COMMAND)
    Help_Responses.set('whois', HELP_EMBED_USER_COMMAND)
    Help_Responses.set('user-info', HELP_EMBED_USER_COMMAND)
    Help_Responses.set('userinfo', HELP_EMBED_USER_COMMAND)
    //softban
    Help_Responses.set('softban', HELP_EMBED_SOFTBAN)
    Help_Responses.set('soft-ban', HELP_EMBED_SOFTBAN)
    Help_Responses.set('sb', HELP_EMBED_SOFTBAN)
    //MISC
    Help_Responses.set('help', HELP_EMBED_HELP)
    Help_Responses.set('times', HELP_EMBED_TIMES)
    Help_Responses.set('targeting', HELP_EMBED_TARGETING)
    Help_Responses.set('targets', HELP_EMBED_TARGETING)

}

async function HELP_EMBED_SOFTBAN(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Soft-Ban')
        .setDescription(` gbkhnjm`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_USER_COMMAND(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('User Information')
        .setDescription(`nhnjl dfj`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_TARGETING(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Targeting Users')
        .setDescription(`Targets!\nIn commands, there is often an arguement called **member**, this is where you will use this knowledge.\n\n**There are 3 main ways of targeting a user:**\n\`#1\` Mentioning them. \`@user\`. simple.\n\`#2\` Using their ID. \`mute 862247858740789269 1d\` is a valid command.\n\`#3\` Using their names. \`mute ozaibot\` is a valid command.\n\n\n**Using names to target:**\nIf two people have overlapping names, you can add the # to their name like so: \`mute Ozaibot#3594\`.\nIt is recommended to just use IDs when name targeting becomes complicated.\nName targeting ignores capitalization completely.\nIf two people have overlapping names with the same tag but different capitalization it will select both of them.\nIf more than one user is found the bot can reply with an embed asking what member you meant.\nSimply follow the prompt and select the number next to the member to target them.\nIf more than 9 members are found, it will simply respond with invalid member.\n\nIf at any point mentioning members and using their names becomes impractical, it is recommended to use IDs.\nIDs are intangible, quick and easy to use.\n\nTo grab people's IDs you must enable developer mode through settings.\nYou can do that like this:\n\`Settings\` -> \`Advanced\` -> \`Developer Mode\`.\nOnce it is activated open someone's profile in a server, scroll to the bottom and there should be a \`Copy ID\` button.\n\nWith these three ways you will now be able to effectively target people.\nUsing IDs you can target people off server. \nSimply grab their ID and use it in the member argument and you can use some commands on them, such as ban.`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_TIMES(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Time Durations')
        .setDescription(`This is the way that the bot knows for how long to keep a punishemnt active on a user.\nAll commands that use custom durations will follow and use this system.\n\n**second:**\n\`seconds\` \`second\` \`secs\` \`sec\` \`s\`\n\n**minute:**\n\`minutes\` \`minute\` \`mins\` \`min\` \`m\`\n\n**hour:**\n\`hours\` \`hour\` \`h\`\n\n**day:**\n\`days\` \`day\` \`d\`\n\n**week:**\n\`weeks\` \`week\` \`w\`\n\n**month:**\n\`months\` \`month\` \`mon\`\n\n\nThese units of time are to be apended to a number.\n\n**Examples:**\n\`1mon\`\n\`3.4d\`\n\`0.875weeks\`\n\`mute @ozaibot 2h\``)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_BAN(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Ban')
        .setDescription(`Removes a user from the server and prevents them from rejoining.\n\nHowever many days of the user's messages are specified will be deleted.\nMax of 7 days worth of messages can be deleted, defaults to 0 days.\n\n**Usage:**\n\`ban <@user|user_id> <days to delete> <reason>\`\n\n**Examples:**\n\`ban @user called me a no no name\`\n\`ban @user 1 unspeakable things\`\n\`ban 862247858740789269 off server ban so they cant join\`\n\n**Aliases:**\n\`b\`\n\n**Reversal Command:**\n\`unban\`\n\n**Permissions:**\nBan Members.\n`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_KICK(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('kick')
        .setDescription(`Removes a user from the server.\nUsers who are kicked will need to be sent an invite in order to rejoin.\n\n**Usage:**\n\`kick <@user|user_id> <reason>\`\n\n**Examples:**\n\`kick @user\`\n\`kick @user spam\`\n\n**Aliases:**\n\`k\`\n\n**Permissions:**\nKick Members.\n`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_MUTE(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Mute')
        .setDescription(`Prevents a user from speaking in text channels.\nCommand will not work until a mute role has been set,\nYou can set a muterole with the \`muterole\`command.\n\n**Usage:**\n\`mute <@user|user_id> <time> <reason>\`\n\n**Examples:**\n\`mute @user\`\n\`mute @user spam\`\n\`mute @user 1h bad words\`\n\n**Aliases:**\n\`m\`\n\n**Reversal Command:**\n\`unmute\`\n\n**Permissions:**\nManage Messages.\n`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_RENAME(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Re-Name')
        .setDescription(`rthgg`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_UNBAN(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Un-Ban')
        .setDescription(`fasd`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_UNMUTE(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Mute')
        .setDescription(`tyh`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_PURGE(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Purge')
        .setDescription(`Bulk deletes messages.\nMaximum amount of messages that can be deleted is 1000.\n\n**Usage:**\n\`purge <amount> <filters>\`\n\n**Purge filters**:\n\`@user\` \`silent\` \`links\` \`invites\` \`bots\` \`embeds\` \`files\` \`users\` \`images\` \`pins\` \`mentions\` \`stickers\`\n\nApplying options to the command will make the command search within the amount specified for messages that match the filer.\n*The bot will not look indefinitely until the amount is filled with messages that match.*\nAdding a user(s) will make the bot only search through those user(s) messages and ignore all others regardless of filters.\nThe silent filter will delete the command message and the bots confirmation after the purge is complete.\n\n**Examples:**\n\`purge 50\`\n\`purge 200 @user\`\n\`purge 25 links @user\`\n\`purge 400 @user links images invites silent\`\n\n**Aliases:**\n\`prune\`\n\`clear\`\n\n**Permissions:**\nManage Messages.\n`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

async function HELP_EMBED_HELP(message, Discord, userstatus) {
    const helpembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setTitle('Help')
        .setDescription(`gerdf`)
        .setColor('BLUE')
    message.channel.send({ embeds: [helpembed] })
}

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