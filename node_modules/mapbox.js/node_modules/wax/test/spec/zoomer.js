describe('zoomer', function() {
    var map, initial_zoom = 10;

    beforeEach(function() {
        var div = document.createElement('div');

        map = new MM.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']), new MM.Point(600, 400));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
        wax.mm.zoomer().map(map).add().appendTo(map.parent);
    });

    it('should be able to zoom in', function() {
        expect(map.getZoom()).toEqual(10);
        $('.zoomin', map.parent).click();
        expect(map.getZoom()).toEqual(11);
    });

    it('should be able to zoom out', function() {
        expect(map.getZoom()).toEqual(10);
        $('.zoomout', map.parent).click();
        expect(map.getZoom()).toEqual(9);
    });

    it('marks as unzoomable when zoom is zero', function() {
        runs(function() {
            map.setZoom(0);
        });
        waits(100);
        runs(function() {
            expect($('.zoomout', map.parent).hasClass('zoomdisabled')).toEqual(true);
        });
    });

    it('marks as unzoomable when zoom is eighteen', function() {
        map.setZoomRange(0, 18);
        runs(function() {
            map.setZoom(18);
        });
        waits(200);
        runs(function() {
            expect($('.zoomin', map.parent).hasClass('zoomdisabled')).toEqual(true);
        });
    });
});
