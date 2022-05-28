const mysql = require('mysql2');
const {GetTimeAndAlias, GetMember } = require("../functions")
const connection = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
 
const serversdb = mysql.createPool({
    host: 'vps01.tsict.com.au',
    port: '3306',
    user: 'root',
    password: `P0V6g5`,
    database: 'ozaibotservers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
 
module.exports = {
    name: 'temp',
    description: 'whatever i make at the time',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (!userstatus == 1) return
        if (!args[0]) return 
        const timeandalias = GetTimeAndAlias(args[0])
        if (timeandalias == -1) {
            return message.channel.send('function failed')
        }
        const mutetimeinseconds = timeandalias.time
        const unitoftimechosen = timeandalias.unitName
        const amount = timeandalias.amount
        message.channel.send(`${mutetimeinseconds}, ${unitoftimechosen}, ${amount}`)
    }
}