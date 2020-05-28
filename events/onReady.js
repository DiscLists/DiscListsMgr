const covidNews = require('../extras/covid-news')

module.exports = (client) => {
  console.log('Bot logged in as ' + client.user.tag)

  if (client.settings.news.enable) {
    console.log('COVID-19 News Handler started.')
    covidNews(client.channels.resolve(client.settings.newsChannel))
  } else console.log('COVID-19 News Handler is disabled.')
}
