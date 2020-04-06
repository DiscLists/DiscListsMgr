module.exports = (client) => {
  console.log('Ready!')
  client.user.setActivity('DiscLists', { type: 'WATCHING' })
}
