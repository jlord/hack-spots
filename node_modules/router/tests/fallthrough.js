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
route.get('/', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/');
	assert.equal(count, 1);
	count++;
	callback();
});

route.get('/err', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/err');
	count++;
	callback(new Error('/err'));
});
route.get('/err', function(req, res, callback) {
	assert.ok(false);
});

route({method:'GET', url:'/'}, res, function() {
	assert.equal(count, 2);
	count++;
});
route({method:'GET', url:'/err'}, res, function(err) {
	assert.equal(err.message, '/err');
	count++;
});

assert.equal(count, 5);