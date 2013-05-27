wax = wax || {};
wax.mm = wax.mm || {};
wax._ = {};

wax.mm.bwdetect = function(map, options) {
    options = options || {};
    var lowpng = options.png || '.png128',
        lowjpg = options.jpg || '.jpg70',
        bw = false;

    wax._.bw_png = lowpng;
    wax._.bw_jpg = lowjpg;

    return wax.bwdetect(options, function(x) {
        wax._.bw = !x;
        for (var i = 0; i < map.layers.length; i++) {
            if (map.getLayerAt(i).provider instanceof wax.mm.connector) {
                map.getLayerAt(i).setProvider(map.getLayerAt(i).provider);
            }
        }
    });
};
