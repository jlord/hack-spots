
var h = require('h')

module.exports = function (emitter) {
  var style = {}
  var el = h('a', {href: '#', style: style, click: emitter.disconnect})
  var int
  emitter.on('reconnect', function (n, d) {
    var delay = Math.round(d / 1000) + 1
    console.log(n, d)
    el.innerText = 'reconnect in ' + delay
    clearInterval(int)
    int = setInterval(function () {
      el.innerText = delay ? 'reconnect in ' + --delay : 'reconnecting...'
    }, 1e3)
  })
  emitter.on('connect',   function () {
    el.innerText = 'connected'
    clearInterval(int)
  })
  return el
}
