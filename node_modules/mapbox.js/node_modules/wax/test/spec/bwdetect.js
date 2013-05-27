describe('bwdetect', function() {
    var map, bwdetect;

    beforeEach(function() {
        var div = document.createElement('div');
        div.id = +new Date();

        var tilejson = {
          tilejson: '1.0.0',
          scheme: 'tms',
          tiles: ['http://a.tiles.mapbox.com/mapbox/1.0.0/blue-marble-topo-jul,world-bank-borders-ar/{z}/{x}/{y}.png']
        };
        map = new MM.Map(div, new wax.mm.connector(tilejson), new MM.Point(500, 500));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 4);
        bwdetect = wax.mm.bwdetect(map, {
            png: '.png32'
        });
    });

    /*
    it('reduces quality when toggled and restores it', function() {
        runs(function() {
            bwdetect.bw(0);
        });
        waits(1000);
        runs(function() {
            expect(!!$('img', map.parent).attr('src').match(/png32/)).toEqual(true);
            expect(!!$('img', map.parent).attr('src').match(/png$/)).toEqual(false);
            expect(bwdetect.bw()).toEqual(0);
        });

        runs(function() {
            bwdetect.bw(1);
        });
        waits(1000);
        runs(function() {
            expect(!!$('img', map.parent).attr('src').match(/png32/)).toEqual(false);
            expect(!!$('img', map.parent).attr('src').match(/png$/)).toEqual(true);
            expect(bwdetect.bw()).toEqual(1);
        });
    });
    */
});
