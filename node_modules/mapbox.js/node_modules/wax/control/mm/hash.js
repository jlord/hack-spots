wax = wax || {};
wax.mm = wax.mm || {};

wax.mm.hash = function() {
    var map;
    var hash = wax.hash({
        getCenterZoom: function() {
            var center = map.getCenter(),
                zoom = map.getZoom(),
                precision = Math.max(
                    0,
                    Math.ceil(Math.log(zoom) / Math.LN2));

            return [zoom.toFixed(2),
                center.lat.toFixed(precision),
                center.lon.toFixed(precision)
            ].join('/');
        },
        setCenterZoom: function setCenterZoom(args) {
            map.setCenterZoom(
                new MM.Location(args[1], args[2]),
                args[0]);
        },
        bindChange: function(fn) {
            map.addCallback('drawn', fn);
        },
        unbindChange: function(fn) {
            map.removeCallback('drawn', fn);
        }
    });

    hash.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return hash;
    };

    return hash;
};
