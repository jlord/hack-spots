dojo.declare('wax.esri.connector', esri.layers.TiledMapServiceLayer, { // create WMTSLayer by extending esri.layers.TiledMapServiceLayer
  constructor: function(options) {
    options = options || {};

    this.options = {
      tiles: options.tiles,
      minzoom: options.minzoom || 0,
      maxzoom: options.maxzoom || 22
    };

    var lim = 20037508.342789; // don't repeat this too much
    this.spatialReference = new esri.SpatialReference({
      wkid: 3857
    });
    this.initialExtent = new esri.geometry.Extent(-lim, -lim, lim, lim, this.spatialReference);
    this.fullExtent = this.initialExtent;

    var lods = [];
    for (var z = this.options.minzoom; z <= this.options.maxzoom; z++) {
      lods.push({
        'level': z,
        'scale': 591657527.591555 / Math.pow(2, z),
        'resolution': 156543.033928 / Math.pow(2, z)
      });
    }

    this.tileInfo = new esri.layers.TileInfo({
      spatialReference: {
        wkid: '3857'
      },
      rows: 256,
      cols: 256,
      origin: {
        x: -lim,
        y: lim
      },
      lods: lods
    });

    this.loaded = true;
    this.onLoad(this);
  },

  getTileUrl: function(z, y, x) {
    return this.options.tiles[parseInt(Math.pow(2, z) * y + x, 10) %
      this.options.tiles.length]
      .replace('{z}', z)
      .replace('{x}', x)
      .replace('{y}', y);
  }
});
