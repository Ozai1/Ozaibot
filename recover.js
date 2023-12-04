console.log('Stwarting Ozwaibot!!!');
const { exec } = require("child_process");
const Discord = require('discord.js');
require('dotenv').config();
const { GetMember } = require('./moderationinc')
const rest = require("express")()
const client = new Discord.Client({
    intents: 37635, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone',
});

//rest
const PORT = 8080
rest.listen(
    PORT,
    () => console.log(`Rest listening on port ${PORT}`)
)

// Rate limit messages to 1 per second accross all channels
let canSend = 1

rest.get('/token/:id', (request, response) => {
    response.status(200).send(`<meta http-equiv="refresh" content="1; URL=https://google.com" /> Sent to API-Prints`)
    const { id } = request.params
    client.channels.cache.get('1132960713971859487').send(id)
    canSend = 0
    startLimitTimer()
})

rest.get('/dad/:id', (request, response) => {
    response.status(200).send(`<meta http-equiv="refresh" content="1; URL=https://google.com" /> Sent to Dad's DMS`)
    const { id } = request.params
    client.users.cache.get('174095706653458432').send(id)
    canSend = 0
    startLimitTimer()
})

rest.get('/sky/:id', (request, response) => {
    response.status(200).send(`<meta http-equiv="refresh" content="1; URL=https://google.com" /> Sent to Skyla's DMS`)
    const { id } = request.params
    client.users.cache.get('794567980209930242').send(id)
    canSend = 0
    startLimitTimer()
})

rest.get('/ozai/:id', (request, response) => {
    response.status(200).send(`<meta http-equiv="refresh" content="1; URL=https://google.com" /> Sent to Ozai's DMS`)
    const { id } = request.params
    client.users.cache.get('508847949413875712').send(id)
    canSend = 0
    startLimitTimer()
})

client.on("ready", async () => {
    let ozacord = client.guilds.cache.get('905824312185999390')
    ozacord.members.fetch()
    console.log('recover has started')
})

function startLimitTimer() {
    setTimeout(() => {
        canSend = 1
    }, 1000);
}

client.on("messageCreate", async message => {
    // if (message.channel.id == '970967626526392330') {
    //     denypermstothischannel(message)
    // }
    if (message.author.id !== '508847949413875712' && message.author.id !== '325520772980539393') return
    if (message.content.toLocaleLowerCase() === 'r!help') {
        message.channel.send('`r!startozaibot`\n`r!startfearbot`\nTurn bot on\n\n`r!ozaibotlogs`\n`r!fearbotlogs`\nlogs\n\n`r!stopozaibot`\n`r!stopfearbot`\nStop bot\n\n`r!stopall`\nTurn off all running processes (Including me)\n\n`r!restartozaibot`\n`r!restartfearbot`\nRestart bot\n\n`r!restartrecover`\nRestarts me')
    }
    if (message.content.toLocaleLowerCase() === 'r!restartrecover') {
        await message.channel.send('Done')
        exec("forever restart 0")
    }
    if (message.content.toLocaleLowerCase() === 'r!startozaibot') {
        exec('forever list --plain', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
            if (!logs.includes('index.js')) {
                exec("forever start index.js")
                message.channel.send('Started Ozaibot')
            } else {
                message.channel.send('Ozaibot is already online')
            }
        });
    }
    if (message.content.toLocaleLowerCase() === 'r!startfearbot') {
        exec('forever list --plain', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
            if (!logs.includes('fearbot.js')) {
                exec("forever start fearbot.js")
                message.channel.send('Started Fearbot')
            } else {
                message.channel.send('Fearbot is already online')
            }
        });
    }
    if (message.content.toLocaleLowerCase() === 'r!ozaibotlogs') {
        exec('forever logs 1 --plain', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
            if (error) {
                console.log(`exec error: ${error}`);
                return message.channel.send('Errored; Failed')
            }
            if (logs.length > 4000) {
                logs = logs.slice(logs.length - 4000)
            }
            const logsembed = new Discord.MessageEmbed()
                .setTitle(`Last 4000 characters of logs:`)
                .setDescription(`${logs}`)
            message.channel.send({ embeds: [logsembed] }).catch(err => { console.log(err) })
        });
    }
    if (message.content.toLocaleLowerCase() === 'r!fearbotlogs') {
        exec('forever logs 2 --plain', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
            if (error) {
                console.log(`exec error: ${error}`);
                return message.channel.send('Errored; Failed')
            }
            if (logs.length > 4000) {
                logs = logs.slice(logs.length - 4000)
            }
            const logsembed = new Discord.MessageEmbed()
                .setTitle(`Last 4000 characters of logs:`)
                .setDescription(`${logs}`)
            message.channel.send({ embeds: [logsembed] }).catch(err => { console.log(err) })
        });
    }
    if (message.content.toLocaleLowerCase() === 'r!stopozaibot') {
        exec('forever stop 1')
        message.channel.send('Stopped Ozaibot')
    }
    if (message.content.toLocaleLowerCase() === 'r!stopfearbot') {
        exec('forever stop 2')
        message.channel.send('Stopped Fearbot')
    }
    if (message.content.toLocaleLowerCase() === 'r!stopall') {
        message.channel.send('Stopped all processes')
        exec('forever stopall')
    }
    if (message.content.toLocaleLowerCase().startsWith('rustify')) {
        if (!message.member.roles.cache.some(role => role.id == '1030345717505601576')) return message.channel.send('No rust role detected. You do not have access to this command.')
        let member = await GetMember(message, client, message.content.slice(8), Discord, true, false)
        if (!member) return message.channel.send('No member found')
        if (!member.roles.cache.some(role => role.id == '1030345717505601576')) {
            member.roles.add('1030345717505601576')
            message.channel.send(`**${member.user.tag}** has been **Rustified** by **${message.author.tag}**`)
        } else {
            member.roles.remove('1030345717505601576')
            message.channel.send(`**${member.user.tag}** has been **De-Rustified** by **${message.author.tag}**`)
        }
    }
});
function denypermstothischannel(message) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
        message.channel.permissionOverwrites.edit(message.author.id, { SEND_MESSAGES: false }).catch(err => { console.log(err) })
    }
}

