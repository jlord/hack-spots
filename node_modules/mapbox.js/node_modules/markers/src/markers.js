mapbox.markers.layer = function() {

    var m = {},
        // external list of geojson features
        features = [],
        // internal list of markers
        markers = [],
        // internal list of callbacks
        callbackManager = new MM.CallbackManager(m, ['drawn', 'markeradded']),
        // the absolute position of the parent element
        position = null,
        // a factory function for creating DOM elements out of
        // GeoJSON objects
        factory = mapbox.markers.simplestyle_factory,
        // a sorter function for sorting GeoJSON objects
        // in the DOM
        sorter = function(a, b) {
            return b.geometry.coordinates[1] -
              a.geometry.coordinates[1];
        },
        // a list of urls from which features can be loaded.
        // these can be templated with {z}, {x}, and {y}
        urls,
        // map bounds
        left = null,
        right = null,
        // a function that filters points
        filter = function() {
            return true;
        },
        _seq = 0,
        keyfn = function() {
            return ++_seq;
        },
        index = {};

    // The parent DOM element
    m.parent = document.createElement('div');
    m.parent.style.cssText = 'position: absolute; top: 0px;' +
        'left:0px; width:100%; height:100%; margin:0; padding:0; z-index:0;pointer-events:none;';
    m.name = 'markers';

    // reposition a single marker element
    function reposition(marker) {
        // remember the tile coordinate so we don't have to reproject every time
        if (!marker.coord) marker.coord = m.map.locationCoordinate(marker.location);
        var pos = m.map.coordinatePoint(marker.coord);
        var pos_loc, new_pos;

        // If this point has wound around the world, adjust its position
        // to the new, onscreen location
        if (pos.x < 0) {
            pos_loc = new MM.Location(marker.location.lat, marker.location.lon);
            pos_loc.lon += Math.ceil((left.lon - marker.location.lon) / 360) * 360;
            new_pos = m.map.locationPoint(pos_loc);
            if (new_pos.x < m.map.dimensions.x) {
                pos = new_pos;
                marker.coord = m.map.locationCoordinate(pos_loc);
            }
        } else if (pos.x > m.map.dimensions.x) {
            pos_loc = new MM.Location(marker.location.lat, marker.location.lon);
            pos_loc.lon -= Math.ceil((marker.location.lon - right.lon) / 360) * 360;
            new_pos = m.map.locationPoint(pos_loc);
            if (new_pos.x > 0) {
                pos = new_pos;
                marker.coord = m.map.locationCoordinate(pos_loc);
            }
        }

        pos.scale = 1;
        pos.width = pos.height = 0;
        MM.moveElement(marker.element, pos);
    }

    // Adding and removing callbacks is mainly a way to enable mmg_interaction to operate.
    // I think there are better ways to do this, by, for instance, having mmg be able to
    // register 'binders' to markers, but this is backwards-compatible and equivalent
    // externally.
    m.addCallback = function(event, callback) {
        callbackManager.addCallback(event, callback);
        return m;
    };

    m.removeCallback = function(event, callback) {
        callbackManager.removeCallback(event, callback);
        return m;
    };

    // Draw this layer - reposition all markers on the div. This requires
    // the markers library to be attached to a map, and will noop otherwise.
    m.draw = function() {
        if (!m.map) return;
        left = m.map.pointLocation(new MM.Point(0, 0));
        right = m.map.pointLocation(new MM.Point(m.map.dimensions.x, 0));
        callbackManager.dispatchCallback('drawn', m);
        for (var i = 0; i < markers.length; i++) {
            reposition(markers[i]);
        }
    };

    // Add a fully-formed marker to the layer. This fires a `markeradded` event.
    // This does not require the map element t be attached.
    m.add = function(marker) {
        if (!marker || !marker.element) return null;
        m.parent.appendChild(marker.element);
        markers.push(marker);
        callbackManager.dispatchCallback('markeradded', marker);
        return marker;
    };

    // Remove a fully-formed marker - which must be the same exact marker
    // object as in the markers array - from the layer.
    m.remove = function(marker) {
        if (!marker) return null;
        m.parent.removeChild(marker.element);
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] === marker) {
                markers.splice(i, 1);
                return marker;
            }
        }
        return marker;
    };

    m.markers = function(x) {
        if (!arguments.length) return markers;
    };

    // Add a GeoJSON feature to the markers layer.
    m.add_feature = function(x) {
        return m.features(m.features().concat([x]));
    };

    m.sort = function(x) {
        if (!arguments.length) return sorter;
        sorter = x;
        return m;
    };

    // Public data interface
    m.features = function(x) {
        // Return features
        if (!arguments.length) return features;

        // Set features
        if (!x) x = [];
        features = x.slice();

        features.sort(sorter);

        for (var j = 0; j < markers.length; j++) {
            markers[j].touch = false;
        }

        for (var i = 0; i < features.length; i++) {
            if (filter(features[i])) {
                var id = keyfn(features[i]);
                if (index[id]) {
                    // marker is already on the map, needs to be moved or rebuilt
                    index[id].location = new MM.Location(
                        features[i].geometry.coordinates[1],
                        features[i].geometry.coordinates[0]);
                    index[id].coord = null;
                    reposition(index[id]);
                } else {
                    // marker needs to be added to the map
                    index[id] = m.add({
                        element: factory(features[i]),
                        location: new MM.Location(
                            features[i].geometry.coordinates[1],
                            features[i].geometry.coordinates[0]),
                        data: features[i]
                    });
                }
                if (index[id]) index[id].touch = true;
            }
        }

        for (var k = markers.length - 1; k >= 0; k--) {
            if (markers[k].touch === false) {
                m.remove(markers[k]);
            }
        }

        if (m.map && m.map.coordinate) m.map.draw();

        return m;
    };

    // Request features from a URL - either a local URL or a JSONP call.
    // Expects GeoJSON-formatted features.
    m.url = function(x, callback) {
        if (!arguments.length) return urls;
        if (typeof reqwest === 'undefined') throw 'reqwest is required for url loading';
        if (typeof x === 'string') x = [x];

        urls = x;
        function add_features(err, x) {
            if (err && callback) return callback(err);
            var features = typeof x !== 'undefined' && x.features ? x.features : null;
            if (features) m.features(features);
            if (callback) callback(err, features, m);
        }

        reqwest((urls[0].match(/geojsonp$/)) ? {
            url: urls[0] + (~urls[0].indexOf('?') ? '&' : '?') + 'callback=?',
            type: 'jsonp',
            success: function(resp) { add_features(null, resp); },
            error: add_features
        } : {
            url: urls[0],
            type: 'json',
            success: function(resp) { add_features(null, resp); },
            error: add_features
        });
        return m;
    };

    m.id = function(x, callback) {
        return m.url('http://a.tiles.mapbox.com/v3/' + x + '/markers.geojsonp', callback);
    };

    m.csv = function(x) {
        return m.features(mapbox.markers.csv_to_geojson(x));
    };

    m.extent = function() {
        var ext = [{
            lat: Infinity,
            lon: Infinity
        }, {
            lat: -Infinity,
            lon: -Infinity
        }];
        var ft = m.features();
        for (var i = 0; i < ft.length; i++) {
            var coords = ft[i].geometry.coordinates;
            if (coords[0] < ext[0].lon) ext[0].lon = coords[0];
            if (coords[1] < ext[0].lat) ext[0].lat = coords[1];
            if (coords[0] > ext[1].lon) ext[1].lon = coords[0];
            if (coords[1] > ext[1].lat) ext[1].lat = coords[1];
        }
        return ext;
    };

    m.key = function(x) {
        if (!arguments.length) return keyfn;
        if (x === null) {
            keyfn = function() { return ++_seq; };
        } else {
            keyfn = x;
        }
        return m;
    };

    // Factory interface
    m.factory = function(x) {
        if (!arguments.length) return factory;
        factory = x;
        // re-render all features
        m.features(m.features());
        return m;
    };

    m.filter = function(x) {
        if (!arguments.length) return filter;
        filter = x;
        // Setting a filter re-sets the features into a new array.
        // This does _not_ change the actual output of .features()
        m.features(m.features());
        return m;
    };

    m.destroy = function() {
        if (m.parent.parentNode) {
            m.parent.parentNode.removeChild(m.parent);
        }
    };

    // Get or set this layer's name
    m.named = function(x) {
        if (!arguments.length) return m.name;
        m.name = x;
        return m;
    };

    m.enabled = true;

    m.enable = function() {
        this.enabled = true;
        this.parent.style.display = '';
        return m;
    };

    m.disable = function() {
        this.enabled = false;
        this.parent.style.display = 'none';
        return m;
    };

    return m;
};

mmg = mapbox.markers.layer; // Backwards compatibility
