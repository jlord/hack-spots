# Easing

Easing is moving from one point or zoom to another in a fluid motion, instead of just 'popping' from
place to place. It's useful for map-based storytelling, since users get a better idea of geographical
distance.

## mapbox.ease()

**Returns** an easey object, which has the following methods:

### ease.map(map)

Specify the map to be used.

**Arguments:**

* `map` is an instance of `mapbox.map()` or `MM.Map`

**Returns** the easey object.

### ease.from(coord)

Set the starting coordinate for the easing. You don't usually need to call this, because easings default to the current coordinate.

**Arguments:**

* `coord` is an instance of `MM.Coordinate` representing the starting coordinate for the easing.

**Returns** the easey object.

### ease.to(coord)

Set the destination coordinate for the easing. 

**Arguments:**

* `coord` is an instance of `MM.Coordinate` representing the destination coordinate for the easing. 

Since easey deals exclusively in Coordinates, [the reference for converting between points, locations, and coordinates in Modest Maps is essential reading](https://github.com/stamen/modestmaps-js/wiki/Point,-Location,-and-Coordinate).

**Returns** the easey object.

### ease.zoom(level)

Set the zoom level of the `to` coordinate that easey is easing to.

**Arguments:**

* `level` is a number representing the zoom level

**Returns** the easey object.

### ease.optimal([V] [,rho] [,callback])

Eases to `from` in the smoothest way possible, automatically choosing run time based on distance. The easing zooms out and in to optimize for the shortest easing time and the slowest percieved speed. The optional arguments are as defined in *[Smooth and efficient zooming and panning](http://www.cs.ubc.ca/~tmm/courses/cpsc533c-04-spr/readings/zoompan.pdf)*.

**Arguments:**

* `V` inversely affects the speed (default is 0.9) 
* `rho` affects the sensitivity of zooming in and out (default 1.42)
* `callback` is a function that gets called after the animation completes.

**Returns** the easey object.

### ease.location(location)

Sets the `to` coordinate to the provided location.

**Arguments:**

* `location` is an object with `lat` and `lon` properties, or an instance of `MM.Location`.

**Returns** the easey object.

### ease.t(value)

Set the map to a specific point in the easing.

**Arguments:**

* `value` is a float between 0 and 1, where 0 is `from` and 1 is `to`.

**Returns** the easey object.

### ease.future(parts)

Get the future of an easing transition, given a number of parts for it to be divided over. This is a convenience function for calling `easey.t()` a bunch of times.

**Arguments:**

* `parts` is an positive integer representing the number of parts to divide the easing into.

**Returns** an array of `MM.Coordinate` objects representing each in-between location.

### ease.easing(name)

Set the easing curve - this defines how quickly the transition gets to its end and whether it speeds up or slows down near the beginning
and end.

**Arguments:**

* `name` is the string name of the easing to use. Current options are:
    * 'easeIn'
    * 'easeOut'
    * 'easeInOut'
    * 'linear'

**Returns** the easey object.

### ease.path(pathname)

Set the type of path - the type of interpolation between points.

**Arguments:**

* `pathname` is a string name of the path to use. Current options are:
    * `screen`: a 'straight line' path from place to place - in the Mercator projection, this is a rhumb line
    * `about`: the default path for a double-click zoom: this keeps a single coordinate in the same screen pixel over the zoom transition

**Returns** the easey object.

### ease.run([time [, callback])

Start an _animated ease_. Both parameters are optional.

**Arguments:**

* `time` is an integer representing the duration of the easing in milliseconds (default is 1000).
* `callback` is a Javascript function that is called when the map has reached its destination.

**Returns** the easey object.

### ease.running()

**Returns** `true` or `false` depending on whether easey is currently animating the map.

### ease.stop([callback])

Abort the currently running animation.

**Arguments:**

* `callback` is a function to be called after the previous animation has been successfully stopped.

**Returns** the easey object.
