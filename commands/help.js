const mysql = require('mysql2')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    name: 'help',
    aliases: ['ahelp', 'zhelp'],
    description: 'sends a help message',
    async execute(message, client, cmd, args, Discord, userstatus) {
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
            if (cmd === 'ahelp') {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: ('All commands'),
                        fields: [
                            { name: `**MAKE SURE TO USE THE PREFIX** "${prefix}"`, value: "**ping**\n **kick** <@user> <reason>\n **ban** <@user> <reason>\n **say** <message>\n **slowsaydel** <message>\n **gmm** <time in milliseconds> <message>\n **help** <command_name(optional)>\n **masssay** <message>\n **purge** <message count>\n **rename** <@user> <name>\n **channelname** <name>\n **servername** <name>\n **fakemsgdel** <@user> <message>\n **takeaway** <up to 3 numbers>\n **vc** <kick|mute|unmute|deafen|undeafen> <@user>\n **pm** <stealth/raw(optional)> <@user> <message>\n **hug** <@user>\n **crole** <#color(optional)> <name>\n **infisay** <message>\n **cock** <manual(optional)> <@user(optional)> <size>\n **kiss** <@user>\n **unblacklist**\n **prefix** <new_prefix>\n **channelban** <@user>\n **drole** <role_name>\n **pchannel** <channel name>\n **dchannel** <channel name>\n **cvc** <voice call name>", inline: true },
                            { name: "** **                    ", value: "**giveadmin** <@user> <time in milliseconds>\n **embedsay** <message>\n **blacklist** <user>\n **add** <up to ten numbers>\n **mute** <@user> & unmute <@user> \n **plsay** <1 message sent per word>\n **shutdown**\n  **status** <idle/dnd/online>or<play/watch/listen/compete>or<none> <text>\n **addtoautoban** <@user>\n **masssaydel** <message>\n **secretcommand** <password>\n **arole** <@user> <role_name>\n **lockdown** <start|stop|end|>\n **pin** <message>\n **rrole** <@user> <role_name>\n **leaveguild**\n **listguilds**\n **hidechannel**\n **addtochannel** <@user>\n **removebotadmin** <@user>\n **cherry**\n **getguildchannels** <guild_id>\n **removeadmin** <@user>\n **getinvite** <channel_id>\n **unban** <user_id>\n **cchannel** <channel name>\n **pvc** <voice call name>", inline: true },
                        ]
                    }
                });
                return
            }
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

                    message.channel.send(embed);
                    console.log(`${message.author.username} has used z!help`)
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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help fun`)

                } else if (args[0] === `fun` && args[1] === `2`) {
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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help fun 2`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help stats`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help staff`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help other`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help other`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help rep`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help bday`)

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

                    message.channel.send(embed)
                    console.log(`${message.author.username} has used z!help bday`)
                } else {
                    return message.reply(`You must use either **z!help fun**, **z!help stats**, **z!help staff**, **z!help other** or **z!help rep**.`)
                }
                return
            } // ozaibot from here
            if (!args[0]) {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: ('Standard Commands.'),
                        fields: [
                            { name: `'**${prefix}help <commandname>**'`, value: "Ping\nHelp\nKick\nBan\nPurge\nRename\nAdd\nPoll", inline: true },
                            { name: "** **                    ", value: `Unmute\nPM\nLockdown\nMute\nTakeaway\nRandom\nSay\nMusic`, inline: true },
                        ]
                    }
                });
            } else {
                let command_chosen = args[0].toLowerCase();
                if (command_chosen === 'ping') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`**sm_ping**`, `Just a text response command, used a lot to check if the bot is online.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'help') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`**sm_help <command_name(optional)>**`, `Gives you a guide and discription of a command. \n if you dont select a command to get info on then it will give you a list of commands.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'kick') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`**sm_kick <@user> <reason>**`, `Kicks the user from the server. \nSends a message to the kicked user stating who and why they were kicked. \nPermissions: Kick Members.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'ban') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_ban <@user> <reason>`, `Bans a user from the server. \nIt will send a message to the banned user stating who and why they were banned. \nThe reason will be the ban reason in server settings. \nPermissions: Ban Members.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'purge') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_purge <number_of_messages_to_be_deleted>`, `Deletes the amount of messages given. \nIf only 1 or less messages are given then it will just delete your command message. \nMax messages to delete is 100\nPermissions: Manage Channels.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'Rename') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_rename <@user> <new name>`, `Renames the user.\nPermissions: Manage Nicknames.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'add') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_add <Number1> <Number2> <Number3(Optional)> <Number4(Optional)> <Number5(Optional)> <Number6(Optional)> <Number7(Optional)> <Number8(Optional)> <Number9(Optional)> <Number10(Optional)>`, `Adds the numbers together and tells you the answer.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'mute') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_mute <@user>`, `Adds a muted role to the user so they cannot speak in any channels. \nIf no muted role is found it will create one. \nPermissions: Manage Channels`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'takeaway') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_takeaway <Number1> <Number2> <Number3(Optional)>`, `Subtracts the numbers and tells you the answer.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'unmute') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_unmute <@user>`, `Removes the muted role from the mentioned user. \nPermissions: Manage Channels`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'pm') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_pm <stealth(Optional)> <@user> <message to send to them>`, `Sends your message to the mentioned user through the bot. \nIf stealth was added it does not say who the message is from.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'lockdown') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_lockdown <start|stop|end>`, `Edits the permissions of the channel so no one can send messages but Administrators and people with pre-existing overides. \nIf you do not tell the command what to do it will assume to start a lockdown, but you must use stop/end to stop it. \nPermissions: Manage Channels`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'random') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_random <no0(optional) | number(put number here if you did not select no0)> <number(if no0 was selected only would it go here)> or sm_random <option1> <option2> <option3> <option4> <option5> (options can keep going up to 50) `, `Pseudorandomly generates a number or word.\nIf you only use 1 number it will randomize that number between 0 and the number and include 0 as a number.\nIf you include no0 it will randomize the number but it will not include 0 so it has less chances due to it starting from 1 instead of 0\n if you do not use just 1 number with or without no0 it will randomize all of the words you state.\nIf you wish to randomize sentences use_underscores_inbetween_words_instead_of_spaces for each sentence and then use a space to end the sentence and start the next one that may be chosen.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'report') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_report <issue goes here>`, `Use this command for reporting issues with the bot, all issues are welcome no matter how small, refining the bot is important.\nDo not spam the command, it pings me twice and logs it to my bots console. I will see it.\nThe bot isn't perfect so don't hesitate to chuck me a message, please greatly detail the issue so I can fix it properly.\nThis command can also be used for suggestions, if you want something added, ask!\nI appreciate all issues sent, it helps me a lot. Cheers.`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'say') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_say <message to repeat>`, `Repeats what you say in chat.\nIt does not filter out @ everyone or @role pings so use it with care, don't even toy with everyone and role pings, you never know when it may ping.\nDont abuse it in ways like making it say dumb shit then pitting it on the bot, its not a good look on me.\nPermissions: Administrator`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'nickname') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_nickname <nickname>`, `Sets the bots nickname.\nPermissions: Manage Server`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'prefix') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`sm_prefix <prefix>`, `Sets the bots prefix.\nIf you manage to lose the prefix message me <@508847949413875712> (508847949413875712) and I will reset it for you. Permissions: Manage Server`)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'poll') {
                    const helpembed = new Discord.MessageEmbed()
                        .addField(`\`sm_poll "poll name" "option1" "option2" "option3" ect.\``, `Must include the poll name but all options are not needed\nMax of 10 options\nAll of the options and the poll name must be enclosed in speech marks, eg. \n\`sm_poll "example name!" "This would be option A" "This would be option B" "This would be option C"\``)
                        .setTimestamp()
                        .setColor('BLUE')
                    message.channel.send(helpembed);
                    return
                } else if (command_chosen === 'botadmin') {
                    if (userstatus == 1) {
                        message.channel.send({
                            embed: {
                                color: 3447003,
                                title: ('All commands'),
                                fields: [
                                    { name: `**MAKE SURE TO USE THE PREFIX** "${prefix}"`, value: "**ping**\n **kick** <@user> <reason>\n **ban** <@user> <reason>\n **say** <message>\n **slowsaydel** <message>\n **gmm** <time in milliseconds> <message>\n **help** <command_name(optional)>\n **masssay** <message>\n **purge** <message count>\n **rename** <@user> <name>\n **channelname** <name>\n **servername** <name>\n **fakemsgdel** <@user> <message>\n **takeaway** <up to 3 numbers>\n **vc** <kick|mute|unmute|deafen|undeafen> <@user>\n **pm** <stealth/raw(optional)> <@user> <message>\n **hug** <@user>\n **crole** <#color(optional)> <name>\n **infisay** <message>\n **cock** <manual(optional)> <@user(optional)> <size>\n **kiss** <@user>\n **unblacklist**\n **prefix** <new_prefix>\n **channelban** <@user>\n **drole** <role_name>\n **pchannel** <channel name>\n **dchannel** <channel name>\n **cvc** <voice call name>", inline: true },
                                    { name: "** **                    ", value: "**giveadmin** <@user> <time in milliseconds>\n **embedsay** <message>\n **blacklist** <user>\n **add** <up to ten numbers>\n **mute** <@user> & unmute <@user> \n **plsay** <1 message sent per word>\n **shutdown**\n  **status** <idle/dnd/online>or<play/watch/listen/compete>or<none> <text>\n **addtoautoban** <@user>\n **masssaydel** <message>\n **secretcommand** <password>\n **arole** <@user> <role_name>\n **lockdown** <start|stop|end|>\n **pin** <message>\n **rrole** <@user> <role_name>\n **leaveguild**\n **listguilds**\n **hidechannel**\n **addtochannel** <@user>\n **removebotadmin** <@user>\n **cherry**\n **getguildchannels** <guild_id>\n **removeadmin** <@user>\n **getinvite** <channel_id>\n **unban** <user_id>\n **cchannel** <channel name>\n **pvc** <voice call name>", inline: true },
                                ]
                            }
                        });
                    }
                } else if (command_chosen === 'music') {
                    const helpembed = new Discord.MessageEmbed()
                    .addField(`This is more of a category than one command.`, `**sm_play <song name | song url>**(youtube links only for urls)\n\nThis command has the bot join the channel that you are in and play music!\nIf there is already a song playing it will add the song you have chosen to a queue and play it when the rest of the queue has finished.\n\n**sm_skip**\n\nThis skips the current song\n\n**sm_stop**\nAliases: leave, fuckoff, dc, disconnect.\nClears the queue and has the bot leave the channel.\n\n**sm_pause**\n\nPauses the music, its literally that simple.\n\n**sm_resume**\nAliases: unpause.\nStarts the music again after being paused.\n\n**sm_debug**\n\nResets the bot in your server so that it can be recovered from errors, if the bot stops working for whatever reason use this command and it *should* be fixed\n\nIf you have any issues or suggestions chuck us an sm_report <issue>`)
                    .setTimestamp()
                    .setColor('BLUE')
                message.channel.send(helpembed);
                return
                } else {
                    message.reply(`That is either not a command, is spelt incorrectly or has not been added to sm_help yet.`)
                }
            }
        })
    }
}