var matcher = require('./matcher');
var formatter = require('./formatter');

var METHODS      = ['get', 'post', 'put', 'del'   , 'delete', 'head', 'options'];
var HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'DELETE', 'HEAD', 'OPTIONS'];

var noop = function() {};
var error = function(res) {
	return function() {
		res.statusCode = 404;
		res.end();
	};
};
var router = function() {
	var methods = {};
	var traps = {};

	HTTP_METHODS.forEach(function(method) {
		methods[method] = [];
	});

	var route = function(req, res, next) {
		var method = methods[req.method];
		var trap = traps[req.method];
		var index = req.url.indexOf('?');
		var url = index === -1 ? req.url : req.url.substr(0, index);
		var i = 0;

		next = next || error(res);
		if (!method) return next();

		var loop = function(err) {
			if (err) return next(err);
			while (i < method.length) {
				var route = method[i];

				i++;
				req.params = route.pattern(url);
				if (!req.params) continue;
				if (route.rewrite) {
					req.url = url = route.rewrite(req.params)+(index === -1 ? '' : req.url.substr(index));
				}
				route.fn(req, res, loop);
				return;
			}
			if (!trap) return next();
			trap(req, res, next);
		};

		loop();
	};

	METHODS.forEach(function(method, i) {
		route[method] = function(pattern, rewrite, fn) {
			if (Array.isArray(pattern)) {
				pattern.forEach(function(item) {
					route[method](item, rewrite, fn);
				});
				return;
			}

			if (!fn && !rewrite)                      return route[method](null, null, pattern);
			if (!fn && typeof rewrite === 'string')   return route[method](pattern, rewrite, route);
			if (!fn && typeof rewrite === 'function') return route[method](pattern, null, rewrite);
			if (!fn) return route;

			(route.onmount || noop)(pattern, rewrite, fn);

			if (!pattern) {
				traps[HTTP_METHODS[i]] = fn;
				return route;
			}

			methods[HTTP_METHODS[i]].push({
				pattern:matcher(pattern),
				rewrite:formatter(rewrite),
				fn:fn
			});
			return route;
		};
	});
	route.all = function(pattern, rewrite, fn) {
		METHODS.forEach(function(method) {
			route[method](pattern, rewrite, fn);
		});
		return route;
	};

	return route;
};

module.exports = router;