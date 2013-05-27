wax = wax || {};
wax.g = wax.g || {};

// Legend Control
// --------------
// Adds legends to a google Map object.
wax.g.legend = function(map, tilejson) {
    tilejson = tilejson || {};
    var l, // parent legend
        legend = {};

    legend.add = function() {
        l = wax.legend()
            .content(tilejson.legend || '');
        return legend;
    };

    legend.element = function() {
        return l.element();
    };

    legend.appendTo = function(elem) {
        wax.u.$(elem).appendChild(l.element());
        return legend;
    };

    return legend.add();
};
