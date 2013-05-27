var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;
var a = 0;

route.get('/', function() {
	a++;
});
route.get(function(req, res) {
	assert.equal(req.method, 'GET');
	assert.notEqual(req.url, '/');
	count++;
});

route({method:'GET', url:'/'},res);
route({method:'GET', url:'/?query'},res);
route({method:'GET', url:'/a'},res);
route({method:'GET', url:'/abe'},res);
route({method:'GET', url:'/abefest'},res);
route({method:'NOT_GET', url:'/'},res);

assert.equal(count, 3);
assert.equal(a, 2);