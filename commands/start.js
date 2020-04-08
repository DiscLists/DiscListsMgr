const { MessageEmbed } = require('discord.js')

const createCmd = require('./create')
const updateCmd = require('./update')
const deleteCmd = require('./delete')
const userinfoCmd = require('./userinfo')
const creditsCmd = require('./credits')

const { timeUp } = require('../classes/subfunc') 

module.exports = async (msg) => {
  const { guild } = msg
  const { user } = msg.member
  const { users } = msg.client.data

  if (!users[user.id]) users[user.id] = { quota: 2, channels: [] }

  const embed = new MessageEmbed()
    .setColor(0x000000)
    .setTitle('**DiscLists.** - List Manager')
    .setThumbnail(guild.iconURL())
    .setDescription('Requested by <@' + user.id + '>\nPlz choose one of the menu below <:_stopwatch20:695945085950361621>')
    .addFields([
      { name: '<:_create:695920237530578974>', value: users[user.id].channels.length >= users[user.id].quota ? '~~Create~~' : 'Create', inline: true },
      { name: '<:_update:695918214194003988>', value: users[user.id].channels.length < 1 ? '~~Update~~' : 'Update', inline: true },
      { name: '<:_delete:695917878154887229>', value: users[user.id].channels.length < 1 ? '~~Delete~~' : 'Delete', inline: true },
      { name: '<:_infos:695923641291898952>', value: 'User Infos', inline: true },
      { name: '<:_credits:695925110179102751>', value: 'Credits', inline: true }
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
      [createCmd, updateCmd, deleteCmd, userinfoCmd, creditsCmd][validReactions.indexOf(c.first().emoji.id)](m, guild, msg.channel, users, user)
    })
}

