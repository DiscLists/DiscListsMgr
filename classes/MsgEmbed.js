const { MessageEmbed } = require('discord.js')

class MsgEmbed extends MessageEmbed {
  constructor (guild) {
    super()
    this.setThumbnail(guild.iconURL()).setColor(0x0)
  }

  setError () {
    this.setColor(0xff0000)
    this.clearFields()
    return this
  }

  clearFields () {
    this.fields = []
    return this
  }
}

module.exports = MsgEmbed
