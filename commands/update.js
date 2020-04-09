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
      .setTitle(t('update.failed:**DiscLists.** - Update Channel Failed', locale))
      .setDescription(t('update.noChannel:You don\'t have any channels.', locale))

    return channel.send(embed)
  }

  // Choose channel to edit 수정할 채널 선택
  embed.setColor(0x000000)
    .setTitle(t('update.title:**DiscLists.** - Update Channel', locale))
    .setDescription(t('update.desc:Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>', locale))

  users[user.id].channels.forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', t('update.deleted:Deleted', locale))
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
          .setTitle(t('update.failed:**DiscLists.** - Update Channel Failed', locale))
          .setDescription(t('update.notNumber:%1$s is not a number', locale, c.first().content))

        return msg.edit(embed)
      }

      // If the channel not exists 채널이 존재하지 않을 경우
      if (!users[user.id].channels[m - 1]) {
        embed.setColor(0xff0000)
          .setTitle(t('update.failed:**DiscLists.** - Update Channel Failed', locale))
          .setDescription(t('update.notExist:Channel No.%1$s not exist', locale, c.first().content))

        return msg.edit(embed)
      }

      // If the channel is manually deleted 채널이 수동으로 삭제된 경우
      if (!guild.channels.resolve(users[user.id].channels[m - 1].id)) {
        embed.setColor(0xff0000)
          .setTitle(t('update.failed:**DiscLists.** - Update Channel Failed', locale))
          .setDescription(t('update.alreadyDeleted:Channel No.%1$s is already deleted', locale, c.first().content))

        return msg.edit(embed)
      }

      // Enter new name for the channel 변경할 채널 이름 입력
      embed.setTitle(t('update.title:**DiscLists.** - Update Channel', locale))
        .setDescription(t('update.enterNewName:Plz enter a new name for %1$s <:_stopwatch20:695945085950361621>', locale, '<#' + users[user.id].channels[m - 1].id + '>'))

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', (c2) => {
          if (timeUp(c2, msg)) return

          const name = c2.first().content
          if (name.length > 20) {
            embed.setColor(0xff0000)
              .setTitle(t('update.failed:**DiscLists.** - Update Channel Failed', locale))
              .setDescription(t('update.nameLimit:Channel name cannot exceed 20 characters (including spaces)', locale))

            return msg.edit(embed)
          }

          c2.first().delete()
          embed.setTitle(t('update.title:**DiscLists.** - Update Channel', locale))
            .setDescription(t('update.change:Okay, I\'ll change name to %1$s for you', locale, '<#' + users[user.id].channels[m - 1].id + '>'))

          users[user.id].channels[m - 1].name = name

          guild.channels.resolve(users[user.id].channels[m - 1].id).setName(name)
          msg.edit(embed)
        })
    })
}
