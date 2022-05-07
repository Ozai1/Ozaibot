module.exports = {
      name: 'random',
      aliases: ['randomize', 'randomise'],
      description: 'randomizes a number or choses one of the words sent',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (!args[0]) return message.channel.send('Usage is: "sm_random <max number that the bot could chose>" or "sm_random <option1> <option2> <option3> <option4> <option5> (options can keep going up to 50)"')
            if (!isNaN(args[0]) && !args[1]) {
                  let prerating = Number(args[0]) + 1
                  rating = Math.floor(Math.random() * prerating);
                  message.channel.send(rating)
            } else if (args[0] === 'no0' && !isNaN(args[1])) {
                  rating = Math.floor(Math.random() * args[1]) + 1;
                  message.channel.send(`your random number is ${rating}`)
            } else {
                  let randomgenerator = [];
                  args.forEach(async (arg) => {
                        randomgenerator.push(arg)
                  })
                  let random = randomgenerator[Math.floor(Math.random() * randomgenerator.length)];
                  message.channel.send(`Your random word is: \`${random}\``)
            }
      }
}