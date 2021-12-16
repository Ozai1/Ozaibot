module.exports = {
    name: 'masssaydel',
    description: 'repeats the message 10 times and then deletes it',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
        if (userstatus == 1) {
            let content = args.slice(0).join(" ");
            if (message.author.id == '464441790519443456') {
                if (message.content.includes('<@&') || message.content.toLowerCase().includes('@everyone')) return
            } if (message.deletable) message.delete()
            if (!args[0]) return
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
            message.channel.send(content).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) })
        }
    }
}