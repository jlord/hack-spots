describe("Easey handlers", function() {
    function Receiver() { }
    Receiver.prototype.receive = function() { };

    var map, sink;

    beforeEach(function() {
        sink = new Receiver();
        var map_div = document.createElement('div');
        map = new MM.Map(map_div, new MM.TemplatedLayer('http://b.tile.openstreetmap.org/{Z}/{X}/{Y}.png'));
    });

    afterEach(function() {
        map.destroy();
    });

    it('handlers can be attached and removed from the map', function() {
        for (var h in easey_handlers) {
            var newh = new easey_handlers[h]();
            newh.init(map);
            newh.remove();
        }
    });
});
