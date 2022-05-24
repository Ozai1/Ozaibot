module.exports = {
      name: 'pm',
      description: 'dms a user through the bot',
      async execute(message, client, cmd, args, Discord, userstatus) {
            if (userstatus == 1) {
                  const confmessage = await message.channel.send('Sending...');
                  if (!args[1]) return message.channel.send('Usage: `sm_pm <user> <message>`')
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member'); // still no member
                  if (!args[0]) return;
                  let content = args.slice(1).join(" ");
                  if (content.length > 2000) return message.channel.send('This message is to long! The bot can only send up to 2000 characters in a message.');
                  await member.send(content).catch(err => {
                        return confmessage.edit('User cannot be DMed')
                  });
                  confmessage.edit('Sent.')
                  return;
            } else {
                  message.channel.send('You do not have access to this command.')
            }
      }
}