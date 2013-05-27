var dns = require('dns')

module.exports = hasInternet

function hasInternet(cb) {
	if (process.browser) return cb(false, navigator.onLine) 

	dns.lookup('www.google.com', function(err, addresses) {
	  if (err) return cb(err, false) // an error, no www
	  return cb(false, true) // no error, has www
	})
}