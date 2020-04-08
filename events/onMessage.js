const MsgQuery = require('../classes/MsgQuery')

const startCmd = require('../commands/start')
const quotaCmd = require('../commands/quota')

const createCmd = require('../commands/create')
const updateCmd = require('../commands/update')
const deleteCmd = require('../commands/delete')
const userinfoCmd = require('../commands/userinfo')
const creditsCmd = require('../commands/credits')

module.exports = async (msg) => {
  if(msg.author.bot || !msg.guild) return
  if(!msg.content.startsWith('???')) return
  if(!msg.member.roles.cache.has('695879877890670622')) return // Admin

  const query = new MsgQuery(msg)
  let { user } = msg.member
  const { users } = msg.client.data
  const { channel, guild } = msg

  try{
    switch(query.cmd) {
      case 'start':
        startCmd(msg)
        break

      case 'quota':
        quotaCmd(msg, query)
        break

      case 'create':
        createCmd(null, guild, channel, users, user)
        break

      case 'update':
        updateCmd(null, guild, channel, users, user)
        break

      case 'delete':
        deleteCmd(null, guild, channel, users, user)
        break

      case 'userinfo':
        if(msg.mentions.users.size > 0) user = msg.mentions.users.first()
        userinfoCmd(null, guild, channel, users, user)
        break

      case 'credits':
        creditsCmd(null, guild, channel, users, user)
    }
  } catch (err) {
    console.error(err.stack)
    msg.channel.send('Hmm... something might be screwed up.\nPlease report this error message to the staff.\nError message:```\n' + err.message + '\n```')
  }
}
