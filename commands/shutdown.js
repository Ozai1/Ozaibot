module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            message.react('☑️')
            console.log('Shut down by command')
            thisisafunctiontoturnitoff
        }
    }
}