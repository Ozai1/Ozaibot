module.exports = {
    opt: {

        voiceConfig: {
            leaveOnEnd: false, 
            autoSelfDeaf: false, 

            leaveOnTimer: { 
                status: false, 
                time: 480 * 1000, // 8 mins 
            }
        },

        maxVol: 200, //maximum volume level
        loopMessage: false,

        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio', 
                highWaterMark: 1 << 25 
            }
        }
    }
}