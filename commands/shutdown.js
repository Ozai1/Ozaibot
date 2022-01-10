
module.exports = {
    name: 'shutdown',
    description: 'turns the bot off',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (userstatus == 1) {
            await message.react('☑️')
            console.log('Shut down by command')
            this_is_a_function_to_replace_client_destroy
        }
    }
}