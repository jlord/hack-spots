describe('legend', function() {
    it('can get and set its content', function() {
        var legend = wax.mm.legend();
        expect(legend.content('hi')).toEqual(legend);
        expect(legend.content()).toEqual('hi');
    });

    it('returns a dom node as its element', function() {
        var legend = wax.mm.legend();
        expect(jasmine.isDomNode(legend.element())).toEqual(true);
    });

    it('returns false if added without being mapped', function() {
        var legend = wax.mm.legend();
        expect(legend.add()).toEqual(false);
    });

    it('can be appended to a div', function() {
        var legend = wax.mm.legend();
        var div = document.createElement('div');
        expect(legend.appendTo(div)).toEqual(legend);
        expect(legend.element().parentNode).toEqual(div);
    });

    it('hides itself when content is none and shows when content is present', function() {
        var legend = wax.mm.legend();
        expect(legend.content('')).toEqual(legend);
        expect(legend.element().firstChild.style.display).toEqual('none');
        expect(legend.content('hi')).toEqual(legend);
        expect(legend.element().firstChild.style.display).toEqual('block');
    });
});
