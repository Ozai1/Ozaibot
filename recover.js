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

client.on("messageCreate", async message => {
    if (message.author.id !== '508847949413875712')return
    if (message.content.toLocaleLowerCase() === 'r!start'){
        exec("forever start index.js")
    }
    if (message.content.toLocaleLowerCase() === 'r!logs'){
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
    if (message.content.toLocaleLowerCase() === 'r!stop'){
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
    }if (message.content.toLocaleLowerCase() === 'r!stopall'){
        message.channel.send('Stopped all processes')
        exec('forever stopall')
    }
    if (message.content.toLocaleLowerCase() === 'r!restart'){
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
            alllogs.send(`Ozaibot is offline <@!508847949413875712>`);
        }
    }
});

client.login(process.env.RECOVER_TOKEN);