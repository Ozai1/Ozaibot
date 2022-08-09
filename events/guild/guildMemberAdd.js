const mysql = require('mysql2')
require('dotenv').config();
const { LogPunishment, NotifyUser } = require('../../moderationinc')
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
const { unix } = require('moment');
const moment = require('moment');
module.exports = async (Discord, client, member) => {
    const guild = member.guild;
    let welcomechannelid = client.welcomechannels.get(member.guild.id)
    let welcomechannel = guild.channels.cache.get(welcomechannelid)
    if (welcomechannel) {
        let welcomemessage = client.welcomechannelstext.get(guild.id)
        if (!welcomemessage) return
        welcomemessage = welcomemessage.replace(/\[user]/g, `${member}`)
        welcomemessage = welcomemessage.replace(/\[user.username]/g, `**${member.user.username}**`)
        welcomemessage = welcomemessage.replace(/\[user.tag]/g, `**${member.user.tag}**`)
        welcomechannel.send(`${welcomemessage}`).catch(err => {
            console.log('welcomemessage failed to send in guild ' + guild)
            console.log(err)
        })
    }
    console.log(`${member.user.tag} joined ${guild}`);
    if (!guild.me.permissions.has('MANAGE_GUILD')) return;
    let query = `SELECT * FROM serverconfigs WHERE serverid = ? && type = ?`;
    let data = [guild.id, 'whitelist'];
    connection.query(query, data, async function (error, results, fields) {
        if (error) {
            console.log('backend error for checking active bans');
            return console.log(error);
        }
        if (results == '' || results === undefined) {
        } else {
            let query = "SELECT * FROM whitelist WHERE userid = ? && serverid = ?";
            let data = [member.id, guild.id];
            connection.query(query, data, async function (error, results, fields) {
                if (error) {
                    console.log('backend error for checking active bans');
                    return console.log(error);
                }
                if (results == '' || results === undefined) {
                    try {
                        if (member.bannable) {
                            member.ban({ reason: `Unauthed join, Autoban (Was not added to whitelist)` }).catch(err => {
                                console.log(err);
                                console.log('Ozaibot could not ban the following user.');
                            })
                            console.log(`${member.user.tag}(${member.id}) tried to join ${member.guild} and got autobanned`);
                        } else {
                            console.log(`${member.user.tag}(${member.id}) tried to join ${member.guild} and autoban was attempted but the user was not bannable`);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            })
        }
    })
    query = `SELECT * FROM activebans WHERE userid = ? && serverid = ? && type = ?`;
    data = [member.id, member.guild.id, 'mute'];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        if (results == `` || results === undefined) return;
        for (row of results) {
            let casenumber = row["casenumber"];
            let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
            let data = ['muterole', guild.id];
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error);
                if (results == `` || results === undefined) {
                    return console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but muterole was removed in db`);
                }
                for (row of results) {
                    let muteroleid = row["details"];

                    const muterole = guild.roles.cache.get(muteroleid);
                    if (!muterole) {
                        return console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but muterole was not found`);
                    }
                    if (guild.me.roles.highest.position <= muterole.position) {
                        console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, attempted to remute but i have lower perms than muterole now`);
                    }
                    member.roles.add(muterole, { reason: `AUTOMUTE: user has left and rejoined while muted, mute role auto added. if this user is not meant to be muted please unmute them through ozaibot so they do not get automuted for mute evading again.` }).catch(err => {
                        console.log(err);
                    })
                    console.log(`${member.user.tag}(${member.id}) has rejoined ${guild} (${guild.id}) while muted, remuted`);
                    let message = Object
                    message.author = client.user
                    message.guild = member.guild;
                    message.channel = undefined;
                    LogPunishment(message, client, member.id, 3, null, 'Auto-Mute: User re-joined while muted.', Discord, casenumber, false)
                    NotifyUser(3, message, `You have been auto-muted in ${member.guild}`, member, 'Auto-Mute: You re-joined while muted.', null, client, Discord)
                }
            })
        }
    })
    if (guild.id == '942731536770428938') {
        let blossomrole = guild.roles.cache.get('942791591725252658');
        member.roles.add(blossomrole).catch(err => { console.log(err) });
        query = `SELECT * FROM chercordver WHERE userid = ? && serverid = ?`;
        data = [member.id, guild.id];
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error);
            if (results == `` || results === undefined) {
                let unknownchannel = client.channels.cache.get('948788617348800532');
                let unknownrole = guild.roles.cache.get('948788992961306695');
                member.roles.add(unknownrole).catch(err => { console.log(err) });
                unknownchannel.send(`<@&951030382919299072> ${member}`).catch(err => { console.log(err) });
            } else {
                return;
            }
        })
    }
    if (guild.id == '806532573042966528') {
        query = `SELECT * FROM chercordver WHERE userid = ? && serverid = ?`;
        data = [member.id, guild.id];
        connection.query(query, data, async function (error, results, fields) {
            if (error) return console.log(error);
            if (results == `` || results === undefined) {
                let verchannel = client.channels.cache.get('951514055452012644');
                let verrole = guild.roles.cache.get('922514880102277161');
                member.roles.add(verrole).catch(err => { console.log(err) });
                const webhookclient = await verchannel.createWebhook(`Welcome ${member.user.username}!`, {
                    avatar: 'https://cdn.discordapp.com/attachments/868363455105732609/952954742160650300/unknown.png',
                })
                const welcomeembed = new Discord.MessageEmbed()
                    .setTitle(`Hello ${member.user.username}!`)
                    .setThumbnail(member.user.avatarURL())
                    .setDescription(`Please bare with us while we get someone to verify you and give you access to the rest of the server!\n\nWe apologise for any inconvenience.\n\nIf you are only here to rob through dank memer: the rob command is disabled so you may as well just go.`)
                await webhookclient.send(`<@&806533084442263552> <@&933455230950080642> ${member} <@508847949413875712>`).then(message => { message.delete() });
                await webhookclient.send({ embeds: [welcomeembed] });
                webhookclient.delete();
            } else {
                return;
            }
        })
    } if (guild.id == '917964629089591337') {
        let verchannel = client.channels.cache.get('959715867963297832');
        let verrole = guild.roles.cache.get('959715895708635136');
        member.roles.add(verrole).catch(err => { console.log(err) });
        verchannel.send(`${member}`).then(message => { message.delete() });
    }
    if (member.user.bot) {
        query = `INSERT INTO usedinvites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
        data = [member.id, member.guild.id, 'BOT', Number(Date.now(unix).toString().slice(0, -3).valueOf()), 'BOT_ADD_METHOD'];
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                return console.log(error);
            }
            console.log(`${member.user.tag} | *BOT* has joined ${member.guild}`);
            return;
        })
        return;
    } else {
        const newinvites = await member.guild.invites.fetch();
        newinvites.forEach(async invite => {
            query = `SELECT * FROM activeinvites WHERE serverid = ? && invitecode = ?`;
            data = [guild.id, invite.code];
            connection.query(query, data, function (error, results, fields) {
                if (error) return console.log(error)
                if (results == ``) { // no invites cached in the database
                    return
                } else {
                    for (row of results) {
                        let uses = row["uses"];
                        if (uses < invite.uses) {
                            query = `UPDATE activeinvites SET uses = ? WHERE invitecode = ?`;
                            data = [invite.uses, invite.code];
                            connection.query(query, data, function (error, results, fields) {
                                if (error) return console.log(error);
                            })
                            return invfound(member, invite, client, Discord)
                        }
                    }
                }
            })
        })
        query = `SELECT * FROM activeinvites WHERE serverid = ?`;
        data = [guild.id];
        connection.query(query, data, async function (error, results, fields) {
            if (error) return console.log(error)
            let invitesindb = [];
            let invitesinfetch = [];
            if (results == ``) {
                return
            } else {
                for (row of results) {
                    let invcode = row["invitecode"];
                    invitesindb.push(invcode)
                }
                newinvites.forEach(invite => {
                    invitesinfetch.push(invite.code)
                });
                for (let i = 0; i < invitesindb.length; i++) {
                    if (invitesinfetch.includes(invitesindb[0])) {
                        invitesindb.shift()
                    }
                }
                if (invitesindb[1]) {
                    //console.log(invitesindb)
                    return //console.log('More than one invite seen missing, stopping search through this method')
                }
                if (!invitesindb[0]) return console.log('could not find any missing invites, stopping search')
                if (invitesindb[0]) {
                    query = `SELECT * FROM activeinvites WHERE serverid = ? && invitecode = ?`;
                    data = [guild.id, invitesindb[0]];
                    connection.query(query, data, async function (error, results, fields) {
                        if (error) return console.log(error)
                        if (results == ``) { // no invites cached in the database
                            return console.log('Could not find the invite in the database for whatever reason, this is when it has already been found and selected as the correct one. this is under the search for deleted invites because they used a one use invite event')
                        } else {
                            for (row of results) {
                                const uses = row["uses"];
                                const rowid = row["id"]
                                const invcode = row["invitecode"]
                                const inviterid = row["inviterid"]
                                const invite2 = Object
                                invite2.code = invcode
                                invite2.uses = uses
                                invite2.inviter = await client.users.fetch(inviterid)
                                invfound(member, invite2, client, Discord)
                                query = `DELETE FROM activeinvites WHERE id = ?`;
                                data = [rowid];
                                connection.query(query, data, function (error, results, fields) {
                                    if (error) return console.log(error);
                                })
                                console.log(`deleted invite ${invcode} from db because user joining deleted invite.`)
                            }
                        }
                    })
                }
            }
        })
        // if (!usedinvite) {
        //       query = `INSERT INTO usedinvites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
        //       data = [member.id, member.guild.id, 'unknown', Number(Date.now(unix).toString().slice(0, -3).valueOf()), 'unknown'];
        //       connection.query(query, data, function (error, results, fields) {
        //             if (error) {
        //                   return console.log(error);
        //             }
        //             console.log(`${member.user.tag} has joined ${member.guild} using invite code [unknown] made by [unknown]`);
        //             return;
        //       })
        //       return
        // }
    }
}

