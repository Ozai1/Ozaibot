const { unix } = require("moment");
const imissjansomuchithurts = 1420070400000
const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf())
const mysql = require('mysql2');
const {GetDatabasePassword} = require('../hotshit')
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: GetDatabasePassword(),
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

module.exports = {
    name: 'newpurge',
    aliases: [],
    description: 'Deletes messages in bulk',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        const conformationmessage = await message.channel.send('Deleting messages...').catch(err => { return console.log(err) })

        if (!message.member.permissionsIn(message.channel).has("MANAGE_MESSAGES")) {
            console.log('You do not have permissions to use this command')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setColor(15684432)
                .setDescription(`You do not hvae the permissions required to use this command.`)
            return conformationmessage.edit({ embeds: [errorembed] })
        }
        if (!message.guild.me.permissionsIn(message.channel).has("MANAGE_MESSAGES")) {
            conformationmessage.edit('Ozaibot does not have permissions to delete messages in this channel.')
        }

        if (isNaN(args[0]) || !args[0]) return conformationmessage.edit('Usage: `sm_purge <amount> <options>`')

        if (args[1]) {
            if (isNaN(args[0])) return conformationmessage.edit('Usage: `sm_purge <amount> <options>`')
            const argsminusamount = args.shift()
            ExecuteBulkDeleteWithOptions
            let member = undefined;
            let silent = false;
            let haslinks = false;
            let hasinvites = false;
            let hasbots = false;
            let hasembeds = false;
            let hasfiles = false;
            let hasusers = false;
            let hasimages = false;
            let haspins = false;
            let hasmentions = false;
            argsminusamount.forEach(async arg => {
                let member2 = message.guild.members.cache.get(args[0].slice(3, -1)) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(args[0].slice(2, -1));
                if (member2) {
                    member = member2;
                }
                if (arg.toLowerCase() === 'silent') {
                    silent = true;
                } else if (arg.toLowerCase() === 'links') {
                    haslinks = true
                } else if (arg.toLowerCase() === 'invites') {
                    hasinvites = true
                } else if (arg.toLowerCase() === 'bots') {
                    hasbots = true
                } else if (arg.toLowerCase() === 'embeds') {
                    hasembeds = false;
                } else if (arg.toLowerCase() === 'files') {
                    hasfiles = false
                } else if (arg.toLowerCase() === 'users') {
                    hasusers = false
                } else if (arg.toLowerCase() === 'images') {
                    hasimages = false
                } else if (arg.toLowerCase() === 'pins') {
                    haspins = false
                } else if (arg.toLowerCase() === 'mentions') {
                    hasmentions = false
                }
            })
            if (amount > 100) {
                if (amount < 200) return ExecuteLargeBulkDelete(amount, conformationmessage)
                let filter = m => m.author.id === message.author.id;
                await conformationmessage.edit(`Are you sure you want to delete ${amount} messages? \`Y\` / \`N\``).then(async () => {
                    await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                        message2 = message2.first();
                        message2.delete().catch(err => { });
                        if (message2.content.toLowerCase().startsWith('cancel') || message2.content.toLowerCase().startsWith('n')) return conformationmessage.edit('Cancelled.')
                        else if (message2.content.toLowerCase() === 'y' || message2.content.toLowerCase() === 'yes') {
                            return ExecuteLargeBulkDeleteWithOptions(amount, member, silent, haslinks, hasinvites, hasbots, hasembeds, hasfiles, hasusers, hasimages, hasmentions, Includepins)
                        }
                        else return conformationmessage.edit('Cancelled.')
                    }).catch(collected => {
                        console.log(collected);
                        message.channel.send('Timed out.').catch(err => { console.log(err) });
                        return
                    });
                });
            } else {
                return ExecuteBulkDeleteWithOptions(amount, member, silent, haslinks, hasinvites, hasbots, hasembeds, hasfiles, hasusers, hasimages, hasmentions, Includepins)
            }
        } else {
            if (isNaN(args[0])) return conformationmessage.edit('Usage: `sm_purge <amount> <options>`')
            let amount = Number(args[0])
            if (amount > 100) {
                if (amount < 200) return ExecuteLargeBulkDelete(amount, conformationmessage)
                let filter = m => m.author.id === message.author.id;
                await conformationmessage.edit(`Are you sure you want to delete ${amount} messages? \`Y\` / \`N\``).then(async () => {
                    await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'], }).then(async message2 => {
                        message2 = message2.first();
                        message2.delete().catch(err => { });
                        if (message2.content.toLowerCase().startsWith('cancel') || message2.content.toLowerCase().startsWith('n')) return conformationmessage.edit('Cancelled.')
                        else if (message2.content.toLowerCase() === 'y' || message2.content.toLowerCase() === 'yes') {
                            return ExecuteLargeBulkDelete(amount, conformationmessage)
                        }
                        else return conformationmessage.edit('Cancelled.')
                    }).catch(collected => {
                        console.log(collected);
                        message.channel.send('Timed out.').catch(err => { console.log(err) });
                        return
                    });
                });
            } else {
                return ExecuteBulkDelete(amount, conformationmessage)
            }
        }

    }
}

async function ExecuteBulkDeleteWithOptions(amount, conformationmessage, member = undefined, HasSilent = false, HasLinks = false, HasInvites = false, HasBots = false, HasEmbeds = false, HasFiles = false, HasUsers = false, HasImages = false, HasMentions = false, Includepins = false) {

}

async function ExecuteBulkDelete(amount, conformationmessage) {

}

async function ExecuteLargeBulkDeleteWithOptions(amount, conformationmessage, member = undefined, HasSilent = false, HasLinks = false, HasInvites = false, HasBots = false, HasEmbeds = false, HasFiles = false, HasUsers = false, HasImages = false, HasMentions = false, Includepins = false) {

}

async function ExecuteLargeBulkDelete(amount, conformationmessage) {

} 