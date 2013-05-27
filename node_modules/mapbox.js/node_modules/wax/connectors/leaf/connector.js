wax = wax || {};
wax.leaf = wax.leaf || {};

wax.leaf.connector = L.TileLayer.extend({
    initialize: function(options) {
        options = options || {};
        options.minZoom = options.minzoom || 0;
        options.maxZoom = options.maxzoom || 22;
        L.TileLayer.prototype.initialize.call(this, options.tiles[0], options);
    }
});
