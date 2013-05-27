var Klass = function () {
};

Klass.prototype.callback = function (arg) {
    return arg;
};

var test_features = [{
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [-77, 37.8]
    },
    properties: { }
}];

describe('mapbox.markers', function() {
    it('can be initialized', function() {
        var m = mapbox.markers.layer();
        expect(m.features()).toEqual([]);
        expect(m.markers()).toEqual([]);
    });

    it('can be destroyed', function() {
        var m = mapbox.markers.layer();
        m.destroy();
        expect(m.parent.parentNode).toBeFalsy();
    });

    it('has a parent dom element', function() {
        var m = mapbox.markers.layer();
        expect(jasmine.isDomNode(m.parent)).toBeTruthy();
    });

    it('can be enabled and disabled', function() {
        var m = mapbox.markers.layer();

        expect(m.enabled).toBeTruthy();

        expect(m.enable()).toEqual(m);
        expect(m.enabled).toBeTruthy();

        expect(m.disable()).toEqual(m);
        expect(m.enabled).toBeFalsy();
    });

    it('can be named', function() {
        var m = mapbox.markers.layer().named('tom');
        expect(m.named()).toEqual('tom');
        expect(m.name).toEqual('tom');

        m.named('john');
        expect(m.named()).toEqual('john');
        expect(m.name).toEqual('john');
    });

    describe('factory', function() {
        it('returns its default factory function', function() {
            var m = mapbox.markers.layer();
            expect(typeof m.factory()).toEqual('function');
        });

        it('the default factory creates a dom node', function() {
            var m = mapbox.markers.layer();
            expect(jasmine.isDomNode(m.factory()({})));
        });

        it('can be assigned a new factory function', function() {
            var m = mapbox.markers.layer();
            var foo = function() {};
            expect(typeof m.factory()).toEqual('function');
            expect(m.factory(foo)).toEqual(m);
            expect(m.factory()).toEqual(foo);
        });
    });

    describe('geojson interface', function() {
        it('returns its empty features geojson', function() {
            var m = mapbox.markers.layer();
            expect(m.features()).toEqual([]);
            expect(m.features().length).toEqual(0);
        });

        it('empties its parent and clears the internal feature collection on clear', function() {
            var m = mapbox.markers.layer();
            expect(m.features(null)).toEqual(m);
        });
    });

    describe('marker addition', function() {
        it('adds an element to its parent when a single marker is there', function() {
            var mapdiv = document.createElement('div');
            var layer = mapbox.markers.layer().features(test_features);
            var m = new MM.Map(mapdiv, layer)
            .setCenterZoom(new MM.Location(37.8, -77), 7);
            expect(layer.parent.childNodes.length).toEqual(1);
        });

        it('can have a marker added to it before attachment to a layer', function() {
            var layer = mapbox.markers.layer()
            .features(test_features)
            .add_feature(test_features[0]);
            expect(layer.parent.childNodes.length).toEqual(2);
        });

        it('removes that element when called with geojson null', function() {
            var mapdiv = document.createElement('div');
            var layer = mapbox.markers.layer().features(test_features);
            var m = new MM.Map(mapdiv, layer)
            .setCenterZoom(new MM.Location(37.8, -77), 7);
            expect(layer.parent.childNodes.length).toEqual(1);
            layer.features(null);
            expect(layer.parent.childNodes.length).toEqual(0);
        });
    });

    describe('sorting function', function() {
        it('has a sorting function and can accept a new one', function() {
            var layer = mapbox.markers.layer();
            expect(typeof layer.sort()).toEqual('function');
            function revsort(a, b) { return -1; }
            expect(layer.sort(revsort)).toEqual(layer);
            expect(layer.sort()).toEqual(revsort);
        });

        it('sorts points by y-coordinate', function() {
            var ft = [
                {
                'geometry': { 'coordinates': [0, 0] },
                'properties': { 'order': 2 }
            },
            {
                'geometry': { 'coordinates': [0, -10] },
                'properties': { 'order': 1 }
            },
            {
                'geometry': { 'coordinates': [0, 10] },
                'properties': { 'order': 3 }
            }
            ];
            var layer = mapbox.markers.layer().features(ft);
            expect(layer.features()[0].properties.order).toEqual(3);
            expect(layer.features()[1].properties.order).toEqual(2);
            expect(layer.features()[2].properties.order).toEqual(1);
        });
    });

    describe('marker loading from a url', function() {
        it('can load markers from a URL', function() {
            var layer;
            runs(function() {
                layer = mapbox.markers.layer().url('mock/onepoint.geojson');
            });
            waits(100);
            runs(function() {
                expect(layer.features().length).toEqual(1);
            });
        });

        it('can load markers from an ID', function() {
            var layer;
            runs(function() {
                layer = mapbox.markers.layer().id('examples.map-sjm2w6i9');
            });
            waits(1000);
            runs(function() {
                expect(layer.features().length).toEqual(9);
            });
        });

        it('calls a callback when features are loaded', function() {
            var layer;
            var obj = new Klass();
            spyOn(obj, 'callback');
            runs(function() {
                layer = mapbox.markers.layer().url('mock/onepoint.geojson', obj.callback);
            });
            waits(100);
            runs(function() {
                expect(layer.features().length).toEqual(1);
                expect(obj.callback).toHaveBeenCalled();
                expect(obj.callback).toHaveBeenCalledWith(null, layer.features(), layer);
            });
        });

        it('gets and sets URLs', function() {
            layer = mapbox.markers.layer();
            layer.url(['mock/onepoint.geojson']);
            expect(layer.url()[0]).toEqual('mock/onepoint.geojson');
        });

        it('transforms plain url strings to arrays', function() {
            layer = mapbox.markers.layer();
            layer.url('mock/onepoint.geojson');
            expect(layer.url()[0]).toEqual('mock/onepoint.geojson');
        });
    });

    describe('extent calculation', function() {
        it('correctly calculates the extent of a layer with one feature', function() {
            var layer;
            runs(function() {
                layer = mapbox.markers.layer().url('mock/onepoint.geojson');
            });
            waits(100);
            runs(function() {
                expect(layer.features().length).toEqual(1);
                expect(layer.extent()[0].lon).toEqual(102);
                expect(layer.extent()[0].lat).toEqual(0.5);
                expect(layer.extent()[1].lon).toEqual(102);
                expect(layer.extent()[1].lat).toEqual(0.5);
            });
        });
    });

    describe('filtering', function() {
        it('can filter elements.', function() {
            var features = [];
            for (var i = 0; i < 10; i++) {
                features.push({
                    geometry: {
                        coordinates: [i, i]
                    },
                    properties: {
                        i: i
                    }
                });
            }
            var layer = mapbox.markers.layer().features(features);
            expect(layer.parent.childNodes.length).toEqual(10);
            layer.filter(function(f) {
                return f.properties.i > 4;
            });
            expect(layer.parent.childNodes.length).toEqual(5);
            layer.filter(function(f) {
                return true;
            });
            expect(layer.parent.childNodes.length).toEqual(10);
            expect(layer.features().length).toEqual(10);
            layer.filter(function(f) {
                return false;
            });
            expect(layer.parent.childNodes.length).toEqual(0);
            expect(layer.features().length).toEqual(10);
        });
    });
});
