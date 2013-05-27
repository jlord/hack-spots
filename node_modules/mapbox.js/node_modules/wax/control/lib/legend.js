// Wax Legend
// ----------

// Wax header
var wax = wax || {};

wax.legend = function() {
    var element,
        legend = {},
        container;

    legend.element = function() {
        return container;
    };

    legend.content = function(content) {
        if (!arguments.length) return element.innerHTML;

        element.innerHTML = wax.u.sanitize(content);
        element.style.display = 'block';
        if (element.innerHTML === '') {
            element.style.display = 'none';
        }

        return legend;
    };

    legend.add = function() {
        container = document.createElement('div');
        container.className = 'map-legends wax-legends';

        element = container.appendChild(document.createElement('div'));
        element.className = 'map-legend wax-legend';
        element.style.display = 'none';
        return legend;
    };

    return legend.add();
};
