module.exports = async (Discord, client, oldstate, newstate) => {
    if (oldstate.member.user.bot) return;
    if (newstate.channelId === null) return //console.log(`${oldstate.member.user.tag} left a channel`)
    if (oldstate.channelId === null) {
        if (client.lockedvoicechannels.includes(newstate.channelId)) {
            newstate.member.voice.setChannel(null, 'Channel has been locked by command, Kicking from VC. To unlock channel, use `lockvc [channel]`').catch(err => { console.log(err) })
        }
        return //console.log(`${oldstate.member.user.tag} joined a channel`)
    }
    if (oldstate.channelId !== newstate.channelId) {
        if (client.lockedvoicechannels.includes(newstate.channelId)) {
            newstate.member.voice.setChannel(null, 'Channel has been locked by command, Kicking from VC. To unlock channel, use `lockvc [channel]`').catch(err => { console.log(err) })
        }
        return //console.log(`${oldstate.member.user.tag} moved channels`)
    }
    if (oldstate.selfDeaf && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} un-deafened`)
    if (oldstate.selfMute && !newstate.selfMute && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} un-muted`)
    if (!oldstate.selfMute && newstate.selfMute && !newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} muted`)
    if (!oldstate.selfdeaf && newstate.selfDeaf) return //console.log(`${oldstate.member.user.tag} deafened`)
    if (oldstate.selfVideo && !newstate.selfVideo) return// console.log(`${oldstate.member.user.tag} stopped videoing`)
    if (!oldstate.selfVideo && newstate.selfVideo) return// console.log(`${oldstate.member.user.tag} started videoing`)
    if (oldstate.streaming && !newstate.streaming) return //console.log(`${oldstate.member.user.tag} stopped streaming`)
    if (!oldstate.streaming && newstate.streaming) return //console.log(`${oldstate.member.user.tag} started streaming`)
    if (oldstate.serverDeaf && !newstate.serverDeaf) return// console.log(`${oldstate.member.user.tag} was un-force-deafened`)
    if (!oldstate.serverDeaf && newstate.serverDeaf) return //console.log(`${oldstate.member.user.tag} was force-deafened`)
    if (oldstate.serverMute && !newstate.serverMute) return //console.log(`${oldstate.member.user.tag} was un-force-muted`)
    if (!oldstate.serverMute && newstate.serverMute) return //console.log(`${oldstate.member.user.tag} was force-muted`)
}