async function invfound(member, invite) {

    console.log(invite)
    query = `INSERT INTO invites (userid, serverid, inviterid, time, invitecode) VALUES (?, ?, ?, ?, ?)`;
    data = [member.id, member.guild.id, invite.inviter.id, Number(Date.now(unix).toString().slice(0, -3).valueOf()), invite.code];
    connection.query(query, data, function (error, results, fields) {
          if (error) {
                return console.log(error);
          }
          console.log(`${member.user.tag} has joined ${member.guild} using invite code ${invite.code} made by ${invite.inviter.tag}`);
          return;
    })
    if (guild.id == '806532573042966528') {
          let verchannel = client.channels.cache.get('922511452185694258');
          const verembed = new Discord.MessageEmbed()
                .embedAuthorData(`${member.user.tag} (${member.id}) has joined`, member.user.avatarURL())
                .setColor('BLUE')
                .setDescription(`Account age: <t:${Number(moment(member.user.createdAt).unix())}:R>\nInvite link used: \`${invite.code}\`,\nThis invite has been used ${invite.uses} times.\nThis invite was created by ${invite.inviter.tag} (${invite.inviter.id})`)
          verchannel.send({ embeds: [verembed] });
    }
    query = `SELECT * FROM lockdownlinks WHERE invitecode = ? && serverid = ?`;
    data = [invite.code, member.guild.id];
    connection.query(query, data, function (error, results, fields) {
          if (error) {
                return console.log(error);
          }
          if (results == '' || results === undefined) return;
          for (row of results) {
                let action = row["action"];
                let adminid = row["adminid"];
                if (action === 'mute') {
                      let query = `SELECT * FROM ${guild.id}config WHERE type = ?`;
                      let data = ['muterole'];
                      serversdb.query(query, data, function (error, results, fields) {
                            if (error) return console.log(error);
                            if (results == `` || results === undefined) {
                                  return console.log(`${guild} (${guild.id}) has set up a link to automute but there is no mute role for this server`);
                            }
                            for (row of results) {
                                  let muteroleid = row["details"];
                                  const muterole = guild.roles.cache.get(muteroleid);
                                  if (!muterole) {
                                        return console.log(`${guild} (${guild.id}) has set up a link to automute but the mute role could not be found`);
                                  }
                                  if (guild.me.roles.highest.position <= muterole.position) {
                                        console.log(`${guild} (${guild.id}) has set up a link to automute but I do not have high enough permissions to mute the user`);
                                  }
                                  member.roles.add(muterole).catch(err => {
                                        console.log(err);
                                  })
                                  console.log(`${member.user.tag} was muted from ${guild} (${guild.id}) for using blacklisted link: ${invite.code}`);
                                  member.send(`You have been muted because you are a prime suspect in an on going raid.`);
                            }
                      })
                } else if (action === 'kick') {
                      member.send(`You have been kicked from ${guild} because you are a suspect in an on going raid.`);
                      member.kick().catch(err => { console.log(err) });
                      console.log(`${member.user.tag} was kicked from ${guild} for using blacklisted link: ${invite.code}`);
                } else if (action === 'ban') {
                      let admin = client.users.cache.get(adminid);
                      if (!admin) { admin = 'Unknownuser' } else { admin = admin.tag }
                      member.send(`You have been banned from ${guild} because you are a prime suspect in an on going raid.`);
                      member.ban({ reason: `AUTOBAN: Used link set for autoban: ${invite.code}. The blacklist on this invite was set by ${admin}(${adminid})` }).catch(err => { console.log(err) });
                      console.log(`${member.user.tag} was banned from ${guild} for using blacklisted link: ${invite.code}.`);
                }
          }
    })
}