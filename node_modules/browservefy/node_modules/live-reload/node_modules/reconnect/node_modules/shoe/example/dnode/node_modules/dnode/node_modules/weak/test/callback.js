require('should')
var weak = require('../')

describe('weak()', function () {

  afterEach(gc)

  describe('garbage collection callback', function () {

    it('should accept a function as second argument', function () {
      var r = weak({}, function () {})
      weak.callbacks(r).should.have.lengthOf(1)
    })

    it('should invoke the callback before the target is gc\'d', function () {
      var called = false
      weak({}, function () {
        called = true
      })
      called.should.equal.false
      gc()
      called.should.equal.true
    })

    it('should pass the target in as the first argument', function () {
      weak({ foo: 'bar' }, function (o) {
        o.should.have.property('foo', 'bar')
      })
      gc()
    })

    it('should invoke *all* callbacks in the internal "callback" Array'
    , function () {
      var r = weak({})
        , called1 = false
        , called2 = false
      weak.addCallback(r, function () {
        called1 = true
      })
      weak.addCallback(r, function () {
        called2 = true
      })
      gc()
      called1.should.equal.true
      called2.should.equal.true
    })

  })
})

describe('callbacks()', function () {

  it('should return the Weakref\'s internal "callback" Array', function () {
    var r = weak({})
      , callbacks = weak.callbacks(r)
    callbacks.should.be.instanceof(Array)
    callbacks.should.have.lengthOf(0)
  })

})
