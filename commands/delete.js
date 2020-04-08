const { MessageEmbed } = require('discord.js')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, guild, channel, users, user) => {
  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  // No channel 채널이 없음
  if (users[user.id].channels.length < 1) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Delete Channel Failed')
      .setDescription('You don\'t have any channels.')

    if(!msg) return channel.send(embed)
    else return msg.edit(embed)
  }
  // Choose channel to delete 삭제할 채널 선택
  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Delete Channel')
    .setDescription('Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>')

  users[user.id].channels.forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', 'Deleted')
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  if(!msg) msg = await channel.send(embed)
  else msg.edit(embed)

  channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return
      embed.fields = []

      c.first().delete()
      const m = parseInt(c.first().content)

      // If input is NaN 입력값이 숫자가 아닐 경우
      if (isNaN(m)) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Delete Channel Failed')
          .setDescription(c.first().content + ' is not a number')

        return msg.edit(embed)
      }

      // If the channel not exists 채널이 존재하지 않을 경우
      if (!users[user.id].channels[m - 1]) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Delete Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' not exists')

        return msg.edit(embed)
      }

      embed.setTitle('**DiscLists.** - Delete Channel')
        .setDescription('R U sure to want to **DELETE** <#' + users[user.id].channels[m - 1].id + '>? <:_stopwatch20:695945085950361621>')

      msg.edit(embed)
      msg.react('✅')
      msg.react('❌')

      const validReactions = ['✅', '❌']
      msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.name) && u.id === user.id, { max: 1, time: 20000 })
        .on('end', (c2) => {
          if (timeUp(c2, msg)) return
          switch (c2.first().emoji.name) {
            case '✅': {
              const ch = guild.channels.resolve(users[user.id].channels[m - 1].id)
              embed.setTitle('**DiscLists.** - Delete Channel')
                .setDescription('Deleted channel ' + users[user.id].channels[m - 1].name)
              users[user.id].channels.splice(m - 1, 1)

              if (ch) ch.delete()

              msg.edit(embed)
              break
            }

            case '❌':
              msg.delete()
              break
          }
        })
    })
}
