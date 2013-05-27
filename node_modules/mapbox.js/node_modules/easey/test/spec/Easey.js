describe("Easey", function() {
    function Receiver() { }
    Receiver.prototype.receive = function() { };

    var map, sink;

    beforeEach(function() {
        sink = new Receiver();
        var map_div = document.createElement('div');
        map = new MM.Map(map_div, new MM.TemplatedLayer('http://b.tile.openstreetmap.org/{Z}/{X}/{Y}.png'));
    });

    it('assigns the map var correctly', function() {
        var ease = easey();
        ease.map(map);
        expect(ease.map()).toEqual(map);
    });

    it('zooms the to coordinate with zoom()', function() {
        var ease = easey();
        ease.map(map);
        ease.zoom(10);
        expect(ease.to().zoom).toEqual(10);
    });

    it('correctly interpolates between two coordinates', function() {
        easey().map(map)
            .from(new MM.Coordinate(0, 10, 0))
            .to(new MM.Coordinate(0, 0, 0))
            .easing('linear')
            .t(0.5);

        expect(map.coordinate.column).toEqual(5);
        expect(map.coordinate.row).toEqual(0);
        expect(map.coordinate.zoom).toEqual(0);
    });

    it('predicts the future correctly', function() {
        var ease = easey();
        ease.map(map).from(new MM.Coordinate(0, 10, 0))
        .to(new MM.Coordinate(0, 0, 0));
        var future = ease.future(10);
        expect(future.length).toEqual(10);
        expect(future[0].column).toEqual(10);
        expect(future[9].column).toEqual(0);
    });

    it('moves the map quickly', function() {
        var ease = easey();
        ease.map(map).from(new MM.Coordinate(0, 10, 0))
        .to(new MM.Coordinate(0, 0, 0));
        runs(function() {
            ease.run(10);
            expect(ease.running()).toBeTruthy();
        });
        waits(200);
        runs(function() {
            expect(map.coordinate.column).toEqual(0);
            expect(map.coordinate.row).toEqual(0);
            expect(map.coordinate.zoom).toEqual(0);
            expect(ease.running()).toBeFalsy();
        });
    });

    it('calls a callback after finishing an ease', function() {
        var ease = easey();
        ease.map(map).from(new MM.Coordinate(0, 10, 0))
        .to(new MM.Coordinate(0, 0, 0));
        spyOn(sink, 'receive');
        runs(function() {
            ease.run(10, sink.receive);
            expect(ease.running()).toBeTruthy();
        });
        waits(200);
        runs(function() {
            expect(sink.receive).toHaveBeenCalledWith(map);
            expect(ease.running()).toBeFalsy();
        });
    });

    it('ends up at the correct coord after an optimal zoom/pan', function() {
        map.setSize(new MM.Point(10, 10));
        var ease = easey();
        ease.map(map).from(new MM.Coordinate(2, 2, 2))
            .to(new MM.Coordinate(1, 1, 1));
        runs(function() {
            ease.optimal(20);
            expect(ease.running()).toBeTruthy();
        });
        waits(200);
        runs(function() {
            expect(map.coordinate.column).toEqual(1);
            expect(map.coordinate.row).toEqual(1);
            expect(map.coordinate.zoom).toEqual(1);
            expect(ease.running()).toBeFalsy();
        });
    });

    it('can be stopped', function() {
        var ease = easey();
        spyOn(sink, 'receive');
        runs(function() {
            ease.map(map).from(new MM.Coordinate(0, 10, 0))
                .to(new MM.Coordinate(0, 0, 0)).run(10);
            expect(ease.running()).toBeTruthy();
            ease.stop(sink.receive);
        });
        waits(500);
        runs(function() {
            expect(sink.receive).toHaveBeenCalled();
            expect(ease.running()).toBeFalsy();
        });
    });

    it('resets from after a run', function() {
        var ease = easey();
        ease.map(map).from(new MM.Coordinate(0, 10, 0))
            .to(new MM.Coordinate(0, 0, 0)).run(1);

        waits(50);
        runs(function() {
            expect(ease.from()).toEqual(undefined);
        });
    });
});
