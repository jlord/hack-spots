if (!wax) var wax = {};

// A wrapper for reqwest jsonp to easily load TileJSON from a URL.
wax.tilejson = function(url, callback) {
    reqwest({
        url: url + (~url.indexOf('?') ? '&' : '?') + 'callback=?',
        type: 'jsonp',
        success: callback,
        error: callback
    });
};
