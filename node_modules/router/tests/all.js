var assert = require('assert');
var route = require('../index')();

var res = {end:function() {}};
var count = 0;
var order = ['GET','POST','OPTIONS','HEAD','DELETE','PUT'];

route.all('/', function(req, res) {
	assert.equal(req.method, order[count]);
	assert.equal(req.url, '/');
	count++;
});

route({method:'GET', url:'/'},res);
route({method:'POST', url:'/'},res);
route({method:'OPTIONS', url:'/'},res);
route({method:'HEAD', url:'/'},res);
route({method:'DELETE', url:'/'},res);
route({method:'PUT', url:'/'},res);

route({method:'GET', url:'/a'},res);
route({method:'POST', url:'/a'},res);
route({method:'OPTIONS', url:'/a'},res);
route({method:'HEAD', url:'/a'},res);
route({method:'DELETE', url:'/a'},res);
route({method:'PUT', url:'/a'},res);

route({method:'NOT_GET', url:'/'},res);

assert.equal(count, 6);