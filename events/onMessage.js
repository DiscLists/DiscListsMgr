const MsgQuery = require('../classes/MsgQuery')

const startCmd = require('../commands/start')
const quotaCmd = require('../commands/quota')

const createCmd = require('../commands/create')
const updateCmd = require('../commands/update')
const deleteCmd = require('../commands/delete')
const userinfoCmd = require('../commands/userinfo')
const creditsCmd = require('../commands/credits')

module.exports = async (msg) => {
  if (msg.author.bot || !msg.guild) return
  if (!msg.content.startsWith(msg.client.settings.prefix)) return
  if (this.client.settings.devMode && !msg.member.roles.cache.has(msg.client.settings.adminRole)) return // Admin

  const query = new MsgQuery(msg)
  const cmds = new Map([
    ['start', startCmd],
    ['quota', quotaCmd],
    ['create', createCmd],
    ['update', updateCmd],
    ['delete', deleteCmd],
    ['userinfo', userinfoCmd],
    ['credits', creditsCmd]
  ])

  try {
    if (cmds.has(query.cmd)) await cmds.get(query.cmd)(msg, query)
  } catch (err) {
    console.error(err.stack)
    msg.channel.send('Hmm... something might be screwed up.\nPlease report this error message to the staff.\nError message:```\n' + err.message + '\n```')
  }
}
