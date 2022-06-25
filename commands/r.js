const { unix } = require("moment");
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
    name: 'r',
    description: 'repeats a message',
    aliases: [],
    async execute(message, client, cmd, args, Discord, userstatus) {
        if (message.content.toLowerCase().includes('<@&') || message.content.toLowerCase().includes('@everyone') || message.content.toLowerCase().includes('@here')) return message.channel.send('Reminder must not contain any role, everyone or here pings.');
        const currenttime = Number(Date.now(unix).toString().slice(0, -3).valueOf());
        let timeunban = 9999999999;
        let display = '';
        let mutetimeseconds = null;
        if (args[1]) {
            const validtimes = ['s-sec', 'sec-sec', 'second-sec', 'secs-sec', 'seconds-sec', 'm-min', 'min-min', 'mins-min', 'minute-min', 'minutes-min', 'h-hou', 'hour-hou', 'hours-hou', 'd-day', 'day-day', 'days-day', 'w-wee', 'week-wee', 'weeks-wee', 'mon-mon', 'months-mon'];
            let unitoftime = null;
            let unitchosenraw = null;
            const timechosen = args[0];
            let timechosenpostfixfound = false;
            validtimes.forEach((potentialtime2) => {
                const potentialtime = potentialtime2.slice(0, -4);
                if (timechosenpostfixfound === false) {
                    if (potentialtime === timechosen.slice(timechosen.length - 1)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 1);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);
                    } else if (potentialtime === timechosen.slice(timechosen.length - 3)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 3);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);
                    } else if (potentialtime === timechosen.slice(timechosen.length - 4)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 4);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);
                    } else if (potentialtime === timechosen.slice(timechosen.length - 5)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 5);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);
                    } else if (potentialtime === timechosen.slice(timechosen.length - 6)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 6);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);
                    } else if (potentialtime === timechosen.slice(timechosen.length - 7)) {
                        unitchosenraw = timechosen.slice(timechosen.length - 7);
                        timechosenpostfixfound = true;
                        unitoftime = potentialtime2.slice(potentialtime2.length - 3);

                    }
                }
            })
            if (timechosenpostfixfound === true) {
                if (unitoftime === 'min') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 60;
                    timeunban = Number(mutetimeseconds + currenttime);
                } else if (unitoftime === 'hou') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 3600;
                    timeunban = mutetimeseconds + currenttime;
                } else if (unitoftime === 'day') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 86400;
                    timeunban = Number(mutetimeseconds + currenttime);
                } else if (unitoftime === 'wee') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 604800;
                    timeunban = Number(mutetimeseconds + currenttime);
                } else if (unitoftime === 'mon') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length) * 2592000;
                    timeunban = Number(mutetimeseconds + currenttime);
                } else if (unitoftime === 'sec') {
                    mutetimeseconds = timechosen.slice(0, -unitchosenraw.length);
                    timeunban = Number(mutetimeseconds) + currenttime;
                }
            } else {
                return message.channel.send('Usage: `sm_r [time] [text]`')
            }
        } else {
            return message.channel.send('Usage: `sm_r [time] [text]`')
        }
        const rembed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle(`Reminder set in this channel for <t:${timeunban}:R>.`)
        message.channel.send({embeds: [rembed]})
        query = "INSERT INTO reminders (userid, channelid, time, text) VALUES (?, ?, ?, ?)";
        data = [message.author.id, message.channel.id, timeunban, args.slice(1).join(" ")]
        connection.query(query, data, function (error, results, fields) {
            if (error) {
                message.channel.send('There was a backend error :/')
                return console.log(error)
            }
            return
        })
    }
}