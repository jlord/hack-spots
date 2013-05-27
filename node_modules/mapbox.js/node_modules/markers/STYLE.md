# Styling markers and tooltips

`mapbox.markers` allows for total style flexibility with the `.factory()` functionality -
you make your own HTML elements and assign them their own styles. The library also supports
tooltips, which are implemented as dynamic markers of their own.

## Default markers

By default, markers uses `mapbox.markers.simplestyle_factory` to generate
markers from GeoJSON features. [simplestyle-spec](https://github.com/mapbox/simplestyle-spec/tree/master/1.0.0)
is the formal description for the attributes suggested to customize markers
this way.

* `marker-size` can be `"small"`, `"medium"`, or `"large"` for varying sizes.
* `marker-color` can be any [hex color](http://en.wikipedia.org/wiki/Web_colors#Hex_triplet),
either in full form, like `#0099cc`, or shorthand form, like `#09c`.
* `marker-symbol` can be any [Maki icon](http://mapbox.com/maki/)

The properties `title` and `description` allow for customizing
the interactivity from `mapbox.markers.interaction`, and here you're allowed to
use most HTML elements in their values.

## Custom markers

All styles should position elements with `position:absolute;` and offset them so that the center
of the element is in the geographic center. So, if you have elements that are red and 40x40, a style
like this would be appropriate, offsetting elements their own width and height

    .my-custom-marker {
        position:absolute;
        width:40px;
        height:40px;
        margin-left:-20px;
        margin-top:-20px;
    }

In order to support mouse events - like tooltips or hover hints, you'll need to add
a rule setting the `pointer-events` property of the markers:

    .my-custom-marker {
        /* support pointer events */
        pointer-events:all;

        position:absolute;
        width:40px;
        height:40px;
        margin-left:-20px;
        margin-top:-20px;
    }

## Tooltips

Tooltips, provided in `mapbox.markers.interaction`, are added to the map as markers themselves, so that they
are correctly geographically positioned. The default DOM structure for a tooltip is:

    <div class='marker-tooltip'>
        <div>
            <div class='marker-popup'>
                <div class='marker-title'>Your Marker's Title</div>
                <div class='marker-description'>Your Marker's Description</div>
            </div>
        </div>
    </div>

Markers are positioned precisely on the spot of the marker, so their positioning must compensate for: the default
technique is something like:

    .marker-tooltip {
        z-index:999999;
        position:absolute;
    }

    .marker-popup {
        position:relative;
        left:-50%;
        max-width:400px;
    }
