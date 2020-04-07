const BotClient = require('./classes/BotClient')
const DataHandler = require('./classes/DataHandler')

const onReady = require('./events/onReady')
const onMessage = require('./events/onMessage')

const dh = new DataHandler()
const bot = new BotClient()

bot.registDataHandler(dh)

bot.registEvent('ready', onReady, bot)
bot.registEvent('message', onMessage)

bot.start()
