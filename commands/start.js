const { MessageEmbed } = require('discord.js')

const createCmd = require('./create')
const updateCmd = require('./update')
const deleteCmd = require('./delete')
const userinfoCmd = require('./userinfo')
const creditsCmd = require('./credits')

const { timeUp } = require('../classes/subfunc')

module.exports = async (msg, query, locale) => {
  const { guild } = msg
  const { user } = msg.member
  const { users } = msg.client.data
  const t = msg.client.locale.t

  const embed = new MessageEmbed()
    .setColor(0x000000)
    .setTitle(t('start.title:**DiscLists.** - List Manager', locale))
    .setThumbnail(guild.iconURL())
    .setDescription(t('start.desc:Requested by %1$s\nPlz choose one of the menu below <:_stopwatch20:695945085950361621>\n(Wait until all 5 emojis are reacted)', locale, '<@' + user.id + '>'))
    .addFields([
      { name: '<:_create:695920237530578974>', value: users[user.id].channels.length >= users[user.id].quota ? '~~' + t('start.create:Create', locale) + '~~' : t('start.create:Create', locale), inline: true },
      { name: '<:_update:695918214194003988>', value: users[user.id].channels.length < 1 ? '~~' + t('start.update:Update', locale) + '~~' : t('start.update:Update', locale), inline: true },
      { name: '<:_delete:695917878154887229>', value: users[user.id].channels.length < 1 ? '~~' + t('start.delete:Delete', locale) + '~~' : t('start.delete:Delete', locale), inline: true },
      { name: '<:_infos:695923641291898952>', value: t('start.userinfo:User Infos', locale), inline: true },
      { name: '<:_credits:695925110179102751>', value: t('start.credits:Credits', locale), inline: true }
    ])

  const m = await msg.channel.send(embed)

  await m.react('695920237530578974')
  await m.react('695918214194003988')
  await m.react('695917878154887229')
  await m.react('695923641291898952')
  await m.react('695925110179102751')

  const validReactions = ['695920237530578974', '695918214194003988', '695917878154887229', '695923641291898952', '695925110179102751']

  m.createReactionCollector((r, u) => validReactions.includes(r.emoji.id) && u.id === user.id, { max: 1, time: 20000 })
    .on('end', async (c) => {
      if (timeUp(c, m)) return
      await m.delete()
      await [createCmd, updateCmd, deleteCmd, userinfoCmd, creditsCmd][validReactions.indexOf(c.first().emoji.id)](msg, query, locale)
    })
}
