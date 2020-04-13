const MsgQuery = require('../classes/MsgQuery')

const startCmd = require('../commands/start')
const quotaCmd = require('../commands/quota')

const createCmd = require('../commands/create')
const updateCmd = require('../commands/update')
const deleteCmd = require('../commands/delete')
const userinfoCmd = require('../commands/userinfo')
const creditsCmd = require('../commands/credits')

const covidCmd = require('../extras/covid')

module.exports = async (msg) => {
  if (msg.author.bot || !msg.guild) return
  if (!msg.content.startsWith(msg.client.settings.prefix)) return
  if (msg.client.settings.devMode && !msg.member.roles.cache.has(msg.client.settings.adminRole)) return // Admin

  if (!msg.client.data.users[msg.guild.id]) msg.client.data.users[msg.guild.id] = {}
  if (!msg.client.data.users[msg.guild.id][msg.author.id]) msg.client.data.users[msg.guild.id][msg.author.id] = { quota: 2, channels: [] }

  const query = new MsgQuery(msg)
  const cmds = new Map([
    ['start', { cmd: startCmd, locale: 'en_US' }],
    ['quota', { cmd: quotaCmd, locale: 'en_US' }],
    ['create', { cmd: createCmd, locale: 'en_US' }],
    ['update', { cmd: updateCmd, locale: 'en_US' }],
    ['delete', { cmd: deleteCmd, locale: 'en_US' }],
    ['userinfo', { cmd: userinfoCmd, locale: 'en_US' }],
    ['credits', { cmd: creditsCmd, locale: 'en_US' }],

    ['covid', { cmd: covidCmd, locale: 'en_US' }],

    ['시작', { cmd: startCmd, locale: 'ko_KR' }],
    ['사용량', { cmd: quotaCmd, locale: 'ko_KR' }],
    ['생성', { cmd: createCmd, locale: 'ko_KR' }],
    ['수정', { cmd: updateCmd, locale: 'ko_KR' }],
    ['삭제', { cmd: deleteCmd, locale: 'ko_KR' }],
    ['유저정보', { cmd: userinfoCmd, locale: 'ko_KR' }],
    ['제작자', { cmd: creditsCmd, locale: 'ko_KR' }],

    ['코로나', { cmd: covidCmd, locale: 'ko_KR' }]
  ])

  try {
    if (cmds.has(query.cmd)) await cmds.get(query.cmd).cmd(msg, query, cmds.get(query.cmd).locale)
  } catch (err) {
    console.error(err.stack)
    msg.channel.send('Hmm... something might be screwed up.\nPlease report this error message to the staff.\n흠... 뭔가 안에서 꼬였나 보네요.\n아래 에러 메세지를 스태프에게 알려주세요.\nError message (에러 메세지):```\n' + err.message + '\n```')
  }
}