async function invfound(member, invite, client, Discord) {
    const guild = member.guild
    query = `INSERT INTO usedinvites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
    data = [member.id, guild.id, invite.inviter.id, Number(Date.now(unix).toString().slice(0, -3).valueOf()), invite.code];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        console.log(`${member.user.tag} has joined ${member.guild} using invite code ${invite.code} made by ${invite.inviter.tag}`);
        return;
    })
    if (guild.id == '806532573042966528') {
        const button1 = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel(`Verify ${member.user.username}`)
                .setStyle("PRIMARY")
                .setCustomId(`katver${member.id}`)
        ).addComponents(
            new Discord.MessageButton()
                .setLabel(`Ban ${member.user.username}`)
                .setStyle("DANGER")
                .setCustomId(`katban${member.id}`)
        )
        let verchannel = client.channels.cache.get('922511452185694258');
        const verembed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.tag} (${member.id}) has joined`, member.user.avatarURL())
            .setColor('BLUE')
            .setDescription(`Account age: <t:${Number(moment(member.user.createdAt).unix())}:R>\nInvite link used: \`${invite.code}\`,\nThis invite has been used ${invite.uses} times.\nThis invite was created by ${invite.inviter.tag} (${invite.inviter.id})`)
        verchannel.send({ embeds: [verembed], components: [button1] });
    }
    query = `SELECT * FROM lockdownlinks WHERE invitecode = ? && serverid = ?`;
    data = [invite.code, guild.id];
    connection.query(query, data, function (error, results, fields) {
        if (error) {
            return console.log(error);
        }
        if (results == '' || results === undefined) return;
        for (row of results) {
            let action = row["action"];
            let adminid = row["adminid"];
            let guildid = row["serverid"]
            if (action === 'mute') {
                let query = `SELECT * FROM serverconfigs WHERE type = ? && serverid = ?`;
                let data = ['muterole', guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) return console.log(error);
                    if (results == `` || results === undefined) {
                        return console.log(`${guild} (${guild.id}) has set up a link to automute but there is no mute role for this server`);
                    }
                    for (row of results) {
                        let muteroleid = row["details"];
                        const muterole = guild.roles.cache.get(muteroleid);
                        if (!muterole) {
                            return console.log(`${guild} (${guild.id}) has set up a link to automute but the mute role could not be found`);
                        }
                        if (guild.me.roles.highest.position <= muterole.position) {
                            console.log(`${guild} (${guild.id}) has set up a link to automute but I do not have high enough permissions to mute the user`);
                        }
                        member.roles.add(muterole).catch(err => {
                            console.log(err);
                        })
                        console.log(`${member.user.tag} was muted from ${guild} (${guild.id}) for using blacklisted link: ${invite.code}`);
                        member.send(`You have been muted because you are a prime suspect in an on going raid.`);
                    }
                })
            } else if (action === 'kick') {
                member.send(`You have been kicked from ${guild} because you are a suspect in an on going raid.`);
                member.kick().catch(err => { console.log(err) });
                console.log(`${member.user.tag} was kicked from ${guild} for using blacklisted link: ${invite.code}`);
            } else if (action === 'ban') {
                let admin = client.users.cache.get(adminid);
                if (!admin) { admin = 'Unknownuser' } else { admin = admin.tag }
                member.send(`You have been banned from ${guild} because you are a prime suspect in an on going raid.`);
                member.ban({ reason: `AUTOBAN: Used link set for autoban: ${invite.code}. The blacklist on this invite was set by ${admin}(${adminid})` }).catch(err => { console.log(err) });
                console.log(`${member.user.tag} was banned from ${guild} for using blacklisted link: ${invite.code}.`);
            }
        }
    })
};
