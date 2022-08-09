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

module.exports = {
      name: 'random',
      aliases: ['randomize', 'randomise'],
      description: 'randomizes a number or choses one of the words sent',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!args[0]) return message.channel.send('Usage is: "sm_random <max number that the bot could chose>" or "sm_random <option1> <option2> <option3> <option4> <option5> (options can keep going up to 50)"')
            if (!isNaN(args[0]) && !args[1]) {
                  let prerating = Number(args[0]) + 1
                  rating = Math.floor(Math.random() * prerating);
                  message.channel.send(`Number: ${rating}`)
            } else if (args[0] === 'no0' && !isNaN(args[1])) {
                  rating = Math.floor(Math.random() * args[1]) + 1;
                  message.channel.send(`Your random number is ${rating}`)
            } else {
                  if (message.content.toLowerCase.includes('@everyone') || message.content.toLowerCase.includes('@here') || message.content.toLowerCase.includes('<@&>')) return message.channel.send('Your random words must not contain mentions of roles, everyone or here')
                  let randomgenerator = [];
                  args.forEach(async (arg) => {
                        randomgenerator.push(arg)
                  })
                  let random = randomgenerator[Math.floor(Math.random() * randomgenerator.length)];
                  message.channel.send(`Your random word is: \`${random}\``)
            }
      }
}