const i18n = require('i18n')

class LocaleHandler {
  constructor() {
    i18n.configure({
      defaultLocale: 'en_US',
      directory: './locale',
      autoReload: true,
      updateFiles: true,
      syncFiles: true,
      indent: '  ',
      objectNotation: true
    })

    this.i18n = i18n
    this.t = (phrase, locale, ...args) => i18n.__({ phrase, locale }, ...args)
  }
}

module.exports = LocaleHandler
