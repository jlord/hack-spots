# Wax

Tools for improving web maps. The centerpiece of the code is a client
implementation of the [MBTiles interaction specification](https://github.com/mapbox/mbtiles-spec).

For full documentation of supported mapping APIs and how to use Wax see http://mapbox.github.com/wax.

## Versions

If you're building a new site, **use the latest [tag of Wax 6.x.x](https://github.com/mapbox/wax/tags).
Version 7 is in the `master` branch and is _unstable_.

To find more detail of what has changed in each version, consult `CHANGELOG.md`.

## Compatibility

* [Google Maps API v3](https://developers.google.com/maps/)
* [Leaflet 0.x.x](http://leaflet.cloudmade.com/)
* [Modest Maps 1.x.x](http://modestmaps.com/)
* [OpenLayers 2.11](http://openlayers.org/)
* [ESRI ArcGIS API 2.8](http://help.arcgis.com/en/webapi/javascript/arcgis/)

## Building Wax

For end users, a minified library is already provided in `dist/`.

But for developers you can rebuild a minified library by running:

    npm install --dev
    make

## Includes

Wax currently includes three externals:

* [reqwest](https://github.com/ded/reqwest) (MIT)
* [mustache.js](https://github.com/janl/mustache.js) (MIT)
* [html-sanitizer from Google Caja](http://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/html-sanitizer.js) (Apache)
