const { existsSync, writeFileSync, mkdirSync } = require('fs')
const path = require('path')
const _path = path.resolve()

class DataHandler {
  constructor() {
    if (!existsSync(path.join(_path, 'data'))) mkdirSync(path.join(_path, 'data'))
    if (!existsSync(path.join(_path, 'data/users.json'))) writeFileSync(path.join(_path, 'data/users.json'), '{}')

    this.users = require(path.join(_path, '/data/users.json'))
    setInterval(() => writeFileSync(path.join(_path, 'data/users.json'), JSON.stringify(this.users, '\n', 2)), 1000)
  }
}

module.exports = DataHandler
