describe('simplestyle factory', function() {
    it('creates proper elements', function() {
        var ft = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77, 37.8]
            },
            "properties": {
                "title": "This is a bus",
                "marker-shape": "pin",
                "marker-size": "medium",
                "marker-symbol": "bus",
                "marker-color": "#1ae"
            }
        };
        var elem = mapbox.markers.simplestyle_factory(ft);
        expect(jasmine.isDomNode(elem)).toBeTruthy();
    });

    it('generates a proper url for an icon', function() {
        var ft = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77, 37.8]
            },
            "properties": {
                "title": "This is a bus",
                "marker-shape": "pin",
                "marker-size": "medium",
                "marker-symbol": "bus",
                "marker-color": "#1ae"
            }
        };
        var dp = window.devicePixelRatio;
        window.devicePixelRatio = 1;
        var elem = mapbox.markers.simplestyle_factory(ft);
        expect(elem.src).toEqual('http://a.tiles.mapbox.com/v3/marker/pin-m-bus+1ae.png');
        window.devicePixelRatio = dp;
    });

    it('generates a proper url for an icon', function() {
        var ft = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77, 37.8]
            },
            "properties": {
                "title": "This is a bus",
                "marker-shape": "pin",
                "marker-size": "medium",
                "marker-symbol": "bus",
                "marker-color": "#1ae"
            }
        };
        var dp = window.devicePixelRatio;
        window.devicePixelRatio = 2;
        // Some browsers do not allow this attribute to be modified (Opera)
        if (window.devicePixelRatio == 2) {
            var elem = mapbox.markers.simplestyle_factory(ft);
            expect(elem.src).toEqual('http://a.tiles.mapbox.com/v3/marker/pin-m-bus+1ae@2x.png');
            window.devicePixelRatio = dp;
        }
    });

});
