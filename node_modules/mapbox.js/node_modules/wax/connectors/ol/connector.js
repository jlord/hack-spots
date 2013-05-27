;var wax = wax || {};
wax.ol = wax.ol || {};

wax.ol.connector = function(tilejson) {
    for (var i = 0; i < tilejson.tiles.length; i++) {
        tilejson.tiles[i] = tilejson.tiles[i]
            .replace('{z}', '${z}')
            .replace('{x}', '${x}')
            .replace('{y}', '${y}');
    }
    var l = new OpenLayers.Layer.XYZ(
        tilejson.name,
        tilejson.tiles, {
            sphericalMercator: true,
            zoomOffset: tilejson.minzoom,
            numZoomLevels: 1 + tilejson.maxzoom - tilejson.minzoom,
            attribution: tilejson.attribution
        });
    l.CLASS_NAME = 'Wax.Layer';
    return l;
};
