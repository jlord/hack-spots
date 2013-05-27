require('should')
var weak = require('../')

describe('Weakref', function () {

  afterEach(gc)

  it('weak() should return a `Weakref` instance', function () {
    var ref = weak({})
    weak.isWeakRef(ref).should.be.true
  })

  it('should proxy named gets to the target', function () {
    var o = { foo: 'bar' }
      , r = weak(o)
    r.should.have.property('foo', 'bar')
  })

  it('should proxy named sets to the target', function () {
    var o = {}
      , r = weak(o)
    r.foo = 'bar'
    o.should.have.property('foo', 'bar')
  })

  it('should proxy named deletes to the target', function () {
    var o = { foo: 'bar' }
     ,  r = weak(o)
    delete r.foo
    o.should.not.have.property('foo')
  })

  it('should proxy indexed gets to the target', function () {
    var a = [ 'foo' ]
      , r = weak(a)
    a.should.have.lengthOf(1)
    r.should.have.lengthOf(1)
    r[0].should.equal('foo')
  })

  it('should proxy indexed sets to the target', function () {
    var a = []
      , r = weak(a)
    a.should.have.lengthOf(0)
    r.should.have.lengthOf(0)
    r[0] = 'foo'
    a.should.have.lengthOf(1)
    a[0].should.equal('foo')
    r.push('bar')
    a.should.have.lengthOf(2)
    a[1].should.equal('bar')
  })

  it('should proxy indexed deletes to the target', function () {
    var a = [ 'foo' ]
      , r = weak(a)
    delete r[0]
    var t = typeof a[0]
    t.should.equal('undefined')
  })

  it('should proxy enumeration', function () {
    var o = { a: 'a', b: 'b', c: 'c', d: 'd' }
      , r = weak(o)
    r.should.have.keys(Object.keys(o))
  })

  it('should act like an empty object after target is gc\'d'
  , function () {
    var o = { foo: 'bar' }
      , r = weak(o)
    o = null
    r.should.have.property('foo', 'bar')
    gc()
    r.should.not.have.property('foo')
    Object.keys(r).should.have.lengthOf(0)
  })

})
