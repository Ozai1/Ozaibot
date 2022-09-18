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
    //1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣
    let userstatus = client.userstatus.get(author.id)
    let member = react.message.guild.members.cache.get(author.id)
    if (userstatus == 0) return
    if (react.message.id == '998089800647188500') {//age
        if (react.emoji.name === '1️⃣') {
            //998096552071544883
            member.roles.remove('998096552071544883')
        } else if (react.emoji.name === '2️⃣') {
            //959402863614898247
            member.roles.remove('959402863614898247')
        } else if (react.emoji.name === '3️⃣') {
            //959402972213821460
            member.roles.remove('959402972213821460')
        }
        console.log(`Removed role from ${author.tag}`)
    } if (react.message.id == '998089798919127112') {//pronouns
        if (react.emoji.name === '1️⃣') {
            //959403068431138856
            member.roles.remove('959403068431138856')
        } else if (react.emoji.name === '2️⃣') {
            //959403061128880159
            member.roles.remove('959403061128880159')
        } else if (react.emoji.name === '3️⃣') {
            //959403064845037589
            member.roles.remove('959403064845037589')
        }
        console.log(`Removed role from ${author.tag}`)
    } if (react.message.id == '998089780447412254') {//gender
        if (react.emoji.name === '👧') {
            //959402119704768534
            member.roles.remove('959402119704768534')
        } else if (react.emoji.name === '👦') {
            //959402493173973023
            member.roles.remove('959402493173973023')
        } else if (react.emoji.name === '🤙') {
            //959402705242181783
            member.roles.remove('959402705242181783')
        }
        console.log(`Removed role from ${author.tag}`)
    } if (react.message.id == '998089778899730462') {//country
        if (react.emoji.name === '1️⃣') {
            //959403246382878770
            member.roles.remove('959403246382878770')
        } else if (react.emoji.name === '2️⃣') {
            //959403247595053086
            member.roles.remove('959403247595053086')
        } else if (react.emoji.name === '3️⃣') {
            //959403250992439296
            member.roles.remove('959403250992439296')
        } else if (react.emoji.name === '4️⃣') {
            //959403248085762090
            member.roles.remove('959403248085762090')
        } else if (react.emoji.name === '5️⃣') {
            //959403248970784798
            member.roles.remove('959403248970784798')
        } else if (react.emoji.name === '6️⃣') {
            //959403557512175627
            member.roles.remove('959403557512175627')
        }
        console.log(`Removed role from ${author.tag}`)
    } if (react.message.id == '998089757441663017') {//misc
        if (react.emoji.name === '1️⃣') {
            //959403558401355796
            member.roles.remove('959403558401355796')
        } else if (react.emoji.name === '2️⃣') {
            //959403560133595176
            member.roles.remove('959403560133595176')
        } else if (react.emoji.name === '3️⃣') {
            //959403561463218196
            member.roles.remove('959403561463218196')
        } else if (react.emoji.name === '4️⃣') {
            //959403954125545502
            member.roles.remove('959403954125545502')
        } else if (react.emoji.name === '5️⃣') {
            //959403999596003369
            member.roles.remove('959403999596003369')
        }
        console.log(`Removed role from ${author.tag}`)
    }
}