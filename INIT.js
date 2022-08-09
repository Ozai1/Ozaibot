const { Help_INIT2 } = require('./commands/help')
const { Help_INIT } = require('./slashcommands/help')
const { PunishmentExpire } = require('./punishexpire')
const { exec } = require("child_process")
const synchronizeSlashCommands = require('discord-sync-commands-v14');
const fs = require('fs');
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

module.exports.Main_INIT = (client, Discord) => {
    Help_INIT()
    Help_INIT2()
return
    client.userstatus = new Map()
    client.prefixes = new Map()
    client.currentcasenumber = new Map()
    client.invites = new Map() // once up in the hundreds of servers this could overload because of size
    client.muteroles = new Map()
    client.welcomechannels = new Map()
    client.welcomechannelstext = new Map()
    client.welcomechannelstext2 = new Map()
    client.punishnotification = []
    client.positiverolepermissions = new Map()
    client.negativerolepermissions = new Map()
    client.positiveuserpermissions = new Map()
    client.negativeuserpermissions = new Map()
    client.modlogs = new Map()
    client.lockedvoicechannels = []
    client.antiscamspam = new Map()


    UserStatus_INIT(client)
    Prefixes_INIT(client)
    CurrentCaseNumber_INIT(client)
    Invites_INIT(client)
    MuteRole_INIT(client)
    WelcomeChannels_INIT(client)
    PunishNotif_INIT(client)
    Permissions_INIT(client)
    ModLogs_INIT(client)
    PunishmentExpire(client, Discord)
    AntiScamSpam_INIT(client)

    fs.readdir("./slashcommands/", (_err, files) => {
        synchronizeSlashCommands(client, client.slashcommands.map((command) => ({
            name: command.name,
            description: command.description,
            options: command.options,
            type: 'CHAT_INPUT'
        })), {
            debug: false
        });
    })
    console.log(`Finished caching and updating`);
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
                console.error('**** PREFIXES FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
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
                    console.error('**** CASENUMBERS FAILED TO INIT **** ABORTING BOT START ****')
                }
                exec(`forever stopall`)
                console.error(error)
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
                console.error('**** MUTEROLES FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
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
                console.error('**** WELCOMECHANNELSTEXT FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            let serverid = row["serverid"]
            if (row["details3"] == '' && row["details2"] == '') continue
            if (row['details'] == '') continue
            client.welcomechannels.set(serverid, row["details"])
            if (!row['details2'] == '') {
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
                console.error('**** punishnotif FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            client.punishnotification.push(row["serverid"])
        }
    })
}

async function Permissions_INIT(client) {
    await client.guilds.cache.forEach(guild => {
        client.positiverolepermissions.set(guild.id, new Map())
        client.negativerolepermissions.set(guild.id, new Map())
        client.positiveuserpermissions.set(guild.id, new Map())
        client.negativeuserpermissions.set(guild.id, new Map())
    })
    let query = "SELECT * FROM permissions";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.error('**** PERMISSIONS FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
            return thisisafunctionthatwillcrashthebot
        }
        let serverid = undefined
        let whateverid = undefined
        for (row of results) {
            serverid = row["serverid"]
            whateverid = row["id2"]
            if (row["type"] === 'r') {
                if (!row["positive"] == '') {
                    let posmap = client.positiverolepermissions.get(serverid)
                    posmap.set(whateverid, row["positive"])
                }
                if (!row["negative"] == '') {
                    let negmap = client.negativerolepermissions.get(serverid)
                    negmap.set(whateverid, row["negative"])
                }

            } else {
                if (!row["positive"] == '') {
                    let posmap = client.positiveuserpermissions.get(serverid)
                    posmap.set(whateverid, row["positive"])
                }
                if (!row["negative"] == '') {
                    let negmap = client.negativeuserpermissions.get(serverid)
                    negmap.set(whateverid, row["negative"])
                }
            }
        }
    })
}

async function ModLogs_INIT(client) {
    let query = "SELECT * FROM serverconfigs WHERE type = ?";
    let data = ['modlog']
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.error('**** MODLOGS FAILED TO INIT **** ABORTING BOT START ****')
            }
            exec(`forever stopall`)
            console.error(error)
            return thisisafunctionthatwillcrashthebot
        }
        for (row of results) {
            client.modlogs.set(row["serverid"], row["details"])
        }
    })
}

async function AntiScamSpam_INIT(client) {
    client.guilds.cache.forEach(guild => {
        client.antiscamspam.set(guild.id, new Map())
    })
        let query = "SELECT * FROM serverconfigs WHERE type = ?";
        let data = ['linkspam']
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                for (let i = 0; i < 10; i++) {
                    console.error('**** SCAMSPAM FAILED TO INIT **** ABORTING BOT START ****')
                }
                exec(`forever stopall`)
                console.error(error)
                return thisisafunctionthatwillcrashthebot
            }
            for (row of results) {
                let current = client.antiscamspam.get(row["serverid"])
                if (row["details"]) {
                    current.set('punishtype', row["details"])
                }
                if (row["details2"]) {
                    current.set('punishtypemass', row["details2"])
                }
                if (row["details3"]){
                    current.set('punishlength', row["details3"])
                }
                if (row["details3"]){
                    current.set('punishlengthmass', row["details4"])
                }
            }
        })
}