const MsgEmbed = require('../classes/MsgEmbed')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query, locale) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users
  const { t } = msg.client.locale

  const embed = new MsgEmbed(guild)

  if (users[guild.id][user.id].quota < 1) {
    embed.setError()
      .setTitle(t('create.failed', locale))
      .setDescription(t('create.quotaEmpty', locale))

    return await channel.send(embed)
  }

  embed.setTitle(t('create.title', locale))
    .setDescription(t('create.desc', locale))
    .addFields([
      { name: '<:_bots:695946394715815976>', value: t('create.bot', locale), inline: true },
      { name: '<:_server:695947468348719124>', value: t('create.server', locale), inline: true },
      { name: '<:_general:695947856841801759>', value: t('create.chatting', locale), inline: true },
      { name: '<:_broadcasting:695948961361559562>', value: t('create.streamer', locale), inline: true }
    ])

  // From here msg changes from user-msg to bot-msg
  msg = await channel.send(embed)

  const validReactions = ['695946394715815976', '695947468348719124', '695947856841801759', '695948961361559562']
  const names = ['create.bot', 'create.server', 'create.chatting', 'create.streamer']
  const categorys = ['695879447815127061', '695888549156749312', '695943330416033833', '695943427631874090']
  const categorys2 = ['697806639620685876', '697806639620685880', '697806639620685882', '697806639897641052']
  msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return

      // Receive channel name 채널 이름 확인
      embed.setTitle(t('create.channelNameInput.title', locale, t(names[validReactions.indexOf(c.first().emoji.id)], locale)))
        .setDescription(t('create.channelNameInput.desc', locale))
      embed.fields = []

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', async (c2) => {
          if (timeUp(c2, msg)) return

          // Start creating 채널 생성
          c2.first().delete()
          const name = c2.first().content

          if (name.length > 20) {
            embed.setError()
              .setTitle(t('create.failed', locale))
              .setDescription(t('create.nameLimit', locale))

            return msg.edit(embed)
          }

          embed.setTitle(t('create.created.title', locale))
            .setDescription(t('create.created.desc', locale, name, t(names[validReactions.indexOf(c.first().emoji.id)], locale)))

          msg.edit(embed)

          console.log('[Channel Create] at "' + user.username + '" name: "' + name + '"')
          const ch = await guild.channels.create(name, {
            parent: guild.id === '695877575255261306' ? categorys[validReactions.indexOf(c.first().emoji.id)] : categorys2[validReactions.indexOf(c.first().emoji.id)],
            permissionOverwrites: validReactions.indexOf(c.first().emoji.id) !== 2 ? [
              { id: guild.roles.everyone, deny: ['SEND_MESSAGES'] },
              { id: user.id, allow: ['SEND_MESSAGES'] }
            ] : [{ id: user.id, allow: ['MANAGE_MESSAGES'] }]
          })
          ch.setTopic('You can set channel topic by using `?update`\n채널 주제 수정은 `?수정`으로 할 수 있어요!\n\n(Creator/생성한 사람: <@' + user.id + '>)')
          users[guild.id][user.id].quota -= 1
          users[guild.id][user.id].channels.push({ id: ch.id, name })
          const m = await ch.send(t('create.herewego', locale, '<@' + user.id + '>'))
          await m.delete({ timeout: 20000 })
        })
    })

  await msg.react('695946394715815976')
  await msg.react('695947468348719124')
  await msg.react('695947856841801759')
  await msg.react('695948961361559562')
}
