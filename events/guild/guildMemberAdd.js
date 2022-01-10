const guildinvites = new Map()
module.exports = async (Discord, client, guildMemberAdd, invites) => {
    return
    member = guildMemberAdd
    const cachedinvites = guildinvites.get(member.guild.id);
    const newinvites = await member.guild.fetchInvites();
    guildinvites.set(member.guild.id, newinvites)
    try {
        const usedinvite = newinvites.find(inv => cachedinvites.get(inv.code).uses < inv.uses)
        let ozaibottestservergeneral = client.channels.cache.get('911834354873925713')
    ozaibottestservergeneral.send(`Invite link used: ${usedinvite.code}`)
    }
    catch(err){
        console.log(err)
    }
}