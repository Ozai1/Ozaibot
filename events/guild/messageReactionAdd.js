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
module.exports = async (Discord, client, react, author) => {
    if (react.message.id == '942754717484863508') {
        let member = react.message.guild.members.cache.get(author.id);
        if (react.emoji.name === 'p_pink01_nf2u') { // she/her 942758515368407050
            let prorole = react.message.guild.roles.cache.get('942758515368407050');
            member.roles.add(prorole).catch(err => { console.log(err) });
            author.send('Gave you the she/her role.').catch(err => { console.log('could not message user to conf adding role') });
        } else if (react.emoji.name === 'p_pink02_nf2u') { // he/him 942758528299438100
            let prorole = react.message.guild.roles.cache.get('942758528299438100');
            member.roles.add(prorole).catch(err => { console.log(err) });
            author.send('Gave you the he/him role.').catch(err => { console.log('could not message user to conf adding role') });
        } else if (react.emoji.name === 'p_pink03_nf2u') { // they/them 942758559547019284
            let prorole = react.message.guild.roles.cache.get('942758559547019284');
            member.roles.add(prorole).catch(err => { console.log(err) });
            author.send('Gave you the they/them role.').catch(err => { console.log('could not message user to conf adding role') });
        } else if (react.emoji.name === 'p_pink04_nf2u') { // she/they 942758579574829106
            let prorole = react.message.guild.roles.cache.get('942758579574829106');
            member.roles.add(prorole).catch(err => { console.log(err) });
            author.send('Gave you the she/they role.').catch(err => { console.log('could not message user to conf adding role') });
        } else if (react.emoji.name === 'p_pink02_nf2u') { // he/they 942758598533083157
            let prorole = react.message.guild.roles.cache.get('942758598533083157');
            member.roles.add(prorole).catch(err => { console.log(err) });
            author.send('Gave you the he/they role.').catch(err => { console.log('could not message user to conf adding role') });
        } else {
            react.remove().catch(err => { console.log(err) });
        }
    } if (react.message.id == '959716895672659998') {
        let member = react.message.guild.members.cache.get(author.id);
        if (react.emoji.name === '✅') {
            let verrole = react.message.guild.roles.cache.get('959715895708635136');
            member.roles.remove(verrole).catch(err => { console.log(err) });
            const verchannel = client.channels.cache.get('959715867963297832');
            const vermessage = await verchannel.messages.fetch('959716895672659998');
            vermessage.reactions.resolve("✅").users.remove(member.id);
            console.log(`Verified ${member.user.tag} (${member.id}) in javi cord`);
        } else {
            react.remove();
        }
    }
}