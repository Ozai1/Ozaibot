console.log('Stwarting Ozwaibot!!!');
const { unix } = require('moment');
const { Player } = require('discord-player');
const Discord = require('discord.js');
const { Main_INIT, Pre_Login_INIT } = require('./INIT');
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
      intents: 3276799/* All intents because I have come to use them all :)*/, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone',
});

client.musicConfig = require('./musicconfig');
client.player = new Player(client, client.musicConfig.opt.discordPlayer);
const player = client.player;
client.commands = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler', 'slashcommand_handler'].forEach(handler => {
      require(`./handlers/${handler}`)(client, Discord);
});

Pre_Login_INIT(client, Discord)

client.on('ready', async () => {
      console.log(`Signed into ${client.user.tag}`);
      Main_INIT(client, Discord)
});

client.login(process.env.DISCORD_TOKEN);

player.on('trackStart', (queue, track) => {
      if (!client.musicConfig.opt.loopMessage && queue.repeatMode !== 0) return;
      queue.metadata.send({ content: `**Playing** :notes: \`${track.title}\` - Now!` }).catch(err => { });
});

player.on('trackAdd', (queue, track) => {
      queue.metadata.send({ content: `\`${track.title}\` **added to playlist.** ✅` }).catch(err => { });
});

player.on('tracksAdd', (queue) => {
      queue.metadata.send({ content: `**Added playlist.** ✅` }).catch(err => { });
});

player.on('queueEnd', (queue) => {
      if (client.musicConfig.opt.voiceConfig.leaveOnTimer.status === true) {
            setTimeout(() => {
                  if (queue.connection) queue.connection.disconnect();
                  queue.metadata.send('Disconnected due to inactivity.')
            }, client.musicConfig.opt.voiceConfig.leaveOnTimer.time);
      }
      queue.metadata.send({ content: 'Queue finished!' }).catch(err => { });
});

player.on('botDisconnect', (queue) => {
      queue.metadata.send('Bot has been disconnected.');
      queue.destroy();
});

player.on('connectionError', async (queue, error) => {
      console.log(error)
});

player.on('error', async (queue, error) => {
      console.log(error)
});