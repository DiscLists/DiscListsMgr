module.exports = (msg, query, locale) => {
  if (!msg.member.roles.cache.has(msg.client.settings.adminRole)) return

  const { guild } = msg
  const { users } = msg.client.data
  const user = msg.mentions.users.first()
  const args = query.args
  const cmd = args.shift()

  const { t } = msg.client.locale

  if (!user) return
  if (!users[guild.id][user.id]) return msg.channel.send(t('quota.notRegistered:Not registered', locale))

  switch (cmd) {
    case '수정':
    case 'edit': {
      const d = parseInt(args[args.length - 1])
      if (isNaN(d)) return
      users[guild.id][user.id].quota += d
      console.log('[Quota] Edited ' + user.tag + (d >= 0 ? ' + ' : ' - ') + d + ' = ' + users[guild.id][user.id].quota)
      msg.channel.send(t('quota.edit:Modified ticket count for %1$s (%2$s, Total %3$s)', locale, '<@' + user.id + '>', d, users[guild.id][user.id].quota))
      break
    }

    case '설정':
    case 'set': {
      const d = parseInt(args[args.length - 1])
      if (isNaN(d)) return
      users[guild.id][user.id].quota = d
      console.log('[Quota] Set ' + user.tag + ' = ' + users[guild.id][user.id].quota)
      msg.channel.send(t('quota.set:Set ticket count for %1$s (Total %2$s)', locale, '<@' + user.id + '>', users[guild.id][user.id].quota))
    }
  }
}
