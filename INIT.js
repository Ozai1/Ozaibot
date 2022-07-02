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
    client.invites = new Map() // once up in the hundreds of servers this could overload because of size
    client.muteroles = new Map()
    client.welcomechannels = new Map()
    client.welcomechannelstext = new Map()
    client.welcomechannelstext2 = new Map()
    client.punishnotification = []

    UserStatus_INIT(client)
    Prefixes_INIT(client)
    CurrentCaseNumber_INIT(client)
    Invites_INIT(client)
    MuteRole_INIT(client)
    WelcomeChannels_INIT(client)
    PunishNotif_INIT(client)
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
            client.userstatus.set(row["userid"], row["status"])
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
            client.prefixes.set(row["serverid"], row["prefix"])
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

async function Invites_INIT(client) {
    client.guilds.cache.forEach(guild => {
        if (guild.me.permissions.has('MANAGE_GUILD')) {
            const invites = guild.invites.fetch()
            client.invites.set(guild.id, invites)
        } else {
            client.invites.set(guild.id, null)
        }
    })
}

async function MuteRole_INIT(client) {
    let query = "SELECT * FROM serverconfigs WHERE type = ?";
    let data = ['muterole']
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** MUTEROLES FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.log(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            client.muteroles.set(row["serverid"], row["details"])
        }
    })
}

async function WelcomeChannels_INIT(client) {
    let query = "SELECT * FROM serverconfigs WHERE type = ?";
    let data = ['welcomechannel']
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** WELCOMECHANNELSTEXT FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.log(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            let serverid = row["serverid"]
            if (row["details3"] == '' && row["details2"] == '') continue
            if (row['details'] == '') continue
            client.welcomechannels.set(serverid, row["details"])
            if (!row['details2'] == ''){
                client.welcomechannelstext.set(serverid, row["details2"])
            } if (!row["details3"] == '') {
                client.welcomechannelstext2.set(serverid, row["details3"])
            }
        }
    })
}

async function PunishNotif_INIT(client) {
    let query = "SELECT * FROM serverconfigs WHERE type = ?";
    let data = ['punishnotification']
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** punishnotif FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.log(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            client.punishnotification.push(row["serverid"])
        }
    })
}