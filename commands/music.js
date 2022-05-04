const mysql = require('mysql2')
const connection = mysql.createPool({
      host: 'vps01.tsict.com.au',
      port: '3306',
      user: 'root',
      password: `P0V6g5`,
      database: 'ozaibot',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});
const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')
const queue = new Map()

module.exports = {
      name: 'music',
      aliases: ['skip', 'stop', 'fuckoff', 'leave', 'dc', 'disconnect', 'play', 'musicban', 'pause', 'resume', 'unpause', 'seek', 'debug', 'queue'],
      description: 'has the bot play music',
      async execute(message, client, cmd, args, Discord, userstatus) {
            // Copyright of Jan Kamukura 2021
            if (cmd === 'music') {
                  const helpembed = new Discord.MessageEmbed()
                        .addField(`This is more of a category than one command.`, `**sm_play <song name | song url>**(youtube links only for urls)\n\nThis command has the bot join the channel that you are in and play music!\nIf there is already a song playing it will add the song you have chosen to a queue and play it when the rest of the queue has finished.\n\n**sm_skip**\n\nThis skips the current song\n\n**sm_stop**\nAliases: leave, fuckoff, dc, disconnect.\nClears the queue and has the bot leave the channel.\n\n**sm_pause**\n\nPauses the music, its literally that simple.\n\n**sm_resume**\nAliases: unpause.\nStarts the music again after being paused.\n\n**sm_debug**\n\nResets the bot in your server so that it can be recovered from errors, if the bot stops working for whatever reason use this command and it *should* be fixed\n\nIf you have any issues or suggestions chuck us an sm_report <issue>`)
                        .setTimestamp()
                        .setColor('BLUE')
                  message.channel.send(helpembed);
                  return;
            }
            FFMPEG_OPTIONS = {
                  'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
                  'options': '-vn',
            }
            if (message.channel.type === 'dm') return message.channel.send('You cannot use this command in DMs')
            if (userstatus == 2) return message.channel.send('Nah cherry banned you from music commands.')
            const voice_channel = message.member.voice.channel;
            if (cmd === 'play') {
                  if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
                  if (!voice_channel.permissionsFor(message.guild.me).has('CONNECT') || !voice_channel.permissionsFor(message.guild.me).has('SPEAK')) return message.channel.send('I need connect and speak perms for your channel before i can join.')
            }
            const server_queue = queue.get(message.guild.id);

            if (cmd === 'play') {
                  if (!args.length) return message.channel.send('You need to send the second argument!');
                  let song = {};
                  message.react('✅').then(react => {
                        setTimeout(() => {
                              react.remove().catch(err => { console.log(err) })
                        }, 3000);
                  })
                  if (ytdl.validateURL(args[0])) {
                        const song_info = await ytdl.getInfo(args[0]);

                        song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
                  } else {
                        const video_finder = async (query) => {
                              const video_result = await ytSearch(query);
                              return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                        }

                        const video = await video_finder(args.join(' '));
                        if (video) {
                              song = { title: video.title, url: video.url }
                        } else {
                              message.channel.send('Error finding video.');
                        }
                  }

                  if (!server_queue) {

                        const queue_constructor = {
                              voice_channel: voice_channel,
                              text_channel: message.channel,
                              connection: null,
                              songs: []
                        }

                        queue.set(message.guild.id, queue_constructor);
                        queue_constructor.songs.push(song);

                        try {
                              const connection = await voice_channel.join();
                              queue_constructor.connection = connection;
                              video_player(message.guild, queue_constructor.songs[0]);
                        } catch (err) {
                              queue.delete(message.guild.id);
                              message.channel.send('There was an error connecting!');
                              throw err;
                        }
                  } else {
                        server_queue.songs.push(song);
                        return message.channel.send(`👍 \`${song.title}\` added to queue!`);
                  }
            } else if (cmd === 'skip') skip_song(message, server_queue, message.guild);
            else if (cmd === 'stop' || cmd === 'leave' || cmd === 'fuckoff' || cmd === 'dc' || cmd === 'disconnect') stop_song(message, server_queue);
            else if (cmd === 'unpause' || cmd === 'resume') resume_song(message, server_queue)
            else if (cmd === 'pause') pause_song(message, server_queue)
            //else if (cmd === 'seek') seek_song(message, server_queue, args)
            else if (cmd === 'debug') debug_song(message, server_queue)
            else if (cmd === 'queue') song_queue(message, server_queue)
            else if (cmd === 'musicban') {
                  let member = client.users.cache.get(args[0].slice(3, -1)) || client.users.cache.get(args[0].slice(2, -1)) || client.users.cache.get(args[0]); // get member
                  if (!member) { member = await client.users.fetch(args[0]).catch(err => { }) } // if no member do a fetch for an id
                  if (!member) return message.channel.send('Invalid member') // still no member
                  let query = "SELECT * FROM userstatus WHERE userid = ?";
                  let data = [member.id]
                  connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                        if (error) return console.log(error)
                        if (results == ``) { // if they not in db, they get blacklisted
                              query = "INSERT INTO userstatus (username, userid, status) VALUES (?, ?, ?)";
                              data = [member.username, member.id, 2]
                              connection.query(query, data, function (error, results, fields) {//check what theyre current status is
                                    if (error) return console.log(error)
                                    message.react('✅')
                                    console.log(`${member.tag}(${member.id}) has had music perms removed by ${message.author.tag}.`)
                                    return
                              })
                        } else {
                              for (row of results) {
                                    var status = row["status"];
                                    if (status == 1) return message.channel.send('This user is a botadmin.')
                                    else if (status == 0) return message.channel.send('This user is blacklisted, no need to remove them from music.')
                                    else if (status == 2) return message.channel.send('This user is already banned from music commands.')
                              }
                        }
                  })
            }
      }
}
const video_player = async (guild, song) => {
      const song_queue = queue.get(guild.id);
      if (!song) {
            guild.me.voice.channel.leave();
            queue.delete(guild.id);
            song_queue.text_channel.send('Queue ended, leaving channel.')
            return
      }
      const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1024 * 1024 * 30 });// 30 megabytes buffer
      let dispatcher = song_queue.connection.play(stream, { seek: 0, volume: 0.3 })
            .on('finish', () => {
                  song_queue.songs.shift();
                  video_player(guild, song_queue.songs[0]);
            })
      dispatcher.on('error', (err) => {
            console.log(err);
            try {
                  throw new Error();
            } catch {
                  if (song_queue.connection.dispatcher) {
                        song_queue.connection.dispatcher.end()
                  }
                  song_queue.songs.shift();
                  song_queue.text_channel.send(`There was an error playing this song. Skipping to the next song. sorry for any inconvenience (this is an issue i cant really help).`)
                  video_player(guild, song_queue.songs[0]);
                  console.log('Skipped the song for them cuz of this error ^')
            }
      })
      song_queue.text_channel.send(`🎶 Now playing \`${song.title}\``)
}