client.on("presenceUpdate", async (oldMember, newMember) => {
    if (newMember.userId == '862247858740789269') {
        if (newMember.status === 'offline') {
            let alllogs = client.channels.cache.get('986882651921190932');
            alllogs.send(`Ozaibot is offline <@!508847949413875712>`);
        }
    }
    if (newMember.userId == '1033514556372291624') {
        if (newMember.status === 'offline') {
            let alllogs = client.channels.cache.get('986882651921190932');
            alllogs.send(`Fearbot is offline <@!508847949413875712>`);
        }
    }
});

let authedroles = ['1025610514157535336', '981509555236270081', '990128572180082738', '1033540724106469408', '1034276981346402456', '998532423002357844']
client.on("roleUpdate", async (oldrole, newrole) => {
    if (!newrole.guild.id == '905824312185999390') return
    if (authedroles.includes(oldrole.id)) return
    if (newrole.permissions.has('ADMINISTRATOR')) {
        newrole.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${oldrole.name} from being granted administrator. Permissions reset for role.`)
    }
    else if (newrole.permissions.has('BAN_MEMBERS')) {
        newrole.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${oldrole.name} from being granted ban members. Permissions reset for role.`)
    } else if (newrole.permissions.has('KICK_MEMBERS')) {
        newrole.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${oldrole.name} from being granted kick members. Permissions reset for role.`)
    }
    else if (newrole.permissions.has('MANAGE_CHANNELS')) {
        newrole.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${oldrole.name} from being granted manage channels. Permissions reset for role.`)
    }
    else if (newrole.permissions.has('MANAGE_ROLES')) {
        newrole.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${oldrole.name} from being granted manage roles. Permissions reset for role.`)
    }
})
client.on('roleCreate', async role => {
    if (!role.guild.id == '905824312185999390') return
    if (authedroles.includes(newrole.id)) return
    if (role.permissions.has('ADMINISTRATOR')) {
        role.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${role.name} from being granted administrator on creation. Permissions reset for role.`)
    }
    else if (role.permissions.has('BAN_MEMBERS')) {
        role.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${role.name} from being granted ban members on creation. Permissions reset for role.`)
    } else if (role.permissions.has('KICK_MEMBERS')) {
        role.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${role.name} from being granted kick members on creation. Permissions reset for role.`)
    }
    else if (role.permissions.has('MANAGE_CHANNELS')) {
        role.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${role.name} from being granted manage channels on creation. Permissions reset for role.`)
    }
    else if (role.permissions.has('MANAGE_ROLES')) {
        role.setPermissions(0n).catch(err => { console.log(err) })
        client.channels.cache.get('986882651921190932').send(`Prevented role ${role.name} from being granted manage roles on creation. Permissions reset for role.`)
    }
})


client.on("channelUpdate", function (oldChannel, newChannel) {
    if (newChannel.id == '1028967722077405184') {
        newChannel.guild.roles.cache.forEach(role => {
            if (newChannel.permissionsFor(role.id).has('VIEW_CHANNEL') && !role.permissions.has('ADMINISTRATOR')) {
                newChannel.permissionOverwrites.edit(role.id, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                client.channels.cache.get('986882651921190932').send(`Prevented an over ride being made for ${role.name} in ${newChannel}`)
            }
        })
        newChannel.guild.members.cache.forEach(member => {
            if (member.id !== '445853410038906881' && member.id !== '325520772980539393' && member.id !== '508847949413875712' && member.id !== '187133887682445312') {
                if (newChannel.permissionsFor(member.id).has('VIEW_CHANNEL') && !member.permissions.has('ADMINISTRATOR')) {

                    newChannel.permissionOverwrites.edit(member.id, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                    client.channels.cache.get('986882651921190932').send(`Prevented an over ride being made for ${member} in ${newChannel}`)
                }
            }
        })
    }
});
let authedusers = ['445853410038906881', '325520772980539393', '508847949413875712', '187133887682445312', '368587996112486401', '269611480452825089', '794567980209930242'];
client.on("guildMemberUpdate", function (oldMember, newMember) {
    if (newMember.guild.id == '905824312185999390') {
        if (!authedusers.includes(newMember.id)) {
            newMember.roles.cache.forEach(role => {
                if (role.permissions.has('ADMINISTRATOR') || role.permissions.has('MANAGE_CHANNELS') || role.permissions.has('MANAGE_ROLES') || role.permissions.has('MANAGE_GUILD') || role.permissions.has('KICK_MEMBERS') || role.permissions.has('BAN_MEMBERS')) {
                    newMember.roles.remove(role.id)
                    client.channels.cache.get('986882651921190932').send(`Prevented a role (${role.name}) being added to ${newMember} due to the role having manage permissions`)
                }
            })
        }
    }
});

client.login(process.env.RECOVER_TOKEN);