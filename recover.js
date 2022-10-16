console.log('Stwarting Ozwaibot!!!');
const { unix } = require('moment');
const { exec } = require("child_process");
const Discord = require('discord.js');
const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createPool({
    host: '112.213.34.137',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const client = new Discord.Client({
    intents: 37635, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone',
});

client.on("ready", async () => {
    let ozacord = client.guilds.cache.get('905824312185999390')
    ozacord.members.fetch()
    console.log('recover has started')
})
client.on("messageCreate", async message => {
    if (message.author.id !== '508847949413875712' && message.author.id !== '325520772980539393') return
    if (message.content.toLocaleLowerCase() === 'r!help') {
        message.channel.send('`r!start`\nTurn Ozaibot on\n\n`r!logs`\nOzaibot logs\n\n`r!stop`\nStop Ozaibot\n\n`r!stopall`\nTurn off all running processes (Including me)\n\n`r!restart`\nRestart Ozaibot\n\n`r!restartrecover`\nRestarts me')
    }
    if (message.content.toLocaleLowerCase() === 'r!restartrecover') {
        await message.channel.send('Done')
        exec("forever restart 0")
    }
    if (message.content.toLocaleLowerCase() === 'r!start') {
        exec('forever list --plain', (error, logs /*this is everything */, stderrors /*this will be only errors in the logs*/) => {
            if (!logs.includes('index.js')) {
                exec("forever start index.js")
                message.channel.send('Started Ozaibot')
            }else{
                message.channel.send('Ozaibot is already online')
            }
        });
    }
    if (message.content.toLocaleLowerCase() === 'r!logs') {
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
    if (message.content.toLocaleLowerCase() === 'r!stop') {
        exec('forever stop 1')
        exec('forever stop 2')
        exec('forever stop 3')
        exec('forever stop 4')
        exec('forever stop 5')
        exec('forever stop 6')
        exec('forever stop 7')
        exec('forever stop 8')
        exec('forever stop 9')
        exec('forever stop 10')
        message.channel.send('Stopped processes')
    } if (message.content.toLocaleLowerCase() === 'r!stopall') {
        message.channel.send('Stopped all processes')
        exec('forever stopall')
    }
    if (message.content.toLocaleLowerCase() === 'r!restart') {
        exec('forever stop 1')
        exec('forever stop 2')
        exec('forever stop 3')
        exec('forever stop 4')
        exec('forever stop 5')
        exec('forever stop 6')
        exec('forever stop 7')
        exec('forever start index.js')
        message.channel.send('restarting ozaibot')
    }
});

client.on("presenceUpdate", async (oldMember, newMember) => {
    if (newMember.userId == '862247858740789269') {
        if (newMember.status === 'offline') {
            let alllogs = client.channels.cache.get('986882651921190932');
            alllogs.send(`Ozaibot is offline <@!508847949413875712>`);
        }
    }
});

client.on("channelUpdate", function (oldChannel, newChannel) {
    if (newChannel.id == '1028967722077405184') {
        newChannel.guild.roles.cache.forEach(role => {
            if (newChannel.permissionsFor(role.id).has('VIEW_CHANNEL') && !role.permissions.has('ADMINISTRATOR')) {
                newChannel.permissionOverwrites.edit(role.id, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                client.channels.cache.get('986882651921190932').send(`Prevented an over ride being made for ${role.name} in ${newChannel}`)
            }
        })

        newChannel.guild.members.cache.forEach(member => {
            if (member.id !== '445853410038906881' && member.id !== '325520772980539393' && member.id !== '508847949413875712'&& member.id !== '187133887682445312') {
                if (newChannel.permissionsFor(member.id).has('VIEW_CHANNEL') && !member.permissions.has('ADMINISTRATOR')) {

                    newChannel.permissionOverwrites.edit(member.id, { VIEW_CHANNEL: false }).catch(err => { console.log(err) })
                    client.channels.cache.get('986882651921190932').send(`Prevented an over ride being made for ${member} in ${newChannel}`)
                }
            }
        })
    }
});

client.on("guildMemberUpdate", function (oldMember, newMember) {
    if (newMember.guild.id == '905824312185999390') {
        if (newMember.id !== '445853410038906881' && newMember.id !== '325520772980539393' && newMember.id !== '508847949413875712') {
            newMember.roles.cache.forEach(role => {
                if (role.permissions.has('ADMINISTRATOR') || role.permissions.has('MANAGE_CHANNELS') || role.permissions.has('MANAGE_ROLES')|| role.permissions.has('MANAGE_GUILD')|| role.permissions.has('KICK_MEMBERS') || role.permissions.has('BAN_MEMBERS')) {
                    newMember.roles.remove(role.id)
                    client.channels.cache.get('986882651921190932').send(`Prevented a role (${role.name}) being added to ${newMember} due to the role having manage permissions`)
                }
            })
        }
    }
});

client.login(process.env.RECOVER_TOKEN);