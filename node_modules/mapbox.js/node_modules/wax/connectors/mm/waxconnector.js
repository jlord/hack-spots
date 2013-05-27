var wax = wax || {};
wax.mm = wax.mm || {};

// A layer connector for Modest Maps conformant to TileJSON
// https://github.com/mapbox/tilejson
wax.mm._provider = function(options) {
    this.options = {
        tiles: options.tiles,
        scheme: options.scheme || 'xyz',
        minzoom: options.minzoom || 0,
        maxzoom: options.maxzoom || 22,
        bounds: options.bounds || [-180, -90, 180, 90]
    };
};

wax.mm._provider.prototype = {
    outerLimits: function() {
        return [
            this.locationCoordinate(
                new MM.Location(
                    this.options.bounds[0],
                    this.options.bounds[1])).zoomTo(this.options.minzoom),
            this.locationCoordinate(
                new MM.Location(
                    this.options.bounds[2],
                    this.options.bounds[3])).zoomTo(this.options.maxzoom)
        ];
    },
    getTile: function(c) {
        var coord;
        if (!(coord = this.sourceCoordinate(c))) return null;
        if (coord.zoom < this.options.minzoom || coord.zoom > this.options.maxzoom) return null;

        coord.row = (this.options.scheme === 'tms') ?
            Math.pow(2, coord.zoom) - coord.row - 1 :
            coord.row;

        var u = this.options.tiles[parseInt(Math.pow(2, coord.zoom) * coord.row + coord.column, 10) %
            this.options.tiles.length]
            .replace('{z}', coord.zoom.toFixed(0))
            .replace('{x}', coord.column.toFixed(0))
            .replace('{y}', coord.row.toFixed(0));

        if (wax._ && wax._.bw) {
            u = u.replace('.png', wax._.bw_png)
                .replace('.jpg', wax._.bw_jpg);
        }

        return u;
    }
};

if (MM) {
    MM.extend(wax.mm._provider, MM.MapProvider);
}

wax.mm.connector = function(options) {
    var x = new wax.mm._provider(options);
    return new MM.Layer(x);
};
