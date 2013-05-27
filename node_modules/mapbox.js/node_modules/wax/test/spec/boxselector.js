describe('boxselector', function() {
    var map, callbackResult, boxselector;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
        boxselector = wax.mm.boxselector().map(map).add();
        boxselector.addCallback('change', function() {
            callbackResult = arguments;
        });
    });

    it('can add locations', function() {
        runs(function() {
            boxselector.extent([
                new com.modestmaps.Location(10, 20),
                new com.modestmaps.Location(30, 40)
            ]);
        });
        waits(100);
        runs(function() {
            expect(callbackResult.length).toEqual(2);
            expect(callbackResult[1][0].lat).toEqual(30);
            expect(callbackResult[1][0].lon).toEqual(20);
            expect(callbackResult[1][1].lat).toEqual(10);
            expect(callbackResult[1][1].lon).toEqual(40);
        });
    });
});
