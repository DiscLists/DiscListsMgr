const { MessageEmbed } = require('discord.js')
const { checkTier } = require('../classes/subfunc')

module.exports = (msg, query) => {
  const { guild, channel } = msg
  const user = msg.mentions.users.size > 0 ? msg.mentions.users.first() : msg.author
  const users = msg.client.data.users

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())
    .setColor(0x000000)
    .setTitle('**DiscLists.** - User Information')
    .setDescription('Information of <@' + user.id + '>')
    .addFields([
      { name: 'Username', value: '<@' + user.id + '> (' + user.tag + ')', inline: true },
      { name: 'Current Tier', value: checkTier(guild, user) },
      { name: 'Channel Usage Count', value: users[user.id].channels.length + ' (out of ' + users[user.id].quota + ')', inline: true }
    ])

  channel.send(embed)
}
