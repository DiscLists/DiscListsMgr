/**
 * @param {import('discord.js').GuildMember} member
 */
module.exports = (member) => {
  member.setNickname('[ 유저 ]' + (member.nickname || member.user.username))
}
