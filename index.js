const BotClient = require('./classes/BotClient')
const DataHandler = require('./classes/DataHandler')
const LocaleHandler = require('./classes/LocaleHandler')

const onReady = require('./events/onReady')
// const onMessage = require('./events/onMessage')
const onMember = require('./events/onMember')

const dh = new DataHandler()
const lh = new LocaleHandler()
const bot = new BotClient()

bot.registDataHandler(dh)
bot.locale = lh

bot.registEvent('ready', onReady, bot)
// bot.registEvent('message', onMessage)
bot.registEvent('guildMemberAdd', onMember, bot)

bot.start()
