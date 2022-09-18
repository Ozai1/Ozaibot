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
module.exports = async (Discord, client, react, author) => {
    let userstatus = client.userstatus.get(author.id)
    let member = react.message.guild.members.cache.get(author.id)
    if (userstatus == 0) return
    if (react.message.id == '959716895672659998') {
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
        //1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣
    } if (react.message.id == '998089800647188500') {//age
        await removeageroles(member)
        if (react.emoji.name === '1️⃣') {
            //998096552071544883
            member.roles.add('998096552071544883')
        } else if (react.emoji.name === '2️⃣') {
            //959402863614898247
            member.roles.add('959402863614898247')
        } else if (react.emoji.name === '3️⃣') {
            //959402972213821460
            member.roles.add('959402972213821460')
        }else {react.remove()}
        console.log(`Added role to ${author.tag}`)
    } if (react.message.id == '998089798919127112') {//pronouns
        await removepronounroles(member)
        if (react.emoji.name === '1️⃣') {
            //959403068431138856
            member.roles.add('959403068431138856')
        } else if (react.emoji.name === '2️⃣') {
            //959403061128880159
            member.roles.add('959403061128880159')
        } else if (react.emoji.name === '3️⃣') {
            //959403064845037589
            member.roles.add('959403064845037589')
        }else {react.remove()}
        console.log(`Added role to ${author.tag}`)
    } if (react.message.id == '998089780447412254') {//gender
        await removegenderroles(member)
        if (react.emoji.name === '👧') {
            //959402119704768534
            member.roles.add('959402119704768534')
        } else if (react.emoji.name === '👦') {
            //959402493173973023
            member.roles.add('959402493173973023')
        } else if (react.emoji.name === '🤙') {
            //959402705242181783
            member.roles.add('959402705242181783')
        }else {react.remove()}
        console.log(`Added role to ${author.tag}`)
    } if (react.message.id == '998089778899730462') {//country
        await removecountryroles(member)
        if (react.emoji.name === '1️⃣') {
            //959403246382878770
            member.roles.add('959403246382878770')
        } else if (react.emoji.name === '2️⃣') {
            //959403247595053086
            member.roles.add('959403247595053086')
        } else if (react.emoji.name === '3️⃣') {
            //959403250992439296
            member.roles.add('959403250992439296')
        } else if (react.emoji.name === '4️⃣') {
            //959403248085762090
            member.roles.add('959403248085762090')
        } else if (react.emoji.name === '5️⃣') {
            //959403248970784798
            member.roles.add('959403248970784798')
        } else if (react.emoji.name === '6️⃣') {
            //959403557512175627
            member.roles.add('959403557512175627')
        }else {react.remove()}
        console.log(`Added role to ${author.tag}`)
    } if (react.message.id == '998089757441663017') {//misc
        if (react.emoji.name === '1️⃣') {
            //959403558401355796
            member.roles.add('959403558401355796')
        } else if (react.emoji.name === '2️⃣') {
            //959403560133595176
            member.roles.add('959403560133595176')
        } else if (react.emoji.name === '3️⃣') {
            //959403561463218196
            member.roles.add('959403561463218196')
        } else if (react.emoji.name === '4️⃣') {
            //959403954125545502
            member.roles.add('959403954125545502')
        } else if (react.emoji.name === '5️⃣') {
            //959403999596003369
            member.roles.add('959403999596003369')
        }else {react.remove()}
        console.log(`Added role to ${author.tag}`)
    }
}

async function removeageroles(member) {
    if (member.roles.cache.has('998096552071544883')) {
        await member.roles.remove('998096552071544883')
    } if (member.roles.cache.has('959402863614898247')) {
        await member.roles.remove('959402863614898247')
    } if (member.roles.cache.has('959402972213821460')) {
        await member.roles.remove('959402972213821460')
    }
}

async function removepronounroles(member) {
    if (member.roles.cache.has('959403068431138856')) {
        await member.roles.remove('959403068431138856')
    } if (member.roles.cache.has('959403061128880159')) {
        await member.roles.remove('959403061128880159')
    } if (member.roles.cache.has('959403064845037589')) {
        await member.roles.remove('959403064845037589')
    }
}

async function removecountryroles(member) {
    if (member.roles.cache.has('959403246382878770')) {
        await member.roles.remove('959403246382878770')
    } if (member.roles.cache.has('959403247595053086')) {
        await member.roles.remove('959403247595053086')
    } if (member.roles.cache.has('959403250992439296')) {
        await member.roles.remove('959403250992439296')
    } if (member.roles.cache.has('959403248085762090')) {
        await member.roles.remove('959403248085762090')
    } if (member.roles.cache.has('959403248970784798')) {
        await member.roles.remove('959403248970784798')
    } if (member.roles.cache.has('959403557512175627')) {
        await member.roles.remove('959403557512175627')
    }
}

async function removegenderroles(member) {
    if (member.roles.cache.has('959402119704768534')) {
        await member.roles.remove('959402119704768534')
    } if (member.roles.cache.has('959402493173973023')) {
        await member.roles.remove('959402493173973023')
    } if (member.roles.cache.has('959402705242181783')) {
        await member.roles.remove('959402705242181783')
    }
}

