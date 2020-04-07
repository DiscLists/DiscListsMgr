const startCommand = require('../commands/start')
const quotaCmd = require('../commands/quota')

module.exports = async (msg) => {
  if (msg.author.bot || !msg.guild) return

  if (msg.content === '?start') {
    // const m = await msg.channel.send('<:_task:695918989813219348> **Wait for task is done...**')
    try {
      startCommand(msg)
    } catch (err) {
      console.error(err.stack)
      msg.channel.send('Hmm... something might be screwed up.\nPlease report this error message to the staff.\nError message:```\n' + err.message + '\n```')
    }
  }

  if (msg.content.startsWith('?quota')) quotaCmd(msg)
}
