const mysql = require('mysql2')
require('dotenv').config();
const { LogPunishment, NotifyUser } = require('./moderationinc')
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

//make it so that the invite finding stuff is seperate to the moderation stuff, the invite can be fetched while the mod stuff does its stuff, the mod stuff shouldnt have to wait
const { unix } = require('moment');
const moment = require('moment');
module.exports = async (Discord, client, member) => {
    const guild = member.guild;
    oldinvites = client.invites.get(guild.id)
    NonInviteRelatedStuff(Discord, client, member)
    const newinvites = await guild.invites.fetch()
    client.invites.set(guild.id, newinvites)
}

async function NonInviteRelatedStuff(Discord, client, member) {
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
                    let message = Object()
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
}
