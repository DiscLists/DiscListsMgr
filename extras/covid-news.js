const path = require('path').resolve()
const { get } = require('superagent')
const { validate, parse } = require('fast-xml-parser')
const { MessageEmbed } = require('discord.js')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { AllHtmlEntities } = require('html-entities')

const htmlParser = new AllHtmlEntities().decode

const colors = ['FFD700', 'FFC0CB', '4CA3DD']

if (!existsSync(path + '/data/newsCount')) writeFileSync(path + '/data/newsCount', '0')

module.exports = (channel) => {
  let latest
  let no = parseInt(readFileSync(path + '/data/newsCount').toString())

  setInterval(() => {
    writeFileSync(path + '/data/newsCount', no)
  }, 1000)

  setInterval(() => {
    get('http://newssearch.naver.com/search.naver?where=rss&query=' + encodeURI('코로나19'))
      .then((res) => {
        if (typeof validate(res.text) === 'object') return

        let data = parse(res.text)
        if (!latest) { latest = data.rss.channel.lastBuildDate; return }
        if (latest !== data.rss.channel.lastBuildDate) {
          no++
          latest = data.rss.channel.lastBuildDate
          data = data.rss.channel.item[0]

          const embed = new MessageEmbed({ title: 'DiscLists Covid-19 News #' + no, color: '#' + colors[Math.floor(Math.random() * colors.length)] })
            .addFields([{ name: htmlParser(data.title), value: htmlParser(data.description) }])
            .setTimestamp(new Date(data.pubDate))
            .setFooter('[' + data.category + '] ' + data.author)

          if (validURL(data.link)) embed.setURL(data.link)

          channel.send(embed)
        }
      })
  }, 1000)
}

function validURL (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

  return !!pattern.test(str)
}
