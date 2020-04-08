const { MessageEmbed } = require('discord.js')
const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query) => {
  const { guild, channel } = msg
  const user = msg.author
  const users = msg.client.data.users

  const embed = new MessageEmbed().setThumbnail(guild.iconURL())

  if (users[user.id].channels.length >= users[user.id].quota) {
    embed.setColor(0xff0000)
      .setTitle('**DiscLists.** - Create Channel Failed')
      .setDescription('Quota exceeded!\nYou have reached the **' + users[user.id].quota + '** channels limit.')

    return await channel.send(embed)
  }

  embed.setColor(0x000000)
    .setTitle('**DiscLists.** - Create Channel')
    .setDescription('Plz choose one of the category below <:_stopwatch20:695945085950361621>')
    .addFields([
      { name: '<:_bots:695946394715815976>', value: 'Bot', inline: true },
      { name: '<:_server:695947468348719124>', value: 'Server', inline: true },
      { name: '<:_general:695947856841801759>', value: 'Chatting', inline: true },
      { name: '<:_broadcasting:695948961361559562>', value: 'Streamer', inline: true }
    ])

  // From here msg changes from user-msg to bot-msg
  msg = await channel.send(embed)

  const validReactions = ['695946394715815976', '695947468348719124', '695947856841801759', '695948961361559562']
  const names = ['Bot', 'Server', 'Chatting', 'Streamer']
  const categorys = ['695879447815127061', '695888549156749312', '695943330416033833', '695943427631874090']
  msg.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', (c) => {
      if (timeUp(c, msg)) return

      // Receive channel name 채널 이름 확인
      embed.setTitle('**DiscLists.** - Create Channel about *' + names[validReactions.indexOf(c.first().emoji.id)] + '*')
        .setDescription('**Please enter your channel name** <:_stopwatch20:695945085950361621>')
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
              .setTitle('**DiscLists.** - Create Channel Failed')
              .setDescription('Channel name cannot exceed 20 characters (including spaces)')

            return msg.edit(embed)
          }

          embed.setTitle('**DiscLists.** - Created Channel')
            .setDescription('I\'ll create channel "' + name + '" about ' + names[validReactions.indexOf(c.first().emoji.id)] + ' for you!')

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
          const m = await ch.send('Here we go! <@' + user.id + '>')
          await m.delete({ timeout: 20000 })
        })
    })

  await msg.react('695946394715815976')
  await msg.react('695947468348719124')
  await msg.react('695947856841801759')
  await msg.react('695948961361559562')
}
