console.log('Stwarting Ozwaibot!!!');
const Discord = require('discord.js');
const { Main_INIT, Pre_Login_INIT } = require('./INIT');
require('dotenv').config();

const client = new Discord.Client({
      intents: 3276799/* All intents because I have come to use them all :)*/, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], disableMentions: 'everyone',
});
Pre_Login_INIT(client, Discord);

['command_handler', 'event_handler', 'slashcommand_handler'].forEach(handler => {
      require(`./handlers/${handler}`)(client, Discord);
});

client.on('ready', async () => {
      console.log(`Signed into ${client.user.tag}`);
      Main_INIT(client, Discord);
});

client.login(process.env.DISCORD_TOKEN);