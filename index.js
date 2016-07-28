module.exports = function(state) {
  console.log('STATE', JSON.stringify(state))
  if (typeof window !== 'undefined') {
    console.log('PATH', window.location.href)
  }
}
