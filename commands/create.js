const { MessageEmbed } = require('discord.js')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query, locale) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users
  const { t } = msg.client.locale

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  if (users[user.id].channels.length >= users[user.id].quota) {
    embed.setColor(0xff0000)
      .setTitle(t('create.failed:**DiscLists.** - Create Channel Failed', locale))
      .setDescription(t('create.quotaExceeded:Quota exceeded!\nYou have reached the **%1$s** channels limit.', locale, users[user.id].quota))

    return await channel.send(embed)
  }

  embed.setColor(0x000000)
    .setTitle(t('create.title:**DiscLists.** - Create Channel', locale))
    .setDescription(t('create.desc:Plz choose one of the category below <:_stopwatch20:695945085950361621>', locale))
    .addFields([
      { name: '<:_bots:695946394715815976>', value: t('create.bot:Bot', locale), inline: true },
      { name: '<:_server:695947468348719124>', value: t('create.server:Server', locale), inline: true },
      { name: '<:_general:695947856841801759>', value: t('create.chatting:Chatting', locale), inline: true },
      { name: '<:_broadcasting:695948961361559562>', value: t('create.streamer:Streamer', locale), inline: true }
    ])

  // From here msg changes from user-msg to bot-msg
  msg = await channel.send(embed)

  const validReactions = ['695946394715815976', '695947468348719124', '695947856841801759', '695948961361559562']
  const names = ['create.bot:Bot', 'create.server:Server', 'create.chatting:Chatting', 'create.streamer:Streamer']
  const categorys = ['695879447815127061', '695888549156749312', '695943330416033833', '695943427631874090']
  msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return

      // Receive channel name 채널 이름 확인
      embed.setTitle(t('create.channelNameInput.title:**DiscLists.** - Create Channel about *%1$s*', locale, t(names[validReactions.indexOf(c.first().emoji.id)], locale)))
        .setDescription(t('create.channelNameInput.desc:**Please enter your channel name** <:_stopwatch20:695945085950361621>', locale))
      embed.fields = []

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', async (c2) => {
          if (timeUp(c2, msg)) return

          // Start creating 채널 생성
          c2.first().delete()
          const name = c2.first().content

          if (name.length > 20) {
            embed.setColor(0xff0000)
              .setTitle(t('create.failed:**DiscLists.** - Create Channel Failed', locale))
              .setDescription(t('create.nameLimit:Channel name cannot exceed 20 characters (including spaces)', locale))

            return msg.edit(embed)
          }

          embed.setTitle(t('create.created.title:**DiscLists.** - Created Channel', locale))
            .setDescription(t('create.created.desc:I\'ll create channel "%1$s" about %2$s for you!', locale, name, t(names[validReactions.indexOf(c.first().emoji.id)], locale)))

          msg.edit(embed)

          console.log('[Channel Create] at "' + user.username + '" name: "' + name + '"')
          const ch = await guild.channels.create(name, {
            parent: categorys[validReactions.indexOf(c.first().emoji.id)],
            permissionOverwrites: validReactions.indexOf(c.first().emoji.id) !== 2 ? [
              { id: guild.roles.everyone, deny: ['SEND_MESSAGES'] },
              { id: user.id, allow: ['SEND_MESSAGES'] }
            ] : [{ id: user.id, allow: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'] }]
          })
          users[user.id].channels.push({ id: ch.id, name })
          const m = await ch.send(t('create.herewego:Here we go! %1$s', locale, '<@' + user.id + '>'))
          await m.delete({ timeout: 20000 })
        })
    })

  await msg.react('695946394715815976')
  await msg.react('695947468348719124')
  await msg.react('695947856841801759')
  await msg.react('695948961361559562')
}
