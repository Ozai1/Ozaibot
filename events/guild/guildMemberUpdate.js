const { unix } = require('moment');
const mysql = require('mysql2')
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
const { LogPunishment } = require('../../moderationinc')
module.exports = async (Discord, client, oldmember, newmember) => {
    if (newmember.guild.id == '806532573042966528') {
        if (!newmember.roles.cache.has('922514880102277161') && oldmember.roles.cache.has('922514880102277161')) {
            let katcordgen = client.channels.cache.get('806532573042966530');
            if (!katcordgen) return console.log('kat cord general not found');
            const webhookclient = await katcordgen.createWebhook('Welcome to rainy day kat-fé!', {
                avatar: 'https://cdn.discordapp.com/attachments/868363455105732609/952954742160650300/unknown.png',
            })
            const welcomeembed = new Discord.MessageEmbed()
                .setTitle('We are glad to have you here!')
                .addField('Important Information:', '\n\nCheck out this link to vote for our server!\nhttps://top.gg/servers/806532573042966528\n\nCheck out <#906751907597525062> and <#850549971081625640> to get started.')
                .setFooter({ text: 'We hope you enjoy your time here!' })
            await webhookclient.send({ content: `Hey <@${newmember.id}>! Welcome. <@&933185109094465547>`, embeds: [welcomeembed] });
            console.log('welcome message sent');
            await webhookclient.delete();
        }
    }
    let muterole = client.muteroles.get(oldmember.guild.id)
    if (!muterole) return
    muterole = oldmember.guild.roles.cache.get(muterole)
    if (!muterole) return
    if (!newmember.roles.cache.has(muterole.id) && oldmember.roles.cache.has(muterole.id)) {
        let query = `SELECT * FROM activebans WHERE timeunban > ? && userid = ? && serverid = ? && type = ?`;
        let data = [Number(Date.now(unix).toString().slice(0, -3).valueOf()), oldmember.id, oldmember.guild.id, 'mute'];
        connection.query(query, data, async function (error, results, fields) {
            if (error) {
                console.log('backend error for checking active bans')
                return console.log(error)
            }
            for (row of results) {
                query = "DELETE FROM activebans WHERE id = ?";
                data = [row["id"]]
                let adminid = row["adminid"]
                connection.query(query, data, function (error, results, fields) {
                    if (error) return console.log(error)
                })
                let modlog = client.modlogs.get(oldmember.guild.id)
                if (!modlog) return
                modlog = oldmember.guild.channels.cache.get(modlog)
                if (!modlog) return
                let message = Object()
                message.author = client.user
                message.guild = oldmember.guild;
                message.channel = modlog;
                LogPunishment(message, client, oldmember.id, 4, 0, 'Role manually removed by administrator.', Discord);
            }
        });
    }
}