const skip_song = (message, server_queue, guild) => {
      if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
      if (message.member.voice.channel !== message.guild.me.voice.channel) {

            return message.channel.send(`You must be in the same voice channel as the bot.`)
      }
      if (!server_queue) return message.channel.send(`There are no songs playing right now`);
      if (server_queue.connection.dispatcher) {
            server_queue.connection.dispatcher.end()
      } else {
            video_player(guild, song)
      }
}

const stop_song = (message, server_queue) => {
      let whattosay = '';
      if (server_queue) {
            server_queue.songs = [];
            queue.delete(message.guild.id);
            whattosay = whattosay + 'Deleted queue, '
            if (server_queue.connection.dispatcher) {
                  server_queue.connection.dispatcher.end()
                  whattosay = whattosay + ' stopped playing, '
            }
      }
      if (message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave()
            whattosay = whattosay + ' left channel'
      }
      if (whattosay !== '') message.channel.send(whattosay).catch(err => { console.log(err) })
}

const pause_song = (message, server_queue) => {
      if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
      if (message.member.voice.channel !== message.guild.me.voice.channel) {

            return message.channel.send(`You must be in the same voice channel as the bot.`)
      }
      if (!server_queue) return message.channel.send(`There are no songs playing.`);

      server_queue.connection.dispatcher.pause()
      message.channel.send('Paused audio playback.')
}

const resume_song = (message, server_queue) => {
      if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
      if (message.member.voice.channel !== message.guild.me.voice.channel) {

            return message.channel.send(`You must be in the same voice channel as the bot.`)
      }
      if (!server_queue) return message.channel.send(`There are no songs playing`);

      server_queue.connection.dispatcher.resume()
      server_queue.connection.dispatcher.pause()
      server_queue.connection.dispatcher.resume()
      message.channel.send('Resumed.')
}

