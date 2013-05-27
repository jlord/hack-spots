var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;

route.get('/', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/');
	count++;
	callback(new Error('/'));
});
route.get('/ok', function(req, res, callback) {
	assert.equal(req.method, 'GET');
	assert.equal(req.url, '/ok');
	count++;
	callback();
});

route({method:'GET', url:'/'}, res, function(err) {
	count++;
	assert.equal(err.message, '/');
});
route({method:'GET', url:'/ok'}, res, function(err) {
	count++;
	assert.equal(err, undefined);
});

assert.equal(count, 4);