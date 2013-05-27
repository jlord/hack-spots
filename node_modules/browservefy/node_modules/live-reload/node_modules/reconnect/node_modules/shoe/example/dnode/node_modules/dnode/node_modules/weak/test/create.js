var should = require('should')
  , weak = require('../')

describe('create()', function () {

  afterEach(gc)

  it('should throw on non-"object" values', function () {
    [ 0
    , 0.0
    , true
    , false
    , null
    , undefined
    , 'foo'
    ].forEach(function (val) {
      should.throws(function () {
        weak.create(val)
      })
    })
  })

})
