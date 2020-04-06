const { MessageEmbed } = require('discord.js')

module.exports = async (msg) => {
  const { guild } = msg
  const { user } = msg.member
  const { users } = msg.client.data

  if (!users[user.id]) users[user.id] = []

  const embed = new MessageEmbed()
    .setColor(0x000000)
    .setTitle('**DiscLists.** - List Manager')
    .setThumbnail(guild.iconURL())
    .setDescription('Plz choose one of the menu below <:_stopwatch20:695945085950361621>')
    .addFields([
      { name: '<:_create:695920237530578974>', value: users[user.id].length > 1 ? '~~Create~~ (Not Available)' : 'Create', inline: true },
      { name: '<:_update:695918214194003988>', value: users[user.id].length < 1 ? '~~Update~~ (Not Available)' : 'Update', inline: true },
      { name: '<:_delete:695917878154887229>', value: users[user.id].length < 1 ? '~~Delete~~ (Not Available)' : 'Delete', inline: true },
      { name: '<:_infos:695923641291898952>', value: 'User Infos', inline: true },
      { name: '<:_credits:695925110179102751>', value: 'Bot Credits', inline: true }
    ])

  const m = await msg.channel.send(embed)

  m.react('695920237530578974')
  m.react('695918214194003988')
  m.react('695917878154887229')
  m.react('695923641291898952')
  m.react('695925110179102751')

  const validReactions = ['695920237530578974', '695918214194003988', '695917878154887229', '695923641291898952', '695925110179102751']

  m.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, m)) return
      switch (validReactions.indexOf(c.first().emoji.id)) {
        case 0:
          create(m, users, user)
          break

        case 1:
          update(m, users, user)
          break

        case 2:
          del(m, users, user)
          break
      }
    })
}

function timeUp (c, msg) {
  msg.reactions.removeAll()
  if (!c.first()) {
    msg.react('695945085950361621')
    msg.react('🇹')
    msg.react('🇮')
    msg.react('🇲')
    msg.react('🇪')
    msg.react('🇺')
    msg.react('🇵')
    return true
  }
}

// Choose channel type
async function create (msg, users, user) {
  const { guild, channel } = msg
  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  if (users[user.id].length > 1) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Create Channel Failed')
      .setDescription('Quota exceeded!\nYou cannot create channels anymore')

    return msg.edit(embed)
  }

  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Create Channel')
    .setDescription('Plz choose one of the category below <:_stopwatch20:695945085950361621>')
    .addFields([
      { name: '<:_bots:695946394715815976>', value: 'Bots', inline: true },
      { name: '<:_server:695947468348719124>', value: 'Server', inline: true },
      { name: '<:_general:695947856841801759>', value: 'General', inline: true },
      { name: '<:_broadcasting:695948961361559562>', value: 'Broadcasting', inline: true }
    ])

  msg.edit(embed)

  msg.react('695946394715815976')
  msg.react('695947468348719124')
  msg.react('695947856841801759')
  msg.react('695948961361559562')

  const validReactions = ['695946394715815976', '695947468348719124', '695947856841801759', '695948961361559562']
  const names = ['bot', 'server', 'something', 'broadcasting']
  const categorys = ['695879447815127061', '695888549156749312', '695943330416033833', '695943427631874090']
  msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return

      // Receive channel name 채널 이름 확인
      embed.setTitle('**DiscLists.** - Create Channel about ' + names[validReactions.indexOf(c.first().emoji.id)])
        .setDescription('**Please enter your channel name** <:_stopwatch20:695945085950361621>')
      embed.fields = []

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', async (c2) => {
          if (timeUp(c2, msg)) return

          // Start creating 채널 생성
          c2.first().delete()
          const name = c2.first().content

          embed.setTitle('**DiscLists.** - Created Channel')
            .setDescription('I\'ll create channel "' + name + '" about ' + names[validReactions.indexOf(c.first().emoji.id)] + ' for you!')

          msg.edit(embed)

          console.log('[Channel Create] at "' + user.username + '" name: "name"')
          const ch = await guild.channels.create(name, {
            parent: categorys[validReactions.indexOf(c.first().emoji.id)],
            permissionOverwrites: validReactions.indexOf(c.first().emoji.id) !== 2 ? [
              { id: guild.roles.everyone, deny: ['SEND_MESSAGES'] },
              { id: user.id, allow: ['SEND_MESSAGES'] }
            ] : [{ id: user.id, allow: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'] }]
          })
          users[user.id].push({ id: ch.id, name })
          const m = await ch.send('Here we go! <@' + user.id + '>')
          await m.delete({ timeout: 20000 })
        })
    })
}

