const mysql = require('mysql2');
const serversdb = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibotservers',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: 'P0V6g5',
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
module.exports = {
    name: 'whitelist',
    aliases: ['unwhitelist', 'enablewhitelist', 'disablewhitelist', 'whitelistinfo'],
    description: 'whitelist functionality',
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DM\'s')
        if (cmd === 'whitelist') {
            if (userstatus == 1 || message.member.hasPermission('MANAGE_GUILD')) {
                if (!args[0]) return message.channel.send('You must add a memeber to whitelist.')
                let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                if (!member) return message.channel.send('Invalid member') // still no member
                let query = "SELECT * FROM whitelist WHERE userid = ? && serverid = ?";
                data = [member.id, message.guild.id]
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                    }
                    if (results == '' || results === undefined) {
                        let query = "INSERT INTO whitelist (userid, serverid, username) VALUES (?, ?, ?)";
                        data = [member.id, message.guild.id, member.username]
                        connection.query(query, data, function (error, results, fields) {
                            if (error) {
                                console.log('backend error for checking active bans')
                                return console.log(error)
                            }
                            message.channel.send(`${member} has been added to this servers whitelist. They will be automatically unbanned.`)
                            message.guild.fetchBans().then(bans => {
                                let member2 = bans.get(member.id);
                                if (bans.size == 0) return;
                                if (member2 == null) return;
                                message.guild.members.unban(member, `User was added to whitelist, auto-unban`).then(() => {
                                }).catch(err => { console.log(err) });
                            })
                        })
                    } else {
                        message.channel.send('This person is already on the whitelist.')
                    }

                })
            } else return message.channel.send('you do not have permissions to interact with this server\'s whitelist')
        } else if (cmd === 'unwhitelist') {
            if (userstatus == 1 || message.member.hasPermission('MANAGE_GUILD')) {
                let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                if (!member) return message.channel.send('Invalid member') // still no member
                let query = "SELECT * FROM whitelist WHERE userid = ? && serverid = ?";
                data = [member.id, message.guild.id]
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                    }
                    if (results == '' || results === undefined) {
                        message.channel.send('This person is not currently whitelisted.')
                    } else {
                        let query = "DELETE FROM whitelist WHERE userid = ? && serverid = ?";
                        data = [member.id, message.guild.id]
                        connection.query(query, data, function (error, results, fields) {
                            if (error) {
                                console.log('backend error for checking active bans')
                                return console.log(error)
                            }
                            message.channel.send(`${member} can no longer join this server. If they are currently in this server they will need to be kicked.`)
                        })
                    }
                })
            } else return message.channel.send('you do not have permissions to interact with this server\'s whitelist')
        } else if (cmd === 'enablewhitelist') {
            if (userstatus == 1 || message.author.id == message.guild.ownerID) {
                let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                let data = ['whitelist']
                serversdb.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                    }
                    if (results == `` || results === undefined) {
                        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('Ozaibot does not have ban permissions, please grant me these permissions before activiating the server-wide whitelist.')
                        let query = `INSERT INTO ${message.guild.id}config (type) VALUES (?)`;
                        let data = ['whitelist']
                        serversdb.query(query, data, function (error, results, fields) {
                            if (error) {
                                console.log('backend error for checking active bans')
                                return console.log(error)
                            }
                            message.channel.send('This servers whitelist has been activated.\nAll current members will be automatically added to the whitelist.\nAll new members will need to be added to the whitelist using `sm_whitelist <user_id>` or they will be autobanned.\nMake sure ozaibot has high permissions or it will not be able to ban new members.')
                            message.guild.members.cache.forEach(member => {
                                let query = "SELECT * FROM whitelist WHERE userid = ? && serverid = ?";
                                data = [member.id, message.guild.id]
                                connection.query(query, data, function (error, results, fields) {
                                    if (error) {
                                        console.log('backend error for checking active bans')
                                        return console.log(error)
                                    }
                                    if (results == '' || results === undefined) {
                                        let query = "INSERT INTO whitelist (userid, serverid, username) VALUES (?, ?, ?)";
                                        data = [member.id, message.guild.id, member.user.username]
                                        connection.query(query, data, function (error, results, fields) {
                                            if (error) {
                                                console.log('backend error for checking active bans')
                                                return console.log(error)
                                            }
                                            console.log(`added ${member.user.tag} ${member.id} to ${member.guild.id} whitelist`)
                                        })
                                    }
                                })
                            });
                        })
                    } else {
                        message.channel.send('This server already has the whitelist active, anyone not on the whitelist will be autobanned on joining.')
                    }
                })
            } else return message.channel.send('Only the server owner may turn the whitelist on and off, anyone with manage server permissions can add people to the whitelist though.')
        } else if (cmd === 'disablewhitelist') {
            if (userstatus == 1 || message.author.id == message.guild.ownerID) {
                let query = `SELECT * FROM ${message.guild.id}config WHERE type = ?`;
                let data = ['whitelist']
                serversdb.query(query, data, function (error, results, fields) {
                    if (error) {
                        console.log('backend error for checking active bans')
                        return console.log(error)
                    }
                    if (results == `` || results === undefined) return message.channel.send('This servers does not have its whitelist active as of current.')
                    query = `DELETE FROM ${message.guild.id}config WHERE type = ?`;
                    data = ['whitelist']
                    serversdb.query(query, data, function (error, results, fields) {
                        if (error) {
                            console.log('backend error for checking active bans')
                            return console.log(error)
                        }
                        message.channel.send('Whitelist disabled.')
                    })
                })
            } else return message.channel.send('Only the server owner may turn the whitelist on and off, anyone with manage server permissions can add people to the whitelist though.')
        } else {

        }
    }
}