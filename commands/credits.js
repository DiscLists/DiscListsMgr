const { MessageEmbed } = require('discord.js')

module.exports = (msg, query, locale) => {
  const { guild, channel } = msg
  const { t } = msg.client.locale

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())
    .setColor(0x000000)
    .setTitle(t('credits.name:**DiscLists.** - Credits', locale))
    .addFields([
      { name: t('credits.Jia:CEO / Project Lead, Bot Developer', locale), value: guild.members.resolve('550300988473344000').user.tag },
      { name: t('credits.PMH:CTO / Bot Developer', locale), value: guild.members.resolve('527746745073926145').user.tag },
      { name: t('credits.comjun04:CSO / Bot Developer', locale), value: guild.members.resolve('393674169243402240').user.tag },
      { name: t('credits.gangjun:Website Developer', locale), value: guild.members.resolve('476377109032599572').user.tag },
      { name: t('credits.dissolve:Translator', locale), value: guild.members.resolve('347014076989440013').user.tag }
    ])

  channel.send(embed)
}
