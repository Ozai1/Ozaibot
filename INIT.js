const { Help_INIT2 } = require('./commands/help')
const { Help_INIT } = require('./slashcommands/help')
const { exec } = require("child_process")
const mysql = require('mysql2');
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

module.exports.Main_INIT = (client) => {
    Help_INIT()
    Help_INIT2()

    client.userstatus = new Map()
    client.prefixes = new Map()
    client.currentcasenumber = new Map()

    UserStatus_INIT(client)
    Prefixes_INIT(client)
    CurrentCaseNumber_INIT(client)
}

async function UserStatus_INIT(client) {
    let query = "SELECT * FROM userstatus";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** USERSTATUS FAILED TO INIT **** ABORTING BOT START ****')
            }
            console.log(error)
            exec(`forever stopall`)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            let userid = row["userid"]
            let status = row["status"]
            client.userstatus.set(userid, status)
        }
    })
}

async function Prefixes_INIT(client) {
    let query = "SELECT * FROM prefixes";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** PREFIXES FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.log(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            let serverid = row["serverid"]
            let prefix = row["prefix"]
            client.prefixes.set(serverid, prefix)
        }
    })
}

async function CurrentCaseNumber_INIT(client) {
    client.guilds.cache.forEach(guild => {
        query = `SELECT MAX(casenumber) FROM serverpunishments WHERE serverid = ?`;
        data = [guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                for (let i = 0; i < 10; i++) {
                    console.log('**** CASENUMBERS FAILED TO INIT **** ABORTING BOT START ****')
                }
                exec(`forever stopall`)
                console.log(error)
                return thisisafunctionthatwillcrashthebot
            }
            let casenumber = undefined
            if (!results == ``) {
                for (row of results) {
                    casenumber = row["MAX(casenumber)"]
                }
            }
            if (casenumber == undefined || casenumber === null) {
                casenumber = 0
            }
            client.currentcasenumber.set(guild.id, casenumber)
        })
    })
}