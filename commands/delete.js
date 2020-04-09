const { MessageEmbed } = require('discord.js')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query, locale) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users
  const { t } = msg.client.locale

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  // No channel 채널이 없음
  if (users[user.id].channels.length < 1) {
    embed.setColor(0xff0000)
      .setTitle(t('delete.failed:**DiscLists.** - Delete Channel Failed', locale))
      .setDescription(t('delete.noChannel:You don\'t have any channels.', locale))

    return channel.send(embed)
  }
  // Choose channel to delete 삭제할 채널 선택
  embed.setColor(0x000000)
    .setTitle(t('delete.title:**DiscLists.** - Delete Channel', locale))
    .setDescription(t('delete.desc:Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>', locale))

  users[user.id].channels.forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', t('delete.deleted:Deleted', locale))
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  // From here msg changes from user-msg to bot-msg
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
          .setTitle(t('delete.failed:**DiscLists.** - Delete Channel Failed', locale))
          .setDescription(t('delete.notNumber:%1$s is not a number', locale, c.first().content))

        return msg.edit(embed)
      }

      // If the channel not exists 채널이 존재하지 않을 경우
      if (!users[user.id].channels[m - 1]) {
        embed.setColor(0xff0000)
          .setTitle(t('delete.failed:**DiscLists.** - Delete Channel Failed', locale))
          .setDescription(t('delete.notExist:Channel No.%1$s not exist', locale, c.first().content))

        return msg.edit(embed)
      }

      embed.setTitle(t('delete.title:**DiscLists.** - Delete Channel', locale))
        .setDescription(t('delete.confirm:R U sure to want to **DELETE** %1$s? <:_stopwatch20:695945085950361621>', locale, '<#' + users[user.id].channels[m - 1].id + '>'))

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
              embed.setTitle(t('delete.title:**DiscLists.** - Delete Channel', locale))
                .setDescription(t('delete.channelDeleted:Deleted channel %1$s', locale, users[user.id].channels[m - 1].name))
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
