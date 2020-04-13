const { MessageEmbed } = require('discord.js')
const superagent = require('superagent')
const cheerio = require('cheerio')

module.exports = (msg, query, locale) => {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURI('코로나19')

  superagent // 모듈을 사용한다
    .get(url) // 네이버에서 사이트를 읽어온다
    .then((data) => { // 읽어오고 나서 data에 읽어온 값을 저장한다
      const cheer = cheerio.load(data.text) // 데이터를 cheerio에 등록시킨다
      const view = cheer('.graph_view>.box>.circle.red.level5>.txt>.num')[0].children[0]
      const view2 = cheer('.graph_view>.box.bottom>.circle.blue.level4>.txt>.num')[0].children[0]
      const view3 = cheer('.graph_view>.box>.circle.orange.level5>.txt>.num')[0].children[0]
      const view4 = cheer('.graph_view>.box.bottom>.circle.black.level3>.txt>.num')[0].children[0]

      const set = '2019년 12월 중국 우한에서 처음 발생한 뒤 전 세계로 확산된, 새로운 유형의 코로나바이러스에 의한 호흡기 감염질환.'
      const set2 = '발열 또는 호흡기 증상(기침, 인후통)'
      const set3 = '중국 방문 시 현지 동물(가금류 포함)과의 접촉을 피하고 전통시장 및 불필요한 의료기관 방문자제, 호흡기 증상자와의 접촉을 피하기'
      const set4 = '가까운 선별 진료소, 관할 보건소, 지역콜센터120, 콜센터 1339'

      const set5 = '확진 환자 : ' + view.data + '명\n' + '격리 해제 : ' + view2.data + '명\n' + '검사 진행 : ' + view3.data + '명\n' + '사망자 : ' + view4.data + '명'

      const embed = new MessageEmbed({ title: 'DiscLists Naver Covid-19', color: 0x000000 })
        .setURL(url)
        .addFields([
          { name: '코로나19의 정의', value: set },
          { name: '코로나19의 주요 증상', value: set2 },
          { name: '코로나19 주의 사항', value: set3 },
          { name: '긴급 연락처', value: set4 },
          { name: '코로나19 현재 통계', value: set5 }
        ])
      msg.channel.send(embed)
    })
}
