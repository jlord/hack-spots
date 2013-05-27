describe('pointselector', function() {
    var map, callbackResult, pointselector;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new MM.Map(div, new MM.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
        pointselector = wax.mm.pointselector().map(map).add();
        pointselector.addCallback('change', function() {
            callbackResult = arguments;
        });
    });

    afterEach(function() {
        div = null;
        map.destroy();
    });

    it('can add locations', function() {
        pointselector.addLocation(
            new MM.Location(37.811530, -122.2666097));
        expect(callbackResult.length).toEqual(2);
        expect(callbackResult[1][0].lat).toEqual(37.811530);
        expect(callbackResult[1][0].lon).toEqual(-122.2666097);
    });

    it('add a new callback to itself', function() {
        var new_called = false;
        function newcallback() {
            new_called = true;
        }
        pointselector.addCallback('change', newcallback);
        pointselector.addLocation({
            lat: 37.811530,
            lon: -122.2666097
        });
        expect(new_called).toEqual(true);
    });

    it('can add and remove locations', function() {
        var l = new com.modestmaps.Location(37.811530, -122.2666097);
        pointselector.addLocation(l);
        pointselector.deleteLocation(l);
        expect(callbackResult.length).toEqual(2);
        expect(callbackResult[1].length).toEqual(0);
    });

    it('can be removed', function() {
        for (var i = 0; i < 10; i++) {
            var l = new com.modestmaps.Location(i, i);
            pointselector.addLocation(l);
        }
        pointselector.remove();
        expect(pointselector.locations().length).toEqual(0);
    });
});
