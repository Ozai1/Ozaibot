const { exec } = require("child_process")
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    aliases: ['restart'],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1 || message.author.id == '508847949413875712' || message.author.id == '174095706653458432') {
            if (cmd === 'shutdown') {
                message.react('☑️')
                console.log('Shut down by command')
                exec(`forever stopall`)
            } else if (cmd === 'restart') {
                message.delete()
                exec('forever restart 0')
            }
        }
    }
}