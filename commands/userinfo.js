const { MessageEmbed } = require('discord.js')
const { timeUp, checkTier } = require('../classes/subfunc')

module.exports = (msg, guild, channel, users, user) => {
  const embed = new MessageEmbed().setThumbnail(guild.iconURL())
    .setColor(0x000000)
    .setTitle('**DiscLists.** - User Information')
    .setDescription('Information of <@' + user.id + '>')
    .addFields([
      { name: 'Username', value: '<@' + user.id + '> (' + user.tag + ')', inline: true },
      { name: 'Current Tier', value: checkTier(guild, user) },
      { name: 'Channel Usage Count', value: users[user.id].channels.length + ' (out of ' + users[user.id].quota + ')', inline: true }
    ])

  if(!msg) channel.send(embed)
  else msg.edit(embed)
}
