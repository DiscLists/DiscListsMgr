const { Client } = require('discord.js')

class BotClient extends Client {
  start () {
    this.login(process.env.DLMToken)
  }

  registDataHandler (dh) {
    this.data = dh
  }

  registEvent (type, fn, ...args) {
    this.on(type, (...args2) => fn(...args2, ...args))
  }
}

module.exports = BotClient
