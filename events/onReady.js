const covidNews = require('../extras/covid-news')

module.exports = (client) => {
  console.log('Ready!')

  covidNews(client.channels.resolve(client.settings.newsChannel))
}