const seek_song = (message, server_queue, args) => {
      if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
      if (message.member.voice.channel !== message.guild.me.voice.channel) {

            return message.channel.send(`You must be in the same voice channel as the bot.`)
      }
      if (!server_queue) return message.channel.send(`There are no songs in queue.`);

      if (!args[0]) return message.channel.send('You must give a time to seek to, like: `sm_seek 54` (the time you seek to is in seconds)')
      if (!isNaN(args[0])) {
            message.channel.send(`Working on seeking to ${args[0]}, this will take a few seconds.`)
            const song_queue = queue.get(message.guild.id);
            const stream = ytdl(song_queue.songs[0].url, { filter: 'audioonly' });
            song_queue.connection.play(stream, { seek: args[0], volume: 0.5 })
                  .on('finish', () => {
                        song_queue.songs.shift();
                        video_player(message.guild.id, queue.get(message.guild.id[0]));
                  });
      } else {
            message.channel.send('You must seek to a number.')
      }
}
const debug_song = (message, server_queue) => {
      let whattosay = '';
      if (server_queue) {
            server_queue.songs = [];
            whattosay = whattosay + 'Cleared queue, '
            queue.delete(message.guild.id)
            whattosay = whattosay + 'deleted queue, '
            if (server_queue.connection.dispatcher) {
                  server_queue.connection.dispatcher.end()
                  whattosay = whattosay + 'killed dispatcher, '
            } else {
                  whattosay = whattosay + 'Dispatcher was already dead (this was most likely the error), '
            }
            if (message.guild.me.voice.channel) {
                  message.guild.me.voice.channel.leave()
                  whattosay = whattosay + 'left voice channel, '
            }
            whattosay = whattosay + 'Should hopefully be good to reconnect now'
      }
      if (whattosay !== '') {
            message.channel.send(whattosay).catch(err => { console.log(err) })
      } else {
            message.channel.send('It seems like the bot is already fully functional, if its not please tell me so i can update debug')
      }
}
/*
if (cmd === 'ogplay'){
            if (botadmin) {
                  if (!args[0]) return
                  if (args[0].toLocaleLowerCase() === 'rickroll') {
                        if (args[1]) {
                              let channeljoin = message.guild.channels.cache.get(args[1]);
                              if (!channeljoin) return message.channel.send('Invalid channel.');
                              if (!channeljoin.joinable) return message.reply('Ozaibot cannot join that channel');
                              if (!channeljoin.type === 'voice') return message.channel.send('That isnt even a voice channel idiot');
                              message.channel.send(`…………………………………………. ………………………………….,-~~”””’~~–,,_
………………………………………….. …………………………….,-~”-,:::::::::::::::::::”-,
………………………………………….. ………………………..,~”::::::::’,::::::: :::::::::::::|’,
………………………………………….. ………………………..|::::::,-~”’___””~~–~”’:}
………………………………………….. ………………………..’|:::::|: : : : : : : : : : : : : :
………………………………………….. ………………………..|:::::|: : :-~~—: : : —–: |
………………………………………….. ……………………….(_”~-’: : : : : : : : :
………………………………………….. ………………………..”’~-,|: : : : : : ~—’: : : :,’–never gonna
………………………………………….. ……………………………|,: : : : : :-~~–: : ::/ —–give you up!
………………………………………….. ……………………….,-”\’:\: :’~,,_: : : : : _,-’
………………………………………….. ………………….__,-’;;;;;\:”-,: : : :’~—~”/|
………………………………………….. ………….__,-~”;;;;;;/;;;;;;;\: :\: : :____/: :’,__
………………………………………….. .,-~~~””_;;;;;;;;;;;;;;;;;;;;;;;;;’,. .”-,:|:::::::|. . |;;;;”-,__
…………………………………………../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .”|::::::::|. .,’;;;;;;;;;;”-,
…………………………………………,’ ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,’. ./|;;;;;;;;;;;;;|
………………………………………,-”;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;’,: : __|. . .|;;;;;;;;;,’;;|`)
                              message.channel.send(`…………………………………….,-”;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;’,;;;;;;; ;;;; \. . |:::|. . .”,;;;;;;;;|;;/
……………………………………/;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/
…………………………………./;;,-’;;;;;;;;;;;;;;;;;;;;;;,’;;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|
…………………………………/;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;”,: |;|. . . . \;;;;;;;|
………………………………,~”;;;;;;;;;; ;;;;;;;;;;;,-”;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|
…………………………..,~”;;;;;;;;;;;;;; ;;;;;;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;’,;;;;;;| |:|. . . . |\;;;;;;;|
………………………….,’;;;;;;;;;;;;;;;;; ;;;;;;;/;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;| |:|. . . .’|;;’,;;;;;|
…………………………|;,-’;;;;;;;;;;;;;;;;;;;,-’;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;| |:|. . .,’;;;;;’,;;;;|_
…………………………/;;;;;;;;;;;;;;;;;,-’_;;;;;;,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;; ;|.|:|. . .|;;;;;;;|;;;;|””~-,`)
                              message.channel.send(`………………………./;;;;;;;;;;;;;;;;;;/_”,;;;,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ,;;| |:|. . ./;;;;;;;;|;;;|;;;;;;|-,,__
……………………../;;;;;;;;;;;;;;;;;,-’…|;;,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;| |:|._,-’;;;;;;;;;|;;;;|;;;;;;;;;;;”’-,_
……………………/;;;;;;;;;;;;;;;;,-’….,’;;,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;|.|:|::::”’~–~”’||;;;;;|;;;;;;;;;;,-~””~–,
………………….,’;;;;;;;;;;;;;;;;,’……/;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;|.|:|::::::::::::::|;;;;;’,;;;;;;;;;”-,: : : : : :”’~-,:”’~~–,
…………………/;;;;;;;;;;;;;;;,-’……,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;|:|:|::::::::::::::’,;;;;;;|_””~–,,-~—,,___,-~~”’__”~-
………………,-’;;;;;;;;;;;;;;;,’……../;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;|:|:|:::::::::::::::|;;;;;;|……………… …”-,\_”-,”-,”~
………………/;;;;;;;;;;;;;;;;/…….,-’;;;;;;;;;;;;;;;;;Scroll Up;;;;;;;;;;;;;;;;;; ;;;;;;;|:|:|:::::::::::::::|;;;;;|…………….`)
                              await message.member.voice.channel.join().then(connection => {
                                    connection.play('./audio/rickroll.mp3');
                              }).catch(err => console.log(err));
                              setTimeout(() => {
                                    if (message.guild.me.voice.channel) message.guild.me.voice.channel.leave()
                              }, 212000);
                        } else {
                              if (!message.member.voice.channel) return message.reply("youre not in a voice channel idiot")
                              message.channel.send(`…………………………………………. ………………………………….,-~~”””’~~–,,_
………………………………………….. …………………………….,-~”-,:::::::::::::::::::”-,
………………………………………….. ………………………..,~”::::::::’,::::::: :::::::::::::|’,
………………………………………….. ………………………..|::::::,-~”’___””~~–~”’:}
………………………………………….. ………………………..’|:::::|: : : : : : : : : : : : : :
………………………………………….. ………………………..|:::::|: : :-~~—: : : —–: |
………………………………………….. ……………………….(_”~-’: : : : : : : : :
………………………………………….. ………………………..”’~-,|: : : : : : ~—’: : : :,’–never gonna
………………………………………….. ……………………………|,: : : : : :-~~–: : ::/ —–give you up!
………………………………………….. ……………………….,-”\’:\: :’~,,_: : : : : _,-’
………………………………………….. ………………….__,-’;;;;;\:”-,: : : :’~—~”/|
………………………………………….. ………….__,-~”;;;;;;/;;;;;;;\: :\: : :____/: :’,__
………………………………………….. .,-~~~””_;;;;;;;;;;;;;;;;;;;;;;;;;’,. .”-,:|:::::::|. . |;;;;”-,__
…………………………………………../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .”|::::::::|. .,’;;;;;;;;;;”-,
…………………………………………,’ ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,’. ./|;;;;;;;;;;;;;|
………………………………………,-”;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;’,: : __|. . .|;;;;;;;;;,’;;|`)
                              message.channel.send(`…………………………………….,-”;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;’,;;;;;;; ;;;; \. . |:::|. . .”,;;;;;;;;|;;/
……………………………………/;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/
…………………………………./;;,-’;;;;;;;;;;;;;;;;;;;;;;,’;;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|
…………………………………/;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;”,: |;|. . . . \;;;;;;;|
………………………………,~”;;;;;;;;;; ;;;;;;;;;;;,-”;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|
…………………………..,~”;;;;;;;;;;;;;; ;;;;;;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;’,;;;;;;| |:|. . . . |\;;;;;;;|
………………………….,’;;;;;;;;;;;;;;;;; ;;;;;;;/;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;| |:|. . . .’|;;’,;;;;;|
…………………………|;,-’;;;;;;;;;;;;;;;;;;;,-’;;;,-’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;| |:|. . .,’;;;;;’,;;;;|_
…………………………/;;;;;;;;;;;;;;;;;,-’_;;;;;;,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;; ;|.|:|. . .|;;;;;;;|;;;;|””~-,`)
                              message.channel.send(`………………………./;;;;;;;;;;;;;;;;;;/_”,;;;,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ,;;| |:|. . ./;;;;;;;;|;;;|;;;;;;|-,,__
……………………../;;;;;;;;;;;;;;;;;,-’…|;;,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;| |:|._,-’;;;;;;;;;|;;;;|;;;;;;;;;;;”’-,_
……………………/;;;;;;;;;;;;;;;;,-’….,’;;,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;|.|:|::::”’~–~”’||;;;;;|;;;;;;;;;;,-~””~–,
………………….,’;;;;;;;;;;;;;;;;,’……/;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;|.|:|::::::::::::::|;;;;;’,;;;;;;;;;”-,: : : : : :”’~-,:”’~~–,
…………………/;;;;;;;;;;;;;;;,-’……,’;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;;|:|:|::::::::::::::’,;;;;;;|_””~–,,-~—,,___,-~~”’__”~-
………………,-’;;;;;;;;;;;;;;;,’……../;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; ;;;;|:|:|:::::::::::::::|;;;;;;|……………… …”-,\_”-,”-,”~
………………/;;;;;;;;;;;;;;;;/…….,-’;;;;;;;;;;;;;;;;;Scroll Up;;;;;;;;;;;;;;;;;; ;;;;;;;|:|:|:::::::::::::::|;;;;;|…………….`)
                              await message.member.voice.channel.join().then(connection => {
                                    connection.play('./audio/rickroll.mp3');
                              }).catch(err => console.log(err));
                        }
                  } else if (args[0].toLocaleLowerCase() === 'banana' || args[0].toLocaleLowerCase() === 'obanana' || args[0].toLocaleLowerCase() === 'ohbanana') {
                        if (botadmin) {
                              await message.member.voice.channel.join().then(connection => {
                                    connection.play('./audio/Oubanana.oga');
                              }).catch(err => console.log(err));
                        }
                  } else if (args[0].toLocaleLowerCase() === 'adventure' || args[0].toLocaleLowerCase() === 'adventureofalifetime') {
                        if (botadmin) {
                              await message.member.voice.channel.join().then(connection => {
                                    connection.play('./audio/adventure.egg')

                              }).catch(err => console.log(err));
                        }
                  } else if (args[0].toLocaleLowerCase() === 'airhorn') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/airhorn.mp3')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'slowdance') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/SLOW_DANCING_IN_THE_DARK.egg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'boinkbeats' || args[0].toLocaleLowerCase() === 'boinkbeats') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/wanna_never_die.ogg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'clockwork') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/clockwork.egg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'fuckyou' || args[0].toLocaleLowerCase() === 'hotgirl' || args[0].toLocaleLowerCase() === 'hotgirlbummer') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/blackbear - hot girl bummer.egg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'camellia') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/megalovania2.egg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'mega' || args[0].toLocaleLowerCase() === 'megalovania') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/Megalovania.egg')
                        }).catch(err => console.log(err));
                  } else if (args[0].toLocaleLowerCase() === 'rooster' || args[0].toLocaleLowerCase() === 'skibidi') {
                        await message.member.voice.channel.join().then(connection => {
                              connection.play('./audio/rooster intro .mp3')
                        }).catch(err => console.log(err));
                        setTimeout(() => {
                              message.guild.me.voice.channel.leave()
                        }, 10000);
                  }

            }
            }
*/