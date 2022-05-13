const fs = require('fs');


module.exports = (client, Discord) => {
    const command_files = fs.readdirSync('./slashcommands/').filter(file => file.endsWith('.js'));
    for(const file of command_files) {
        const command = require(`../slashcommands/${file}`);
        if (command.name) {
            client.slashcommands.set(command.name, command)
        } else {
            continue;
        }
    }
}