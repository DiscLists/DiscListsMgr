const { Client } = require('discord.js')

class BotClient extends Client {
  constructor () {
    super()

    const settings = require('../settings.json')
    if (!settings.prefix) settings.prefix = '?'
    if (!settings.devMode) settings.devMode = false
    if (!settings.adminRole) settings.adminRole = []
    if (!settings.news) settings.news = { enable: false, channel: "" }
    this.settings = settings
  }

  start () {
    this.login(process.env.DLMToken || this.settings.token)
  }

  registDataHandler (dh) {
    this.data = dh
  }

  registEvent (type, fn, ...args) {
    this.on(type, (...args2) => fn(...args2, ...args))
  }
}

module.exports = BotClient
