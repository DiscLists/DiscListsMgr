const { MessageEmbed } = require('discord.js')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  // No channel 채널이 없음
  if (users[user.id].channels.length < 1) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Update Channel Failed')
      .setDescription('You don\'t have any channels.')

    return channel.send(embed)
  }

  // Choose channel to edit 수정할 채널 선택
  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Update Channel')
    .setDescription('Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>')

  users[user.id].channels.forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', 'Deleted')
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  // From here 'msg' changes from user-msg to bot-msg
  msg = await channel.send(embed)

  channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return
      embed.fields = []

      c.first().delete()
      const m = parseInt(c.first().content)

      // If input is NaN 입력값이 숫자가 아닐 경우
      if (isNaN(m)) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Update Channel Failed')
          .setDescription(c.first().content + ' is not a number')

        return msg.edit(embed)
      }

      // If the channel not exists 채널이 존재하지 않을 경우
      if (!users[user.id].channels[m - 1]) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Update Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' not exists')

        return msg.edit(embed)
      }

      // If the channel is manually deleted 채널이 수동으로 삭제된 경우
      if (!guild.channels.resolve(users[user.id].channels[m - 1].id)) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Update Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' is already deleted')

        return msg.edit(embed)
      }

      // Enter new name for the channel 변경할 채널 이름 입력
      embed.setTitle('**DiscLists.** - Update Channel')
        .setDescription('Plz enter a new name for <#' + users[user.id].channels[m - 1].id + '> <:_stopwatch20:695945085950361621>')

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', (c2) => {
          if (timeUp(c2, msg)) return

          c2.first().delete()
          embed.setTitle('**DiscLists.** - Update Channel')
            .setDescription('Okay, I\'ll change name to <#' + users[user.id].channels[m - 1].id + '> for you')

          users[user.id].channels[m - 1].name = c2.first().content

          guild.channels.resolve(users[user.id].channels[m - 1].id).setName(c2.first().content)
          msg.edit(embed)
        })
    })
}
