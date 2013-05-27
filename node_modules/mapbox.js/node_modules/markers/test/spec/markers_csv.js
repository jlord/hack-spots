describe('mapbox.markers csv', function() {
    it('can parse a simple csv file', function() {
        var csv = 'lat,lon\n10,15';
        expect(mapbox.markers.csv_to_geojson(csv)[0].geometry.coordinates).toEqual([15, 10]);
    });

    it('can parse the properties of a csv file csv file', function() {
        var csv = 'lat,lon,name\n10,15,Tom';
        expect(mapbox.markers.csv_to_geojson(csv)[0].properties.name).toEqual('Tom');
    });

    it('provides a simple features interface', function() {
        var csv = 'lat,lon,name\n10,15,Tom';
        expect(mapbox.markers.layer().csv(csv).features()[0].properties.name).toEqual('Tom');
    });

    it('with invalid input does not set any features', function() {
        var csv = 'fdsakfljdsl fjdklsafj fdsaf';
        expect(mapbox.markers.layer().csv(csv).features()).toEqual([]);
    });
});
