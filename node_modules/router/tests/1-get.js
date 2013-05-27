var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;

route.get('/', function(req, res) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/');
	count++;
});

route({method:'GET', url:'/'},res);
route({method:'NOT_GET', url:'/'},res);

assert.equal(count, 1);