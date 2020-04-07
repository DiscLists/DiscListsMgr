const MsgQuery = require('../classes/MsgQuery')

const startCmd = require('../commands/start')
const quotaCmd = require('../commands/quota')

module.exports = async (msg) => {
  if(msg.author.bot || !msg.guild) return

  const query = new MsgQuery(msg)

  try{
    switch(query.cmd) {
      case 'start':
        startCmd(msg)
        break

      case 'quota':
        quotaCmd(msg, query)
    }
  } catch (err) {
    console.error(err.stack)
    msg.channel.send('Hmm... something might be screwed up.\nPlease report this error message to the staff.\nError message:```\n' + err.message + '\n```')
  }
}
