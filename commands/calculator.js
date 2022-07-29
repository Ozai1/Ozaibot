const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const math = require('mathjs')
module.exports = {
    name: 'calculator',
    aliases: ['calc', 'c'],
    description: 'its literally a calculator',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!args[0]) {
            console.log('Add an arguement.')
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor(15684432)
                .setDescription(`Missing arguments.\n\nProper usage:\n\`calculator [add|subtract|multiply|devide] <value> <value> <value>...\`\nor\n\`calculator 1 + 1 - 1 * 1 / 1...\``)
            return message.channel.send({ embeds: [errorembed] })
        }
        //memes (never remove)
        if (args.join(" ").toLowerCase() === 'bread plus ozaya plus bread') {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor('BLUE')
                .setDescription(`**Problem:**\nTo cute\n\n**Answer:**\nCutie Pie`)
            return message.channel.send({ embeds: [errorembed] })
        }
        if (args.join(" ").toLowerCase() === 'bread plus mrh plus bread') {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                .setColor('BLUE')
                .setDescription(`**Problem:**\nTo handsome\n\n**Answer:**\nStunning Sandwich`)
            return message.channel.send({ embeds: [errorembed] })
        }
        //end memes
        if (isNaN(args[0])) {
            let operator = args[0].toLowerCase()
            let total = args[1]
            if (operator === 'a' || operator === 'add' || operator === 'p' || operator === 'plus') {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (i == 0 || i == 1) continue
                        total = Number(total) + Number(args[i])
                    }
                }
                returnmessage(message, Discord, `**Answer**:\n${total}`)
            }
            else if (operator === 's' || operator === 'sub' || operator === 'subtract' || operator === 'takeaway') {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (i == 0 || i == 1) continue
                        total = Number(total) - Number(args[i])
                    }
                }
                returnmessage(message, Discord, `**Answer**:\n${total}`)
            }
            else if (operator === 'm' || operator === 'multi' || operator === 'multiply' || operator === 'times' || operator === 't'|| operator === 'x') {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (i == 0 || i == 1) continue
                        total = Number(total) * Number(args[i])
                    }
                }
                returnmessage(message, Discord, `**Answer**:\n${total}`)
            }
            else if (operator === 'd' || operator === 'div' || operator === 'divide'|| operator === 'divided'|| operator === '÷') {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (i == 0 || i == 1) continue
                        total = Number(total) / Number(args[i])
                    }
                }
                returnmessage(message, Discord, `**Answer**:\n${total}`)
            } else {
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor(15684432)
                    .setDescription(`Invalid usage.\n\nProper usage:\n\`calculator [add|subtract|multiply|devide] <value> <value> <value>...\`\nor\n\`calculator 1 + 1 - 1 * 1 / 1...\``)
                return message.channel.send({ embeds: [errorembed] })
            }
        } else {
            for (let i = 0; i < args.length; i++) {
                let operator = args[i]
                if (isNaN(operator)) {
                    if (operator === 'a' || operator === 'add' || operator === 'p' || operator === 'plus') {
                        args[i] = '+'
                    }
                    if (operator === 's' || operator === 'sub' || operator === 'subtract' || operator === 'takeaway') {
                        args[i] = '-'
                    }
                    if (operator === 'm' || operator === 'multi' || operator === 'multiply' || operator === 'times' || operator === 't'|| operator === 'x') {
                        args[i] = "*"
                    }
                    if (operator === 'd' || operator === 'div' || operator === 'divide'|| operator === '÷') {
                        args[i] = '/'
                    }
                }
            }
            try {
                let answer = math.evaluate(args.join(" "))
                let problem = args.join(" ")
                if (answer === Infinity) {
                    const errorembed = new Discord.MessageEmbed()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                        .setColor('ORANGE')
                        .setDescription(`Problem:${problem}\n\nAnswer = Infinity.\n\nInfinity is not a usual number to equal to.\nDid you input a ridiculous amount of numbers or devide by 0?`)
                    return message.channel.send({ embeds: [errorembed] })
                }
                const errorembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                    .setColor('BLUE')
                    .setDescription(`**Problem:**\n${problem}\n\n**Answer:**\n${answer}`)
                return message.channel.send({ embeds: [errorembed] })
            } catch (err) {
                return message.channel.send('Invalid statement(s) given')
            }
        }
    }
}
function returnmessage(message, Discord, answer) {
    const errorembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
        .setColor('BLUE')
        .setDescription(`${answer}`)
    return message.channel.send({ embeds: [errorembed] })
}