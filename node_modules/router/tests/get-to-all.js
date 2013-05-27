var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;

route.get('/', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/');
	assert.equal(count, 0);
	count++;
	callback();
});
route.all('/', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/');
	assert.equal(count, 1);
	count++;
	callback();
});

route({method:'GET', url:'/'}, res, function() {
	assert.equal(count, 2);
	count++;
});

assert.equal(count, 3);