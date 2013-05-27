;(function(context, MM) {

    var easey_handlers = {};

    easey_handlers.TouchHandler = function() {
        var handler = {},
            map,
            panner,
            maxTapTime = 250,
            maxTapDistance = 30,
            maxDoubleTapDelay = 350,
            locations = {},
            taps = [],
            wasPinching = false,
            lastPinchCenter = null,
            p0 = new MM.Point(0, 0),
            p1 = new MM.Point(0, 0);

        function focusMap(e) {
            map.parent.focus();
        }

        function clearLocations() {
            for (var loc in locations) {
                if (locations.hasOwnProperty(loc)) {
                    delete locations[loc];
                }
            }
        }

        function updateTouches (e) {
            for (var i = 0; i < e.touches.length; i += 1) {
                var t = e.touches[i];
                if (t.identifier in locations) {
                    var l = locations[t.identifier];
                    l.x = t.clientX;
                    l.y = t.clientY;
                    l.scale = e.scale;
                } else {
                    locations[t.identifier] = {
                        scale: e.scale,
                        startPos: { x: t.clientX, y: t.screenY },
                        startZoom: map.zoom(),
                        x: t.clientX,
                        y: t.clientY,
                        time: new Date().getTime()
                    };
                }
            }
        }

        function touchStartMachine(e) {
            if (!panner) panner = panning(map, 0.10);
            MM.addEvent(e.touches[0].target, 'touchmove',
                touchMoveMachine);
            MM.addEvent(e.touches[0].target, 'touchend',
                touchEndMachine);
            if (e.touches[1]) {
                MM.addEvent(e.touches[1].target, 'touchmove',
                    touchMoveMachine);
                MM.addEvent(e.touches[1].target, 'touchend',
                    touchEndMachine);
            }
            updateTouches(e);
            panner.down(e.touches[0]);
            return MM.cancelEvent(e);
        }

        function touchMoveMachine(e) {
            switch (e.touches.length) {
                case 1:
                    panner.move(e.touches[0]);
                    break;
                case 2:
                    onPinching(e);
                    break;
            }
            updateTouches(e);
            return MM.cancelEvent(e);
        }

        // Handle a tap event - mainly watch for a doubleTap
        function onTap(tap) {
            if (taps.length &&
                (tap.time - taps[0].time) < maxDoubleTapDelay) {
                onDoubleTap(tap);
                taps = [];
                return;
            }
            taps = [tap];
        }

        // Handle a double tap by zooming in a single zoom level to a
        // round zoom.
        function onDoubleTap(tap) {
            // zoom in to a round number
            easey().map(map)
            .to(map.pointCoordinate(tap).zoomTo(map.getZoom() + 1))
            .path('about').run(200, function() {
                map.dispatchCallback('zoomed');
                clearLocations();
            });
        }

        function onPinching(e) {
            // use the first two touches and their previous positions
            var t0 = e.touches[0],
                t1 = e.touches[1];
            p0.x = t0.clientX;
            p0.y = t0.clientY;
            p1.x = t1.clientX;
            p1.y = t1.clientY;
            l0 = locations[t0.identifier],
            l1 = locations[t1.identifier];

            // mark these touches so they aren't used as taps/holds
            l0.wasPinch = true;
            l1.wasPinch = true;

            // scale about the center of these touches
            var center = MM.Point.interpolate(p0, p1, 0.5);

            map.zoomByAbout(
                Math.log(e.scale) / Math.LN2 - Math.log(l0.scale) / Math.LN2,
                center);

            // pan from the previous center of these touches
            prevX = l0.x + (l1.x - l0.x) * 0.5;
            prevY = l0.y + (l1.y - l0.y) * 0.5;
            map.panBy(center.x - prevX,
                      center.y - prevY);
            wasPinching = true;
            lastPinchCenter = center;
        }

        // When a pinch event ends, round the zoom of the map.
        function onPinched(touch) {
            var z = map.getZoom(), // current zoom
                tz = locations[touch.identifier].startZoom > z ? Math.floor(z) : Math.ceil(z);
            easey().map(map).point(lastPinchCenter).zoom(tz)
                .path('about').run(300);
            clearLocations();
            wasPinching = false;
        }

        function touchEndMachine(e) {
            MM.removeEvent(e.target, 'touchmove',
                touchMoveMachine);
            MM.removeEvent(e.target, 'touchend',
                touchEndMachine);
            var now = new Date().getTime();

            // round zoom if we're done pinching
            if (e.touches.length === 0 && wasPinching) {
                onPinched(e.changedTouches[0]);
            }

            panner.up();

            // Look at each changed touch in turn.
            for (var i = 0; i < e.changedTouches.length; i += 1) {
                var t = e.changedTouches[i],
                loc = locations[t.identifier];
                // if we didn't see this one (bug?)
                // or if it was consumed by pinching already
                // just skip to the next one
                if (!loc || loc.wasPinch) {
                    continue;
                }

                // we now know we have an event object and a
                // matching touch that's just ended. Let's see
                // what kind of event it is based on how long it
                // lasted and how far it moved.
                var pos = { x: t.clientX, y: t.clientY },
                time = now - loc.time,
                travel = MM.Point.distance(pos, loc.startPos);
                if (travel > maxTapDistance) {
                    // we will to assume that the drag has been handled separately
                } else if (time > maxTapTime) {
                    // close in space, but not in time: a hold
                    pos.end = now;
                    pos.duration = time;
                } else {
                    // close in both time and space: a tap
                    pos.time = now;
                    onTap(pos);
                }
            }

            // Weird, sometimes an end event doesn't get thrown
            // for a touch that nevertheless has disappeared.
            // Still, this will eventually catch those ids:

            var validTouchIds = {};
            for (var j = 0; j < e.touches.length; j++) {
                validTouchIds[e.touches[j].identifier] = true;
            }
            for (var id in locations) {
                if (!(id in validTouchIds)) {
                    delete validTouchIds[id];
                }
            }

            return MM.cancelEvent(e);
        }

        handler.init = function(x) {
            map = x;

            MM.addEvent(map.parent, 'touchstart',
                touchStartMachine);
        };

        handler.remove = function() {
            if (!panner) return;
            MM.removeEvent(map.parent, 'touchstart',
                touchStartMachine);
            panner.remove();
        };

        return handler;
    };

    easey_handlers.DoubleClickHandler = function() {
        var handler = {},
            map;

        function doubleClick(e) {
            // Ensure that this handler is attached once.
            // Get the point on the map that was double-clicked
            var point = MM.getMousePoint(e, map);
            z = map.getZoom() + (e.shiftKey ? -1 : 1);
            // use shift-double-click to zoom out
            easey().map(map)
                .to(map.pointCoordinate(MM.getMousePoint(e, map)).zoomTo(z))
                .path('about').run(100, function() {
                map.dispatchCallback('zoomed');
            });
            return MM.cancelEvent(e);
        }

        handler.init = function(x) {
            map = x;
            MM.addEvent(map.parent, 'dblclick', doubleClick);
            return handler;
        };

        handler.remove = function() {
            MM.removeEvent(map.parent, 'dblclick', doubleClick);
        };

        return handler;
    };

    easey_handlers.MouseWheelHandler = function() {
        var handler = {},
            map,
            _zoomDiv,
            ea = easey(),
            prevTime,
            precise = false;

        function mouseWheel(e) {
            var delta = 0;
            prevTime = prevTime || new Date().getTime();

            try {
                _zoomDiv.scrollTop = 1000;
                _zoomDiv.dispatchEvent(e);
                delta = 1000 - _zoomDiv.scrollTop;
            } catch (error) {
                delta = e.wheelDelta || (-e.detail * 5);
            }

            // limit mousewheeling to once every 200ms
            var timeSince = new Date().getTime() - prevTime;

            function dispatchZoomed() {
                map.dispatchCallback('zoomed');
            }

            if (!ea.running()) {
              var point = MM.getMousePoint(e, map),
                  z = map.getZoom();
              ea.map(map)
                .easing('easeOut')
                .to(map.pointCoordinate(MM.getMousePoint(e, map)).zoomTo(z + (delta > 0 ? 1 : -1)))
                .path('about').run(100, dispatchZoomed);
                prevTime = new Date().getTime();
            } else if (timeSince > 150){
                ea.zoom(ea.to().zoom + (delta > 0 ? 1 : -1)).from(map.coordinate).resetRun();
                prevTime = new Date().getTime();
            }

            // Cancel the event so that the page doesn't scroll
            return MM.cancelEvent(e);
        }

        handler.init = function(x) {
            map = x;
            _zoomDiv = document.body.appendChild(document.createElement('div'));
            _zoomDiv.style.cssText = 'visibility:hidden;top:0;height:0;width:0;overflow-y:scroll';
            var innerDiv = _zoomDiv.appendChild(document.createElement('div'));
            innerDiv.style.height = '2000px';
            MM.addEvent(map.parent, 'mousewheel', mouseWheel);
            return handler;
        };

        handler.precise = function(x) {
            if (!arguments.length) return precise;
            precise = x;
            return handler;
        };

        handler.remove = function() {
            MM.removeEvent(map.parent, 'mousewheel', mouseWheel);
            _zoomDiv.parentNode.removeChild(_zoomDiv);
        };

        return handler;
    };

    easey_handlers.DragHandler = function() {
        var handler = {},
            map,
            panner;

        function focusMap(e) {
            map.parent.focus();
        }

        function mouseDown(e) {
            if (e.shiftKey || e.button == 2) return;
            MM.addEvent(document, 'mousemove', mouseMove);
            MM.addEvent(document, 'mouseup', mouseUp);
            panner.down(e);
            map.parent.style.cursor = 'move';
            return MM.cancelEvent(e);
        }

        function mouseMove(e) {
            panner.move(e);
            return MM.cancelEvent(e);
        }

        function mouseUp(e) {
            MM.removeEvent(document, 'mousemove', mouseMove);
            MM.removeEvent(document, 'mouseup', mouseUp);
            panner.up();
            map.parent.style.cursor = '';
            return MM.cancelEvent(e);
        }

        handler.init = function(x) {
            map = x;
            MM.addEvent(map.parent, 'click', focusMap);
            MM.addEvent(map.parent, 'mousedown', mouseDown);
            panner = panning(map);
        };

        handler.remove = function() {
            MM.removeEvent(map.parent, 'click', focusMap);
            MM.removeEvent(map.parent, 'mousedown', mouseDown);
            panner.up();
            panner.remove();
        };

        return handler;
    };


    function panning(map, drag) {

        var p = {};
        drag = drag || 0.15;

        var speed = { x: 0, y: 0 },
            dir = { x: 0, y: 0 },
            removed = false,
            nowPoint = null,
            oldPoint = null,
            moveTime = null,
            prevMoveTime = null,
            animatedLastPoint = true,
            t,
            prevT = new Date().getTime();

        p.down = function(e) {
            nowPoint = oldPoint = MM.getMousePoint(e, map);
            moveTime = prevMoveTime = +new Date();
        };

        p.move = function(e) {
            if (nowPoint) {
                if (animatedLastPoint) {
                    oldPoint = nowPoint;
                    prevMoveTime = moveTime;
                    animatedLastPoint = false;
                }
                nowPoint = MM.getMousePoint(e, map);
                moveTime = +new Date();
            }
        };

        p.up = function() {
            if (+new Date() - prevMoveTime < 50) {
                dt = Math.max(1, moveTime - prevMoveTime);
                dir.x = nowPoint.x - oldPoint.x;
                dir.y = nowPoint.y - oldPoint.y;
                speed.x = dir.x / dt;
                speed.y = dir.y / dt;
            } else {
                speed.x = 0;
                speed.y = 0;
            }
            nowPoint = oldPoint = null;
            moveTime = null;
        };

        p.remove = function() {
            removed = true;
        };

        function animate(t) {
            var dt = Math.max(1, t - prevT);
            if (nowPoint && oldPoint) {
                if (!animatedLastPoint) {
                    dir.x = nowPoint.x - oldPoint.x;
                    dir.y = nowPoint.y - oldPoint.y;
                    map.panBy(dir.x, dir.y);
                    animatedLastPoint = true;
                }
            } else {
                // Rough time based animation accuracy
                // using a linear approximation approach
                speed.x *= Math.pow(1 - drag, dt * 60 / 1000);
                speed.y *= Math.pow(1 - drag, dt * 60 / 1000);
                if (Math.abs(speed.x) < 0.001) {
                    speed.x = 0;
                }
                if (Math.abs(speed.y) < 0.001) {
                    speed.y = 0;
                }
                if (speed.x || speed.y) {
                    map.panBy(speed.x * dt, speed.y * dt);
                }
            }
            prevT = t;
            if (!removed) MM.getFrame(animate);
        }

        MM.getFrame(animate);
        return p;
    }


    this.easey_handlers = easey_handlers;

})(this, MM);
