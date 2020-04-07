const filter = '[시|씨|\^\^ㅣ|\^\^l|\^ㅣ|\^l][0-9]{0,3}발[^점]*|'
  + 'tlqkf|'

  + '[ㅅ|ㅆ|\^|\^\^]ㅂ|'
  + 'tq|'

  + '병[0-9]{0,3}신|'
  + 'qudtls|'

  + 'ㅂ[ㅅ|\^]|'
  + 'qt'
const regex = new RegExp(filter, 'i')
console.log(regex)
module.exports = (str) => {
  const result = regex.exec(str)
  if(result) return { result: true, word: result[0] }
  else return { result: false }
}
