/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('../classes/BotClient')} client
 */
module.exports = (member, client) => {
  member.setNickname('[ 유저 ] ' + (member.nickname || member.user.username))
  member.roles.add(client.settings.userRole)
}
