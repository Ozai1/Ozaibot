const { PunishmentExpire } = require('./punishexpire')
const { Music_Bot_INIT } = require('./music_bot_listeners')
const {check_for_warning_level_decrease} = require('./bannedwords')
const synchronizeSlashCommands = require('discord-sync-commands-v14');
const { unix } = require('moment');
const { Player } = require('discord-player');
const fs = require('fs');
const mysql = require('mysql2');
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
let failed = '';
//!this whole file is bascially what client.ready used to be


module.exports.Pre_Login_INIT = async (client, Discord) => { // fires before client fires ready, allows for updating before the bot has authed to discord
    client.userstatus = new Map();
    client.prefixes = new Map();
    client.muteroles = new Map();
    client.currentcasenumber = new Map();
    client.welcomechannels = new Map();
    client.welcomechannelstext = new Map();
    client.welcomechannelstext2 = new Map();
    client.punishnotification = [];
    client.positiverolepermissions = new Map();
    client.negativerolepermissions = new Map();
    client.positiveuserpermissions = new Map();
    client.negativeuserpermissions = new Map();
    client.help = new Map();
    client.modlogs = new Map();
    client.invites = new Map(); // once up in the hundreds of servers this could overload because of size
    client.lockedvoicechannels = ['1037315858206314576'];
    client.antiscamspam = new Map();
    client.failedrequests = new Map();
    client.isdatabasedown = false;
    client.helpmessageownership = new Map();
    client.bannedwords = new Map();
    client.bannedwordspunishments = new Map();
    client.bannedwordswarninglevels = new Map();

    Help_INIT(client, Discord)
    UserStatus_INIT(client)
    Prefixes_INIT(client)
    CurrentCaseNumber_INIT(client)
    MuteRole_INIT(client)
    WelcomeChannels_INIT(client)
    PunishNotif_INIT(client)
    ModLogs_INIT(client)

    // music bot shit
    client.musicConfig = require('./musicconfig');
    client.player = new Player(client, client.musicConfig.opt.discordPlayer);
    client.commands = new Discord.Collection();
    client.slashcommands = new Discord.Collection();
    client.events = new Discord.Collection();

    Music_Bot_INIT(client)
    // end music bot shit

    check_for_warning_level_decrease(client)

    console.log('Pre Login Init Done')
}

module.exports.Main_INIT = async (client, Discord) => {

    Invites_INIT(client);
    PunishmentExpire(client, Discord);
    AntiScamSpam_INIT(client);
    Permissions_INIT(client);
    CurrentCaseNumber_INIT(client);
    BannedWords_INIT(client)
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

    setTimeout(() => {
        if (failed) {
            failed += failed.slice(5)
            let alllogs = client.channels.cache.get('986882651921190932');
            const cmdembed = new Discord.MessageEmbed()
                .setDescription(`Failed:\n${failed}`)
                .setColor('RED')
            alllogs.send({ content: `INIT FAILLED <@!508847949413875712>, FAILED MODULES:`, embeds: [cmdembed] });
        }
    }, 40000);
    // from here was ripped straight from index
    let query = "SET GLOBAL max_connections = 512";
    let data = [];
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error);
    });
    query = "DELETE FROM activeinvites";
    data = [];
    connection.query(query, data, function (error, results, fields) {
        if (error) return console.log(error);
    });
    setInterval(() => { // 1 min interval, being used for blacklisted invites checking
        let query = `SELECT * FROM lockdownlinks WHERE timeremove < ?`;
        let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf())]
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                console.log('backend error for checking active bans')
                return console.log(error)
            }
            if (results !== ``) {
                for (row of results) {
                    query = "DELETE FROM lockdownlinks WHERE id = ?";
                    data = [row["id"]]
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error)
                    })
                    var serverid = row["serverid"];
                    var invitecode = row["invitecode"];
                    let guild = client.guilds.cache.get(serverid);
                    if (!guild) { guild = 'unknownguild' }
                    return console.log(`Blacklist on invite ${invitecode} has expired for guild ${guild}(${serverid})`)
                }
            }
        })
    }, 60000);
    let alllogs = client.channels.cache.get('986882651921190932');
    alllogs.send(`Bot started up <@!508847949413875712>`);
    let rating = Math.floor(Math.random() * 2) + 1;
    if (rating == 1) {
        client.user.setPresence({ status: 'dnd' });
    }
    await client.guilds.cache.forEach(async guild => {
        await guild.members.fetch();
        if (guild.me.permissions.has('MANAGE_GUILD')) {
            const newinvites = await guild.invites.fetch();
            newinvites.forEach(async invite => {
                if (invite.inviter) {
                    query = `INSERT INTO activeinvites (serverid, inviterid, invitecode, uses) VALUES (?, ?, ?, ?)`;
                    data = [guild.id, invite.inviter.id, invite.code, invite.uses];
                    connection.query(query, data, function (error, results, fields) {
                        if (error) return console.log(error);
                    })
                } else {
                    console.log(invite)
                }
            })
        }
    })
}

async function Help_INIT(client, Discord) {
    const command_files = fs.readdirSync('./help/').filter(file => file.endsWith('.js'));
    for (const file of command_files) {
        const command = require(`./help/${file}`);
        command.execute(client, Discord)
    }
}

