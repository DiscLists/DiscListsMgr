module.exports = (msg) => {
  const vaildCategorys = ['695943330416033833']
  if (!vaildCategorys.includes(msg.channel.parentID)) return

  msg.channel.setPosition(0)
}
