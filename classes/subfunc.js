// SubFunctions ------------------

/**
 * @param {import('discord.js').Collection} c
 * @param {import('discord.js').Message} msg
 */
exports.timeUp = (c, msg) => {
  if (msg.deleted) return
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

/**
 * @param {import('discord.js').Message} msg
 * @param {import('discord.js').User} user
 */
exports.checkTier = (guild, user) => {
  let tier = 'Not Registered'
  const r = guild.members.resolve(user.id).roles

  const roles = [
    '696336801836695587', '696336655430320181', '696336655170142268', '696336249828540426', '696336248947605525', '696336248150687795', '695879877890670622',
    '697806638320582744', '697806638320582745', '697806638362656868', '697806638362656869', '697806638362656870', '697806638362656871', '697806638362656874'
  ]

  roles.forEach((v) => {
    if (r.cache.has(v)) tier = '<@&' + v + '>'
  })

  return tier
}
