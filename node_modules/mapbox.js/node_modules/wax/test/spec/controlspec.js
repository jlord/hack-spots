describe('control spec', function() {
    var map, callbackResult, controls;

    controls = {
        pointselector: wax.mm.pointselector(),
        attribution: wax.mm.attribution(),
        fullscreen: wax.mm.fullscreen(),
        boxselector: wax.mm.boxselector(),
        zoomer: wax.mm.zoomer(),
        legend: wax.mm.legend(),
        hash: wax.mm.hash(),
        zoombox: wax.mm.zoombox()
    };

    beforeEach(function() {
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new MM.Map(div, new MM.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
    });

    afterEach(function() {
        div = null;
        map.destroy();
    });

    for (var i in controls) {
        describe(i, (function(i) {
            return function() {
                it(i + ' can get and set the map', function() {
                    expect(controls[i].map(map)).toEqual(controls[i]);
                    expect(controls[i].map()).toEqual(map);
                    expect(controls[i].map(map)).toEqual(controls[i]);
                });

                it(i + ' can be added', function() {
                    expect(controls[i].map(map)).toEqual(controls[i]);
                    expect(controls[i].add()).toEqual(controls[i]);
                });

                it(i + ' can be removed', function() {
                    expect(controls[i].remove()).toEqual(controls[i]);
                });
            }
        })(i));
    }
});
