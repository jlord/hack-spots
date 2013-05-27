require('should')
var weak = require('../')

function checkFunction (prop) {
  it('should have a function "' + prop + '"', function () {
    weak.should.have.property(prop)
    weak[prop].should.be.a('function')
  })
}

describe('exports', function () {

  afterEach(gc)

  it('should be a function', function () {
    weak.should.be.a('function')
  })

  checkFunction('get')
  checkFunction('create')
  checkFunction('isWeakRef')
  checkFunction('isNearDeath')
  checkFunction('isDead')
  checkFunction('callbacks')
  checkFunction('addCallback')

  it('should be a circular reference to "create"', function () {
    weak.should.equal(weak.create)
  })

})
