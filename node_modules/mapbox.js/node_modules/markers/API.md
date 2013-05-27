# Markers layer

`mapbox.markers` is a markers library that makes it easier to add HTML elements
on top of maps in geographical locations and interact with them. Internally,
markers are stored as [GeoJSON](http://www.geojson.org/) objects, though
interfaces through CSV and simple Javascript are provided.

## mapbox.markers.layer()

`mapbox.markers.layer()` creates a
new layer into which markers can be placed and which can be added to
a map with [`map.addLayer()`](#map.addLayer)

### markers.named([name])

Set the name of this markers layer. The default name for a `markers` layer
is `'markers'`

_Arguments:_

* `name` if given, must be a string.

_Returns_ the layer object if a new name is provided, otherwise the layer's existing name
if it is omitted.

### markers.factory([factoryfunction])

Define a new factory function, and if the layer already has points added to it,
re-render them with the new factory. Factory functions are what turn GeoJSON feature
objects into HTML elements on the map. Due to the way that markers allows multiple
layers of interactivity, factories
that want their elements to be interactive **must** either set `.style.pointerEvents = 'all'` on
them via Javascript, or have an equivalent CSS rule with `pointer-events: all` that affects
the elements.

_Arguments:_

* `factoryfunction` should be a function that takes a
  [GeoJSON feature object](http://geojson.org/geojson-spec.html#feature-objects)
  and returns an HTML element,
  or omitted to get the current value.

_Returns_ the layer object if a new factory function is provided, otherwise the layer's existing factory function

### markers.features([features])

Set the contents of a markers layer: run the provided
features through the filter function and then through the factory function to create elements
for the map. If the layer already has features, they are replaced with the new features.
An empty array will clear the layer of all features.

_Arguments:_

* `features` can be a array of [GeoJSON feature objects](http://geojson.org/geojson-spec.html#feature-objects),
  or omitted to get the current value.

_Returns_ the layer object if a new array of features is provided, otherwise the layer's features

### markers.add_feature([feature])

Add a single GeoJSON feature object to the layer.

_Arguments:_

* `features` must be a single GeoJSON feature object

_Returns_ the layer object

_Example:_

    var markerLayer = mapbox.markers.layer();
    var newfeature = {
        geometry: { coordinates: [-77, 37.9] },
        properties: { }
    };
    // add this single new feature
    markerLayer.add_feature(newfeature);
    // This call is equivalent to
     markerLayer.features(markerLayer.features().concat([x]));

### markers.sort([sortfunction])

Set the sorting function for markers in the DOM.
Markers are typically sorted in the DOM in order for them to correctly visually overlap. By default,
this is a function that sorts markers by latitude value - `geometry.coordinates[1]`.

_Arguments:_

* `sortfunction` can be a function that takes two GeoJSON feature objects and returns a number indicating
sorting direction - fulfilling the [Array.sort](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort)
interface, or omitted to get the current value.

_Returns_ the layer object if a new function is specified, otherwise the current function used to sort.

_Example:_

    // The default sorting function is:
    layer.sort(function(a, b) {
        return b.geometry.coordinates[1] -
          a.geometry.coordinates[1];
    });

### markers.filter([filterfunction])

Set the layer's filter function and refilter features. Markers can also be filtered before appearing on
the map. This is a purely presentational filter -
the underlying features, which are accessed by [`markers.features()`](#markers.features),
are unaffected. Setting a new filter can therefore cause points to be
displayed which were previously hidden.

_Arguments:_

* `filterfunction` can be a function that takes a GeoJSON feature object and returns `true`
  to allow it to be displayed or `false` to hide it, or omitted to get the current value

_Returns_ the layer object if a new function is specified, otherwise the current function used to filter.

_Example:_

    // The default filter function is:
    layer.filter(function() { return true; });

### markers.key([idfunction])

Set the key getter for this layer. The key getter is a funcion that takes a GeoJSON feature
and returns a _unique id_ for that feature. If this is provided, the layer can optimize repeated
calls to [`markers.features()`](#markers.features) for animation purposes, since updated markers will not be recreated,
only modified.

_Arguments:_

* `keyfunction` must be a function that takes a GeoJSON object and returns a unique ID for it
  that does not change for the same features on repeated calls

_Returns_ the layer object if a new function is specified, otherwise the current function used to get keys.

_Example:_

    // The default id function is:
    var _seq = 0;
    layer.key(function() { return ++_seq; });
    // Thus this function always returns a new id for any feature. If you had
    // features that do have an id attribute, a function would look like
    layer.key(function(f) { return f.properties.id; });

### markers.url(url [, callback])

Load features from a remote GeoJSON file into the layer.

_Arguments:_

* `url` should be a URL to a GeoJSON file on a server. If the server is remote, the
  GeoJSON file must be served with a `.geojsonp` extension and respond to the JSONP callback `grid`.
* `callback`, if provided, is optional and should be a callback that is called after the request finishes,
  with the error (if encountered), features array (if any) and the layer instance as arguments.
  If an error is encountered, `markers.url()` will not call `markers.features()`, since this would likely
  clear the features array.

__Returns__ the markers layer or the current URL given if no `url` argument
is provided.

### markers.id(layerid [, callback])

Load markers from a [MapBox](http://mapbox.com/) layer.

_Arguments:_

* `layerid` must be the ID of a layer, like `user.map-example`
* `callback` can be a callback that fires after the request finishes, and behaves
  the same as the callback in `markers.url`

__Returns__ the markers layer.

### markers.csv(csvstring)

Convert a string of [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) data into GeoJSON
and set layer to show it as features.
If it can find features in the CSV string, the [`markers.features()`](#markers.features)
of the layer are set to them - otherwise it will throw an error about not finding headers.

_Arguments:_

* `csvstring` must be a string of CSV data. This method returns the markers
  layer. The CSV string must include columns beginning with `lat` and `lon` in any
  case (Latitude, latitude, lat are acceptable).

_Returns_ the markers layer

### markers.extent()

Get the extent of all of the features provided.

_Returns_ an array of two `{ lat: 23, lon: 32 }` objects compatible with
the [`map.extent()`](#map.extent) call. If there are no
features, the extent is set to `Infinity` in all directions, and if there is one feature, the extent is set
to its point exactly.

### markers.addCallback(event, callback)

Add a callback that is called on certain events by this layer. These are primarily
used by [`mapbox.markers.interaction`](#mapbox.markers.interaction),
but otherwise useful to support more advanced bindings
on markers layers that are bound at times when the markers layer object may not
be added to a map - like binding to the map's `panned` event to clear tooltips.

_Arguments:_

* `event` is a string of the event you want to bind the callback to
* `callback` is a funcion that is called on the event specified by `event`

Event should be a String which is one of the following:

* `drawn`: whenever markers are drawn - which includes any map movement
* `markeradded`: when markers are added anew

Callback is a Function that is called with arguments depending on what `event` is bound:

* `drawn`: the layer object
* `markeradded`: the new marker

_Returns_ the markers layer

### markers.removeCallback(event, callback)

Remove a callback bound by `markers.addCallback(event, callback)`.

_Arguments:_

* `event` is a string of the event you want to bind the callback to
  This must be the same string that was given in `addCallback`

* `callback` is a funcion that is called on the event specified by `event`.
  This must be the same function as was given in `markers.addCallback`.

_Returns_ the markers layer

### markers.markers()

Get the layer's internal markers array. Unlike `markers.features()`, this
is not a getter-setter - you can only _get_ the internal markers. Markers
are internally objects of `{ element: DOMNode, location: Location, data: feature }`
structure, optionally with `showTooltip()` functions added by
`mapbox.markers.interaction()`.

This is direct access to the internal circuitry of markers, and should only
be used in very specific circumstances, where the functionality provided by
`markers.factory()`, `markers.filter()`, etc., is insufficient.

_Returns_ the internal array of marker objects.

## Styling markers

By default, markers use pretty styles and a default factory function. `markers.factory()`
allows for custom DOM elements as markers, which should be assigned specific CSS
in order to ensure correct placement.

All styles should position elements with `position:absolute;` and offset them
so that the center of the element is in the positioning center - thus the
geographic center. So, an element this is 40x40 should be offset by 20 pixels
up and to the left.

And in order to support mouse events - like tooltips or hover hints, you'll need to add
a rule setting the `pointer-events` property of the markers:

_Example:_

    .my-custom-marker {
        /* support pointer events */
        pointer-events:all;

        position:absolute;
        width:40px;
        height:40px;

        /* offset to keep a correct center */
        margin-left:-20px;
        margin-top:-20px;
    }

## mapbox.markers.interaction(markerslayer)

Bind interaction, hovering and/or clicking markers and seeing their details,
and customizable through its methods. This supports both mouse & touch input.

Adds tooltips to your markers, for when a user hovers over or taps the features.

This function will create at most one interaction instance per markers layer.
Thus you can use it to access interaction instances previously created and
to change their settings.

_Arguments:_

* `markerslayer` must be a markers layer.

_Returns_ an `interaction` instance which provides methods for customizing how
the layer behaves.

### interaction.remove()

Disable interactivity.

_Returns_ the interaction instance.

### interaction.add()

Enable interactivity. By default, interactivity is enabled.

_Returns_ the interaction instance.

### interaction.hideOnMove([value])

Determine whether tooltips are hidden when the map is moved.
The single argument should be `true` or `false` or not given in order to retrieve the current value.

_Arguments:_

* `value` must be true or false to activate or deactivate the mode

_Returns_ the interaction instance.

### interaction.showOnHover([value])

Determine whether tooltips are shown when the user hovers over them.
The single argument should be `true` or `false` or not given in order to retrieve the current value.

_Arguments:_

* `value` must be true or false to activate or deactivate the mode

_Returns_ the interaction instance.

### interaction.exclusive([value])

Determine whether a single popup should be open at a time, or unlimited.
The single argument should be `true` or `false` or not given in order to retrieve the current value.

_Arguments:_

* `value` must be true or false to activate or deactivate the mode

_Returns_ the interaction instance.

### interaction.formatter([formatterfunction])

Set or get the formatter function, that decides how data goes from being in a feature's `properties` to
the HTML inside of a tooltip. This is a getter setter that takes a Function as its argument.

_Arguments:_

* `formatterfunction`: a new function that takes GeoJSON features as input and returns
  HTML suitable for tooltips, or omitted to get the current value.

_Returns_ the interaction instance if a new formatter function is provided, otherwise the current formatter
function

_Example:_

    // The default formatter function
    interaction.formatter(function(feature) {
        var o = '', props = feature.properties;
        if (props.title) {
            o += '<h1 class="marker-title">' + props.title + '</h1>';
        }
        if (props.description) {
            o += '<div class="marker-description">' + props.description + '</div>';
        }
        if (typeof html_sanitize !== undefined) {
            o = html_sanitize(o,
                function(url) {
                    if (/^(https?:\/\/|data:image)/.test(url)) return url;
                },
                function(x) { return x; });
        }
        return o;
    });

## Styling tooltips

Tooltips, provided in `mapbox.markers.interaction`, are added to the map as
markers themselves, so that they are correctly geographically positioned.
You can customize the details of tooltips by changing one of the classes
in its DOM structure:

    <div class='marker-tooltip'>
        <div>
            <div class='marker-popup'>
                <div class='marker-title'>Your Marker's Title</div>
                <div class='marker-description'>Your Marker's Description</div>
            </div>
        </div>
    </div>

