const mysql = require('mysql2');
const { GetDisplay, GetPunishName, GetPunishColour, HasPerms } = require('../moderationinc')
require('dotenv').config();
const connection = mysql.createPool({
    host: '112.213.34.137',
    port: '3306',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: 'binary',
    description: 'gets and displays a users past punishments',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!args[0]) return message.channel.send('add arg')
        if (isNaN(args[0])) {
            return message.channel.send(text2Binary(args.slice(0).join(" ")) ? text2Binary(args.slice(0).join(" ")) : 'Output was undefined')
        } else {
            return message.channel.send(binaryAgent(args.slice(0).join(" ")) ? binaryAgent(args.slice(0).join(" ")) : 'Output was undefined')
        }
    }
}
function text2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}
function binaryAgent(str) {
    var newBin = str.split(" ");
    var binCode = [];
    for (i = 0; i < newBin.length; i++) {
        binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
    }
    return binCode.join("");
}