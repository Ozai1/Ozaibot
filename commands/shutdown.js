const { exec } = require("child_process")
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    aliases: ['restart'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '174095706653458432') {
            if (cmd === 'shutdown') {
                await message.react('☑️')
                console.log('Shut down by command')
                for (i = 1000; i >= 0; i = i - 1) { // loop 100 times
                   exec(`forever stop ${i}`) 
                }
            } else if (cmd === 'restart') {
                await message.react('☑️')
                exec('forever restart 0')
            }
        }
    }
}