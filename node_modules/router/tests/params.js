var assert = require('assert');
var route = require('../index')();

var count = 0;

route.get('/{test}', function(req, res) {
	assert.equal(req.params.test, 'ok')
	assert.ok(req.url in {'/ok':1, '/ok/':1});
	count++;
});
route.get('/{a}/{b}', function(req, res) {
	assert.equal(req.params.a, 'a-ok');
	assert.equal(req.params.b, 'b-ok');
	assert.equal(req.url, '/a-ok/b-ok');
	count++;
});
route.get('/{a}/*', function(req, res) {
	assert.equal(req.params.a, 'a');
	assert.equal(req.params.wildcard, 'b/c');
	assert.equal(req.url, '/a/b/c');
	count++;
});

route({method:'GET', url:'/ok'});
route({method:'GET', url:'/ok/'});
route({method:'GET', url:'/a-ok/b-ok'});
route({method:'GET', url:'/a/b/c'});

assert.equal(count, 4);