async function UserStatus_INIT(client) {
    let query = "SELECT * FROM userstatus";
    let data = []
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** USERSTATUS FAILED TO INIT **** ABORTING BOT START ****')
            }
            if (!failed.includes('Userstatus')) {
                failed += '<:cross:990176341708124160> Userstatus\n'
            }
            console.error(error)
            return
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
            console.error(error)
            if (!failed.includes('Prefixes')) {
                failed += '<:cross:990176341708124160> Prefixes\n'
            }
            return
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
                console.error(error)
                if (!failed.includes('CaseNumbers')) {
                    failed += '<:cross:990176341708124160> CaseNumbers\n'
                }
                return
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
            console.error(error)
            if (!failed.includes('Userstatus')) {
                failed += '<:cross:990176341708124160> Mute-roles\n'
            }
            return
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
            console.error(error)
            if (!failed.includes('Welcome')) {
                failed += '<:cross:990176341708124160> Welcome Channels\n'
            }
            return
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
            console.error(error)
            if (!failed.includes('Punish')) {
                failed += '<:cross:990176341708124160> Punish-Notifications\n'
            }
            return
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
            console.error(error)
            if (!failed.includes('Permissions')) {
                failed += '<:cross:990176341708124160> Permissions\n'
            }
            return
        }
        let serverid = undefined
        let whateverid = undefined
        for (row of results) {
            serverid = row["serverid"]
            whateverid = row["id2"]
            if (row["type"] === 'r') {
                if (!row["positive"] == '') {
                    let posmap = client.positiverolepermissions.get(serverid)
                    if (!posmap) {
                        client.positiverolepermissions.set(serverid, new Map())
                        client.negativerolepermissions.set(serverid, new Map())
                        client.positiveuserpermissions.set(serverid, new Map())
                        client.negativeuserpermissions.set(serverid, new Map())
                        posmap = client.positiverolepermissions.get(serverid)
                    }
                    posmap.set(whateverid, row["positive"])
                }
                if (!row["negative"] == '') {
                    let negmap = client.negativerolepermissions.get(serverid)
                    negmap.set(whateverid, row["negative"])
                }

            } else {
                if (!row["positive"] == '') {
                    let posmap = client.positiveuserpermissions.get(serverid)
                    if (!posmap) {
                        client.positiverolepermissions.set(serverid, new Map())
                        client.negativerolepermissions.set(serverid, new Map())
                        client.positiveuserpermissions.set(serverid, new Map())
                        client.negativeuserpermissions.set(serverid, new Map())
                        posmap = client.positiveuserpermissions.get(serverid)
                    }
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
            console.error(error)
            if (!failed.includes('Modlogs')) {
                failed += '<:cross:990176341708124160> Modlogs-channels\n'
            }
            return
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
    connection.query(query, data, async function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.error('**** SCAMSPAM FAILED TO INIT **** ABORTING BOT START ****')
            }
            console.error(error)
            if (!failed.includes('Anti-Spam')) {
                failed += '<:cross:990176341708124160> Anti-Spam\n'
            }
            return
        }
        for (row of results) {
            if (!client.antiscamspam.get(row["serverid"])) {
                client.antiscamspam.set(row["serverid"], new Map())
            }
            if (!client.antiscamspam.get(row["serverid"])) {
                client.antiscamspam.set(row["serverid"], new Map())
            }
            let current = await client.antiscamspam.get(row["serverid"])
            if (row["details"]) {
                current.set('punishtype', row["serverid"])
            }
            if (row["details2"]) {
                current.set('punishtypemass', row["details2"])
            }
            if (row["details3"]) {
                current.set('punishlength', row["details3"])
            }
            if (row["details4"]) {
                current.set('punishlengthmass', row["details4"])
            }
        }
    })
}

async function BannedWords_INIT(client) {
    client.guilds.cache.forEach(guild => {
        client.bannedwords.set(guild.id, [])
        client.bannedwordspunishments.set(guild.id, new Map())
        client.bannedwordswarninglevels.set(guild.id, new Map())
    })
    let query = "SELECT * FROM serverconfigs WHERE type = ?";
    let data = ['bannedwords']
    connection.query(query, data, async function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** BANNEDWORDS FAILED TO INIT **** ABORTING BOT START ****')
            }
            if (!failed.includes('Userstatus')) {
                failed += '<:cross:990176341708124160> Userstatus\n'
            }
            console.error(error)
            return
        }
        for (row of results) {
            if (!client.bannedwords.get(row["serverid"])) {
                client.bannedwords.set(row["serverid"], new Map())
            } if (!client.bannedwordspunishments.get(row["serverid"])) {
                client.bannedwordspunishments.set(guild.id, new Map())
            } if (!client.bannedwordswarninglevels.get(row["serverid"])) {
                client.bannedwordswarninglevels.set(guild.id, new Map())
            }
            let current = await client.bannedwords.get(row["serverid"]).push(row["details"])

            current = client.bannedwordspunishments.get(row["serverid"])

            let object2 = Object()
            object2.punishwarninglevel = row["details2"]
            if (row["details3"]) {
                object2.punishtype = row["details3"]
            }
            if (row["details4"]) {
                object2.punishlength = row["details4"]
            }
            current.set(row["details"], object2)
        }
    })
    query = "SELECT * FROM serverconfigs WHERE type = ?";
    data = ['bannedwordswarninglevelmax']
    connection.query(query, data, async function (error, results, fields) {
        if (error) {
            for (let i = 0; i < 10; i++) {
                console.log('**** BANNEDWORDS FAILED TO INIT **** ABORTING BOT START ****')
            }
            if (!failed.includes('Userstatus')) {
                failed += '<:cross:990176341708124160> Userstatus\n'
            }
            console.error(error)
            return
        }
        for (row of results) {
            if (!client.bannedwordswarninglevels.get(row["serverid"])) {
                client.bannedwordswarninglevels.set(row["serverid"], new Map())
            }
            client.bannedwordswarninglevels.get(row["serverid"])
                .set(0, row["details"])
        }
    })

}