wax = wax || {};
wax.esri = wax.esri || {};

wax.esri.interaction = function() {
    var dirty = false, _grid, map, dojo_connections;

    function setdirty() { dirty = true; }

    function grid() {

        if (!dirty && _grid) {
            return _grid;
        } else {
            _grid = [];
            for (var i = 0; i < map.layerIds.length; i++) {
                var layer = map.getLayer(map.layerIds[i]);

                // This is not in the documented API and may break.
                // Blame paleogeographers for not considering implementation
                // to be an important detail of web maps.
                var div = layer._div;
                var ims = div.getElementsByTagName('img');
                for (var j = 0; j < ims.length; j++) {
                    var tileOffset = wax.u.offset(ims[j]);
                    _grid.push([
                        tileOffset.top,
                        tileOffset.left,
                        ims[j]
                    ]);
                }
            }
        }
        return _grid;
    }

    function attach(x) {
        if (!arguments.length) return map;
        map = x;
        dojo_connections = [
          dojo.connect(map, 'onExtentChange', setdirty),
          dojo.connect(map, 'onUpdateEnd', setdirty),
          dojo.connect(map, "onReposition", setdirty)
        ];
    }

    function detach(x) {
        for (var i = 0; i < dojo_connections.length; i++) {
            dojo.disconnect(dojo_connections[i]);
        }
    }

    return wax.interaction()
        .attach(attach)
        .detach(detach)
        .parent(function() {
          return map.root;
        })
        .grid(grid);
};
