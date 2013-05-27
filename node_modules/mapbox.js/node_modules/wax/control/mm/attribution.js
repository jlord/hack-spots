wax = wax || {};
wax.mm = wax.mm || {};

wax.mm.attribution = function() {
    var map,
        a = {},
        container = document.createElement('div');

    container.className = 'map-attribution map-mm';

    a.content = function(x) {
        if (typeof x === 'undefined') return container.innerHTML;
        container.innerHTML = wax.u.sanitize(x);
        return a;
    };

    a.element = function() {
        return container;
    };

    a.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return a;
    };

    a.add = function() {
        if (!map) return false;
        map.parent.appendChild(container);
        return a;
    };

    a.remove = function() {
        if (!map) return false;
        if (container.parentNode) container.parentNode.removeChild(container);
        return a;
    };

    a.appendTo = function(elem) {
        wax.u.$(elem).appendChild(container);
        return a;
    };

    return a;
};
