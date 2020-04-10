const { MessageEmbed } = require('discord.js')
const { checkTier } = require('../classes/subfunc')

module.exports = (msg, query, locale) => {
  const { guild, channel } = msg
  const user = msg.mentions.users.size > 0 ? msg.mentions.users.first() : msg.author
  const { users } = msg.client.data
  const { t } = msg.client.locale

  if (!users[guild.id][user.id]) return msg.channel.send(t('userinfo.notRegistered:That user is not registered.', locale))

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())
    .setColor(0x000000)
    .setTitle(t('userinfo.title:**DiscLists.** - User Information', locale))
    .setDescription(t('userinfo.desc:Information of %1$s', locale, '<@' + user.id + '>'))
    .addFields([
      { name: t('userinfo.username:Username', locale), value: '<@' + user.id + '> (' + user.tag + ')', inline: true },
      { name: t('userinfo.tier:Current Tier', locale), value: checkTier(guild, user) },
      { name: t('userinfo.usageCount.name:Channel and Ticket Information', locale), value: t('userinfo.usageCount.value:%1$s channels created (%2$s tickets left)', locale, users[guild.id][user.id].channels.length, users[guild.id][user.id].quota), inline: true }
    ])

  channel.send(embed)
}
