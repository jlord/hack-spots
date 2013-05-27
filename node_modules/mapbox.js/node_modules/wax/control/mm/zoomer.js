wax = wax || {};
wax.mm = wax.mm || {};

wax.mm.zoomer = function() {
    var zoomer = {},
        smooth = true,
        map;

    var zoomin = document.createElement('a'),
        zoomout = document.createElement('a');

    function stopEvents(e) {
        e.stop();
    }

    function zIn(e) {
        e.stop();
        if (smooth && map.ease) {
            map.ease.zoom(map.zoom() + 1).run(50);
        } else {
            map.zoomIn();
        }
    }

    function zOut(e) {
        e.stop();
        if (smooth && map.ease) {
            map.ease.zoom(map.zoom() - 1).run(50);
        } else {
            map.zoomOut();
        }
    }

    zoomin.innerHTML = '+';
    zoomin.href = '#';
    zoomin.className = 'zoomer zoomin';
    zoomout.innerHTML = '-';
    zoomout.href = '#';
    zoomout.className = 'zoomer zoomout';

    function updateButtons(map, e) {
        if (map.coordinate.zoom === map.coordLimits[0].zoom) {
            zoomout.className = 'zoomer zoomout zoomdisabled';
        } else if (map.coordinate.zoom === map.coordLimits[1].zoom) {
            zoomin.className = 'zoomer zoomin zoomdisabled';
        } else {
            zoomin.className = 'zoomer zoomin';
            zoomout.className = 'zoomer zoomout';
        }
    }

    zoomer.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return zoomer;
    };

    zoomer.add = function() {
        if (!map) return false;
        map.addCallback('drawn', updateButtons);
        zoomer.appendTo(map.parent);
        bean.add(zoomin, 'mousedown dblclick', stopEvents);
        bean.add(zoomout, 'mousedown dblclick', stopEvents);
        bean.add(zoomout, 'touchstart click', zOut);
        bean.add(zoomin, 'touchstart click', zIn);
        return zoomer;
    };

    zoomer.remove = function() {
        if (!map) return false;
        map.removeCallback('drawn', updateButtons);
        if (zoomin.parentNode) zoomin.parentNode.removeChild(zoomin);
        if (zoomout.parentNode) zoomout.parentNode.removeChild(zoomout);
        bean.remove(zoomin, 'mousedown dblclick', stopEvents);
        bean.remove(zoomout, 'mousedown dblclick', stopEvents);
        bean.remove(zoomout, 'touchstart click', zOut);
        bean.remove(zoomin, 'touchstart click', zIn);
        return zoomer;
    };

    zoomer.appendTo = function(elem) {
        wax.u.$(elem).appendChild(zoomin);
        wax.u.$(elem).appendChild(zoomout);
        return zoomer;
    };

    zoomer.smooth = function(x) {
        if (!arguments.length) return smooth;
        smooth = x;
        return zoomer;
    };

    return zoomer;
};
