const { MessageEmbed } = require('discord.js');
const mysql = require('mysql2');
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
module.exports = async (Discord, client, interaction) => {

    if (!interaction.guild) return

    if (interaction.isCommand()) {
        query = "SELECT * FROM userstatus WHERE userid = ?";
        data = [interaction.member.id]
        connection.query(query, data, function (error, results, fields) {
            if (error) return console.log(error)
            if (results == '' || results === undefined) { // User does not have a row.
                var userstatus = false;
                launchslashcommand(client, interaction, Discord, userstatus)
                return
            } for (row of results) {
                var userstatus = row["status"];
            } if (userstatus == 0) {
                return interaction.reply({ content: `You have been blacklisted from bot use.`, ephemeral: true }).catch(e => { })
            } else if (userstatus == 1) {
                launchslashcommand(client, interaction, Discord, userstatus)
            } else {
                launchslashcommand(client, interaction, Discord, userstatus)
            }
        });
    }
    if (interaction.isButton()) {
        if (customId){
            console.log(`${interaction.user.tag} (${interaction.user.id}) pressed button with custom id ${interaction,customId} in ${interaction.guild}, ${interaction.message.channel.name}`)
        }
        if (interaction.customId.startsWith('katban')) {
            let member = interaction.message.guild.members.cache.get(interaction.customId.slice(6))
            if (!member) {
                return interaction.reply({ content: `User is no longer in this server.`, ephemeral: true })
            }
            if (!member.bannable) {
                return interaction.reply({ content: `I no longer have high enough perms to ban this member.`, ephemeral: true })
            }
            await interaction.reply(`<@${interaction.user.id}>, Banning...`)
            const returnembed = new Discord.MessageEmbed()
                .setDescription(`<:check:988867881200652348> ${member} has been **banned**.`)
                .setColor("GREEN")
            interaction.message.channel.send({ embeds: [returnembed] })
            await interaction.message.guild.members.ban(member, { reason: `Banned by admin (${interaction.user.username}) pressing the ban button in the verification channel` }).catch(err => {
                console.log(err)
                interaction.message.channel.send('Failed to ban.')
                return
            })
            interaction.message.edit({ components: [] })
        }
        if (interaction.customId.startsWith('katver')) {
            let member = interaction.message.guild.members.cache.get(interaction.customId.slice(6))
            if (!member) return interaction.reply({ content: `User is no longer in this server.`, ephemeral: true })
            const unknrole = interaction.guild.roles.cache.get('922514880102277161')
            interaction.reply(`<@${interaction.user.id}> verified ${member}`)
            setTimeout(() => {
                member.roles.remove(unknrole)
                let query = `INSERT INTO chercordver (userid, username, serverid) VALUES (?, ?, ?)`;
                let data = [member.id, member.user.username, interaction.message.guild.id];
                connection.query(query, data, function (error, results, fields) {
                    if (error) {
                        return console.log(error)
                    }
                })
            }, 2000);
            interaction.message.edit({ components: [] })
        }
    }
};

async function launchslashcommand(client, interaction, Discord, userstatus) {
    const cmd = client.slashcommands.get(interaction.commandName);

    if (cmd && cmd.voiceChannel) {
        if (!interaction.member.voice.channel) return interaction.reply({ content: `You are not connected to an audio channel. ❌`, ephemeral: true });
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ content: `You are not on the same audio channel as me. ❌`, ephemeral: true });
    }
    if (cmd)
        cmd.execute(client, interaction, Discord, userstatus)
    // let alllogs = client.channels.cache.get('986882651921190932');
    // const commandembed = new MessageEmbed()
    //     .setDescription(`**${interaction.guild}** (${interaction.guild.id})\n ${interaction.channel} (${interaction.channel.name} | ${interaction.channel.id})\n**${interaction.member.user.tag}** (${interaction.member.id})\n"${interaction.commandName}".`)
    //     .setTimestamp()
    // alllogs.send({ embeds: [commandembed] });
}
