const Discord = require('discord.js');

//cum
async function bot_perms(message, userstatus, Discord) {
    if (userstatus == 1) {
          let printtext = '';
          if (message.guild.me.hasPermission('ADMINISTRATOR')) {
                return message.channel.send('I have administrator permissions.')
          }
          if (message.guild.me.hasPermission('BAN_MEMBERS')) {
                printtext = printtext + 'Ban\n';
          }
          if (message.guild.me.hasPermission('KICK_MEMBERS')) {
                printtext = printtext + 'Kick\n';
          }
          if (message.guild.me.hasPermission('MANAGE_CHANNELS')) {
                printtext = printtext + 'Manage Channels\n';
          }
          if (message.guild.me.hasPermission('MANAGE_GUILD')) {
                printtext = printtext + 'Manage Server\n';
          }
          if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                printtext = printtext + 'Manage Messages\n';
          }
          if (message.guild.me.hasPermission('MANAGE_ROLES')) {
                printtext = printtext + 'Manage Roles\n';
          }
          if (message.guild.me.hasPermission('CREATE_INSTANT_INVITE')) {
                printtext = printtext + 'Create Invites\n';
          }
          if (message.guild.me.hasPermission('SEND_MESSAGES')) {
                printtext = printtext + 'Send Messages\n';
          }
          if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
                printtext = printtext + 'View Audit Log\n';
          }
          if (message.guild.me.hasPermission('ADD_REACTIONS')) {
                printtext = printtext + 'Add Reactions\n';
          }
          if (message.guild.me.hasPermission('EMBED_LINKS')) {
                printtext = printtext + 'Embed Links\n';
          }
          if (message.guild.me.hasPermission('ATTACH_FILES')) {
                printtext = printtext + 'Attach Files\n';
          }
          if (message.guild.me.hasPermission('READ_MESSAGE_HISTORY')) {
                printtext = printtext + 'Read Message History\n';
          }
          if (message.guild.me.hasPermission('MENTION_EVERYONE')) {
                printtext = printtext + 'Mention @ everyone, @ here and all roles\n';
          }
          if (message.guild.me.hasPermission('USE_EXTERNAL_EMOJIS')) {
                printtext = printtext + 'Use External Emojis\n';
          }
          if (message.guild.me.hasPermission('CONNECT')) {
                printtext = printtext + 'Connect to Channels\n';
          }
          if (message.guild.me.hasPermission('SPEAK')) {
                printtext = printtext + 'Speak in Channels\n';
          }
          if (message.guild.me.hasPermission('MUTE_MEMBERS')) {
                printtext = printtext + 'Voice Mute\n';
          }
          if (message.guild.me.hasPermission('DEAFEN_MEMBERS')) {
                printtext = printtext + 'Voice Deafen\n';
          }
          if (message.guild.me.hasPermission('MOVE_MEMBERS')) {
                printtext = printtext + 'Voice Drag and Disconnect\n';
          }
          if (message.guild.me.hasPermission('CHANGE_NICKNAME')) {
                printtext = printtext + 'Rename Self\n';
          }
          if (message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
                printtext = printtext + 'Rename Others\n';
          }
          if (message.guild.me.hasPermission('MANAGE_WEBHOOKS')) {
                printtext = printtext + 'Manage WebHooks\n';
          }
          if (message.guild.me.hasPermission('MANAGE_EMOJIS')) {
                printtext = printtext + 'Manage Emojis';
          }
          const permsembed = new Discord.MessageEmbed()
                .setTitle('List of permissions that are set to true.')
                .setDescription(printtext)
                .setTimestamp()
          return message.channel.send(permsembed)
    }
}