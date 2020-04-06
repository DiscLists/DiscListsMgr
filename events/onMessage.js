const startCommand = require('../commands/start')

module.exports = async (msg) => {
  if (!msg.author.bot && msg.content === '?start') {
    //const m = await msg.channel.send('<:_task:695918989813219348> **Wait for task is done...**')
    startCommand(msg)
  }
}
