const { GetModerationModuleText, GetAdministrationModuleText } = require('../../commands/help');
const { SearchButton } = require('../../searchbuttons')
const {HasPerms} = require('../../moderationinc')
const mysql = require('mysql2');
require('dotenv').config();
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
module.exports = async (Discord, client, interaction) => {


    if (interaction.isCommand()) {
        if (!interaction.guild) return
        console.log(`SLASHCMD | ${interaction.user.tag} in ${interaction.guild}, ${interaction.channel}: ${interaction.commandName}`)
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
        if (interaction.customId) {
            console.log(interaction.customId ? `BUTTON | ${interaction.user.tag} (${interaction.user.id}) pressed button with custom id ${interaction.customId} in ${interaction.guild}, ${interaction.message.channel.name}` : `BUTTON | A customId-less button was pushed in ${interaction.guild}, ${interaction.channel}`)
        }
        let userstatus = client.userstatus.get(interaction.user.id)
        if (userstatus == 0) {
            interaction.reply({ content: 'You have been blacklisted from bot use.', ephemeral: true })
            return console.log('STOPPING, USER BLACKLISTED')
        }
        if (interaction.customId.startsWith('HELP_')) {
            let owner = client.helpmessageownership.get(interaction.message.id)
            if (owner && interaction.user.id !== owner) return interaction.reply({ content: 'These buttons arent for you. If you wish to have a window of your own, use `sm_help` to open one.', ephemeral: true })
            let embedinfo = client.help.get(interaction.customId.slice(5).toLowerCase())
            if (!embedinfo) return interaction.reply({ content: `Sorry, this button doesnt seem to be working right now.`, ephemeral: true }).catch(e => { })
            const helpembed = new Discord.MessageEmbed()
                .setTitle(embedinfo.title)
                .setDescription(embedinfo.description)
                .setColor('BLUE')
                .setFooter({ text: `Press an option to see more information | requested by ${interaction.user.tag}` })
            if (!interaction.message.webhookId) {
                interaction.deferUpdate();
                if (embedinfo.buttons) {
                    return interaction.message.edit({ embeds: [helpembed], components: embedinfo.buttons, ephemeral: true })
                } else {
                    return interaction.message.edit({ embeds: [helpembed], ephemeral: true, components: null })
                }
            } else {
                if (embedinfo.buttons) {
                    return interaction.reply({ embeds: [helpembed], components: embedinfo.buttons, ephemeral: true })
                } else {
                    return interaction.reply({ embeds: [helpembed], ephemeral: true })
                }
            }
        } if (interaction.customId === 'SILENTMODE') {
            if (interaction.message.webhookId) {
                return interaction.reply({ ephemeral: true, content: 'You are already in silent mode.' })
            }
            let embedinfo = client.help.get('ui')
            const helpembed = new Discord.MessageEmbed()
                .setTitle(embedinfo.title)
                .setDescription(embedinfo.description)
                .setColor('BLUE')
            await interaction.reply({ embeds: [helpembed], components: embedinfo.buttons, ephemeral: true, content: '<:check:988867881200652348> Silent mode.' })

            interaction.message.delete().catch(err => { console.error(err) })
        }
        if (interaction.customId.startsWith('CUSTOM_')) {
            if (interaction.customId === 'CUSTOM_TOGGLE_SOUNDBOARD') {
                if (interaction.guild.roles.everyone.permissions.has('USE_SOUNDBOARD')) { // 0x40000000000
                    interaction.guild.roles.everyone.setPermissions(968644480577).catch(err => { console.log(err) }) //allow standard perms minus soundboard
                    interaction.channel.send(({ content: 'Disabled soundboard perms' })).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) });
                    const returnembed = new Discord.MessageEmbed()
                        .setTitle(`Toggle Soundboards On`)
                        .setColor("GREEN")

                    const button = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel(`Toggle SoundBoards On`)
                                .setStyle("PRIMARY")
                                .setCustomId(`CUSTOM_TOGGLE_SOUNDBOARD`)
                        )

                    let message2 = await interaction.channel.messages.fetch('1102205364625219684')
                    message2.edit({ embeds: [returnembed], components: [button] })
                    
                } else {
                    interaction.guild.roles.everyone.setPermissions(5366690991681).catch(err => { console.log(err) }) // allow standard perms including soundboard
                    interaction.channel.send(({ content: 'Enabled soundboard perms' })).then(message => message.delete({ timeout: 2000 })).catch(err => { console.log(err) });
                    const returnembed = new Discord.MessageEmbed()
                        .setTitle(`Toggle Soundboards Off`)
                        .setColor("RED")

                    const button = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel(`Toggle SoundBoards Off`)
                                .setStyle("PRIMARY")
                                .setCustomId(`CUSTOM_TOGGLE_SOUNDBOARD`)
                        )

                    let message2 = await interaction.channel.messages.fetch('1102205364625219684')
                    message2.edit({ embeds: [returnembed], components: [button] })
                }
            }
        }
        if (interaction.customId.startsWith("SEARCH_")) {
            SearchButton(interaction, client, Discord)
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
