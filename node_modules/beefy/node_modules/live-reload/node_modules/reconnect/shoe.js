
var shoe = require('shoe')

module.exports = require('./inject')(function (){ 
  var args = [].slice.call(arguments)
  return shoe.apply(null, args)
})
