const { MessageEmbed } = require('discord.js')

module.exports = (msg, query) => {
  const { guild, channel } = msg

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())
    .setColor(0x000000)
    .setTitle('**DiscLists.** - Credits')
    .addFields([
      { name: 'CEO / Project Lead, Bot Developer', value: guild.members.resolve('550300988473344000').user.tag },
      { name: 'CTO / Bot Developer', value: guild.members.resolve('527746745073926145').user.tag },
      { name: 'CSO / Bot Developer', value: guild.members.resolve('393674169243402240').user.tag },
      { name: 'Website Developer', value: guild.members.resolve('476377109032599572').user.tag },
      { name: 'Translator', value: guild.members.resolve('347014076989440013').user.tag }
    ])

  channel.send(embed)
}
