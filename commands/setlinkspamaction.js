const mysql = require('mysql2');
const {GetPunishName} = require('../moderationinc')
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

module.exports = {
      name: 'setlinkspamaction',
      aliases: ['setmasslinkspamaction'],
      description: 'fhukbjbjbbbbbbb',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!message.member.permissions.has('ADMINISTRATOR')) {
                  return message.channel.send('You do not have access to this command.')
            }

            if (!args[0]) {
                  let linkspammap = client.antiscamspam.get(message.guild.id)
                  let massaction = linkspammap.get('punishtypemass')
                  let action = linkspammap.get('punishtype')
                  let descriptionstring = ''
                  if (action) {
                        descriptionstring = descriptionstring + `**Link Spam Action**:\n\`${GetPunishName(`${action}`)}\``
                  }else{
                        descriptionstring = descriptionstring + `**Link Spam Action**:\nNone.` 
                  }
                  if (massaction){
                        descriptionstring = descriptionstring + `\n\n**Mass Link Spam Action**:\n\`${GetPunishName(`${massaction}`)}\``
                  }else{
                        descriptionstring = descriptionstring + `\n\n**Mass Link Spam Action**:\nNone.`
                  }
                  const embed = new Discord.MessageEmbed()
                  .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL() })
                  .setDescription(`${descriptionstring}`)
                  .setColor('BLUE')
            return message.channel.send({ embeds: [embed] });

            }
            if (cmd === 'setmasslinkspamaction') return SetMassLinkSpamAction(message, client, args, Discord)
      }
}
async function SetMassLinkSpamAction(message,client,args,Discord) {

}