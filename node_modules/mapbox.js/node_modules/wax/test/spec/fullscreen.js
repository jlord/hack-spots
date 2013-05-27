describe('fullscreen', function() {
    var map, fullscreen;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        map = new MM.Map(div, new MM.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
        map.setCenterZoom(new MM.Location(37.811530, -122.2666097), 10);
        fullscreen = wax.mm.fullscreen().map(map).add();
    });

    it('makes the map fullscreen', function() {
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(true);
    });

    it('the fullscreen api tells that the map is fullscreen', function() {
        $('.map-fullscreen', map.parent).click();
        expect(fullscreen.fullscreen()).toEqual(true);
        $('.map-fullscreen', map.parent).click();
        expect(fullscreen.fullscreen()).toEqual(false);
    });

    it('the fullscreen api can be used programmatically to change the fullscreenness', function() {
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(false);

        expect(fullscreen.fullscreen(true)).toEqual(fullscreen);
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(true);
        expect(fullscreen.fullscreen()).toEqual(true);

        expect(fullscreen.fullscreen(false)).toEqual(fullscreen);
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(false);
        expect(fullscreen.fullscreen()).toEqual(false);
    });

    it('can toggle fullscreen', function() {
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(true);
        $('.map-fullscreen', map.parent).click();
        expect($(map.parent).hasClass('map-fullscreen-map')).toEqual(false);
    });

    it('provides its dom element', function() {
        expect(jasmine.isDomNode(fullscreen.element())).toEqual(true);
    });

    it('can be appended to another element', function() {
        var div = document.createElement('div');
        expect(fullscreen.appendTo(div)).toEqual(fullscreen);
        expect(fullscreen.element().parentNode).toEqual(div);
    });

    it('can repeatedly make things fullscreen and not fullscreen', function() {
        fullscreen.full();
        fullscreen.full();
        fullscreen.full();
        fullscreen.original();
        fullscreen.original();
        fullscreen.original();
    });

    it('can be added and removed', function() {
        expect(fullscreen.add()).toEqual(fullscreen);
        expect(fullscreen.remove()).toEqual(fullscreen);
    });
});
