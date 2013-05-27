var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;

route.get('/{a}/*', function(req, res) {
	assert.equal(req.params.a, 'a c');
	assert.equal(req.params.wildcard, 'b c/c d');
	assert.equal(req.url, '/a%20c/b%20c/c%20d');
	count++;
});

route({method:'GET', url:'/a%20c/b%20c/c%20d'},res);

assert.equal(count, 1);