function update (msg, users, user) {
  const { guild, channel } = msg
  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  // No channel 채널이 없음
  if (users[user.id].length < 1) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Update Channel Failed')
      .setDescription('You don\'t have any channels.')

    return msg.edit(embed)
  }

  // Choose channel to edit 수정할 채널 선택
  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Update Channel')
    .setDescription('Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>')

  users[user.id].forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', 'Deleted')
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  msg.edit(embed)

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
      if (!users[user.id][m - 1]) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Update Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' not exists')

        return msg.edit(embed)
      }

      // If the channel is manually deleted 채널이 수동으로 삭제된 경우
      if (!guild.channels.resolve(users[user.id][m - 1].id)) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Update Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' is already deleted')

        return msg.edit(embed)
      }

      // Enter new name for the channel 변경할 채널 이름 입력
      embed.setTitle('**DiscLists.** - Update Channel')
        .setDescription('Plz enter a new name for <#' + users[user.id][m - 1].id + '> <:_stopwatch20:695945085950361621>')

      msg.edit(embed)

      channel.createMessageCollector((m) => m.author.id === user.id, { max: 1, time: 20000 })
        .on('end', (c2) => {
          if (timeUp(c2, msg)) return

          c2.first().delete()
          embed.setTitle('**DiscLists.** - Update Channel')
            .setDescription('Okay, I\'ll change name to <#' + users[user.id][m - 1].id + '> for you')

          users[user.id][m - 1].name = c2.first().content

          guild.channels.resolve(users[user.id][m - 1].id).setName(c2.first().content)
          msg.edit(embed)
        })
    })
}

function del (msg, users, user) {
  const { guild, channel } = msg
  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  // No channel 채널이 없음
  if (users[user.id].length < 1) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Delete Channel Failed')
      .setDescription('You don\'t have any channels.')

    return msg.edit(embed)
  }
  // Choose channel to edit 수정할 채널 선택
  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Delete Channel')
    .setDescription('Plz enter one of the channel No. below <:_stopwatch20:695945085950361621>')

  users[user.id].forEach((v, i) => {
    i++
    const target = guild.channels.resolve(v.id)
    if (!target) embed.addField(i + '. ~~' + v.name + '~~', 'Deleted')
    else embed.addField(i + '. ' + v.name, '<#' + v.id + '>')
  })

  msg.edit(embed)

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
      if (!users[user.id][m - 1]) {
        embed.setColor(0xff0000)
          .setTitle('**DiscLists.** - Delete Channel Failed')
          .setDescription('Channel No.' + c.first().content + ' not exists')

        return msg.edit(embed)
      }

      embed.setTitle('**DiscLists.** - Delete Channel')
        .setDescription('R U sure to want to **DELETE** <#' + users[user.id][m - 1].id + '>? <:_stopwatch20:695945085950361621>')

      msg.edit(embed)
      msg.react('✅')
      msg.react('❌')

      const validReactions = ['✅', '❌']
      msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.name) && u.id === user.id, { max: 1, time: 20000 })
        .on('end', (c2) => {
          if (timeUp(c2, msg)) return
          switch (c2.first().emoji.name) {
            case '✅': {
              const ch = guild.channels.resolve(users[user.id][m - 1].id)
              if (ch) ch.delete()
              const old = users[user.id].splice(m - 1, 1)
              embed.setTitle('**DiscLists.** - Delete Channel')
                .setDescription('Deleted channel ' + old.name)

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
