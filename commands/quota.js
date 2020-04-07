module.exports = (msg, query) => {
  if (!msg.member.roles.cache.has('695879877890670622')) return

  const { users } = msg.client.data
  const user = msg.mentions.users.first()
  const args = query.args
  const cmd = args.shift()

  if (!user) return
  if (!users[user.id]) return msg.channel.send('Not registered')

  switch (cmd) {
    case 'edit': {
      const d = parseInt(args[args.length - 1])
      if (isNaN(d)) return
      users[user.id].quota += d
      console.log('[Quota] Edited ' + user.tag + (d >= 0 ? ' + ' : ' - ') + d + ' = ' + users[user.id].quota)
      msg.channel.send('Modified channel limit for <@' + user.id + '> (' + d + ', Total ' + users[user.id].quota + ')')
      break
    }

    case 'set': {
      const d = parseInt(args[args.length - 1])
      if (isNaN(d)) return
      users[user.id].quota = d
      console.log('[Quota] Set ' + user.tag + ' = ' + users[user.id].quota)
      msg.channel.send('Set channel limit for <@' + user.id + '> (Total ' + users[user.id].quota + ')')
    }
  }
}
