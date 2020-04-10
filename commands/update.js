const MsgEmbed = require('../classes/MsgEmbed')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query, locale) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users
  const { t } = msg.client.locale

  const embed = new MsgEmbed(guild)

  // No channel 채널이 없음
  if (users[guild.id][user.id].channels.length < 1) {
    embed.setColor(0xff0000)
      .setTitle(t('update.failed', locale))
      .setDescription(t('update.noChannel', locale))
    return channel.send(embed)
  }

  // Choose channel to edit 수정할 채널 선택
  embed.setColor(0x000000)
    .setTitle(t('update.title', locale))
    .setDescription(t('update.desc', locale))

  users[guild.id][user.id].channels.forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', t('update.deleted', locale))
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  // From here 'msg' changes from user-msg to bot-msg
  msg = await channel.send(embed)

  channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return
      embed.clearFields()

      c.first().delete()
      const m = parseInt(c.first().content)

      // If input is NaN 입력값이 숫자가 아닐 경우
      if (checkNaN(msg, embed, locale, m)) return

      // If the channel not exists 채널이 존재하지 않을 경우
      if (!users[guild.id][user.id].channels[m - 1]) {
        embed.setError()
          .setTitle(t('update.failed', locale))
          .setDescription(t('update.notExist', locale, m))
        return msg.edit(embed)
      }

      // If the channel is manually deleted 채널이 수동으로 삭제된 경우
      if (!guild.channels.resolve(users[guild.id][user.id].channels[m - 1].id)) {
        embed.setError()
          .setTitle(t('update.failed', locale))
          .setDescription(t('update.alreadyDeleted', locale, m))
        return msg.edit(embed)
      }

      // Choose what to update 변경할 항목 선택
      embed.setDescription(t('update.enterOption', locale, '<#' + users[guild.id][user.id].channels[m - 1].id + '>'))
        .clearFields()
        .addFields([
          { name: t('update.option.1.title', locale), value: t('update.option.1.desc', locale) },
          { name: t('update.option.2.title', locale), value: t('update.option.2.desc', locale) }
        ])
      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', async (c2) => {
          if (timeUp(c2, msg)) return

          let input = c2.first().content
          c2.first().delete()
          if (checkNaN(msg, embed, locale, input)) return
          if (input < 1 || input > 2) {
            embed.setError()
              .setTitle(t('update.failed', locale))
              .setDescription(t('update.invalidOption', locale))
            msg.edit(embed)
            return
          }

          input = parseInt(input)
          await [changeName, changeTopic][input - 1](msg, m)
        })
    })

  var changeName = (msg, m) => {
    // Enter new name for the channel 변경할 채널 이름 입력
    embed.setTitle(t('update.title', locale))
      .setDescription(t('update.enterNewName', locale, '<#' + users[guild.id][user.id].channels[m - 1].id + '>'))
      .clearFields()

    msg.edit(embed)

    channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
      .on('end', (c) => {
        if (timeUp(c, msg)) return

        const name = c.first().content
        c.first().delete()
        if (name.length > 20) {
          embed.setError()
            .setTitle(t('update.failed', locale))
            .setDescription(t('update.nameLimit', locale))

          return msg.edit(embed)
        }

        embed.setDescription(t('update.change', locale, '<#' + users[guild.id][user.id].channels[m - 1].id + '>'))

        users[guild.id][user.id].channels[m - 1].name = name

        guild.channels.resolve(users[guild.id][user.id].channels[m - 1].id).setName(name)
        msg.edit(embed)
      })
  }

  var changeTopic = (msg, m) => {
    // Enter new topic for the channel 변경할 채널 주제 입력
    embed.setTitle(t('update.title', locale))
      .setDescription(t('update.enterNewTopic', locale, '<#' + users[guild.id][user.id].channels[m - 1].id + '>'))
      .clearFields()

    msg.edit(embed)

    channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
      .on('end', (c) => {
        if (timeUp(c, msg)) return

        const topic = c.first().content
        c.first().delete()
        if (topic.length > 100) {
          embed.setError()
            .setTitle(t('update.failed', locale))
            .setDescription(t('update.topicLimit', locale))

          return msg.edit(embed)
        }

        embed.setDescription(t('update.changeTopic', locale, topic))

        guild.channels.resolve(users[guild.id][user.id].channels[m - 1].id).setTopic(topic + '\n\n(Creator/생성한 사람: <@' + user.id + '>)')
        msg.edit(embed)
      })

  }
}

function checkNaN (m, embed, locale, input) {
  // If input is NaN 입력값이 숫자가 아닐 경우
  if (isNaN(input)) {
    embed.setError()
      .setTitle(m.client.locale.t('update.failed', locale))
      .setDescription(m.client.locale.t('update.notNumber', locale, input))

    m.edit(embed)
    return true
  }
}
