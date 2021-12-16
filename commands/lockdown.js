module.exports = {
    name: 'lockdown',
    aliases: ['ld'],
    description: 'changes the @ everyone permission of SEND_MESSAGES to the opposet of what it was before',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (message.member.hasPermission('MANAGE_CHANNELS') || userstatus == 1) {
            if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
                message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true, ADD_REACTIONS: true }).then(() => {
                    const msgEmbed = new Discord.MessageEmbed()
                        .setDescription(`lockdown has ended.`)
                        .setColor('GREEN');
                    message.channel.send(msgEmbed);
                })
            } else {
                message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false }).then(() => {

                    const msgEmbed = new Discord.MessageEmbed()
                        .setDescription(`Lockdown has started!`)
                        .setColor('RED');
                    message.channel.send(msgEmbed)
                })
            }
        } else {
            const warningEmbed = new Discord.MessageEmbed()
                .setDescription('You do not have permissions to do this!')
                .setColor('YELLOW');
            message.channel.send(warningEmbed)
        }
    }
}