var superfundjson = {"center":[-104.26714999999999,32.0361,5],"id":"tmcw.superfund_48b16e","scheme":"xyz","basename":"superfund_48b16e.mbtiles","filesize":230178816,"bounds":[-175.9859,-9.9898,-32.5484,74.062],"minzoom":0,"maxzoom":11,"name":"Superfund","description":"A Map of Superfund Sites in the USA","legend":"<a href='http://www.epa.gov/enviro/geo_data.html'>EPA</a> public data","version":"1.0.0","template":"{{#__teaser__}}<h2>{{{fac_name}}}</h2>\n<h3>{{{loc_city}}}, {{{loc_state}}}</h3>\nEPA ID: <a href='http://oaspub.epa.gov/enviro/fii_query_dtl.disp_program_facility?p_registry_id={{{reg_id}}}'>{{{reg_id}}}</a>{{/__teaser__}}{{#__full__}}<h2>{{{fac_name}}}</h2>\n<h3>{{{loc_city}}}, {{{loc_state}}}</h3>\nEPA ID: <a href='http://oaspub.epa.gov/enviro/fii_query_dtl.disp_program_facility?p_registry_id={{{reg_id}}}'>{{{reg_id}}}</a>{{/__full__}}{{#__location__}}{{/__location__}}","grids":["http://a.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.grid.json","http://b.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.grid.json","http://c.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.grid.json","http://d.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.grid.json"],"tiles":["http://a.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.png","http://b.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.png","http://c.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.png","http://d.tiles.mapbox.com/v3/tmcw.superfund_48b16e/{z}/{x}/{y}.png"],"download":"http://a.tiles.mapbox.com/v3/tmcw.superfund_48b16e.mbtiles","webpage":"http://tiles.mapbox.com/tmcw/map/superfund_48b16e"};
    var tilejsontwo = {"attribution":"<a href='http://mapbox.com/about/maps' target='_blank'>Terms & Feedback</a>","bounds":[-180,-85,180,85],"center":[0,0,3],"id":"mapbox.mapbox-streets","maxzoom":17,"minzoom":0,"name":"MapBox Streets","scheme":"xyz","tiles":["http://a.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png","http://b.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png","http://c.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png","http://d.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png"],"webpage":"http://tiles.mapbox.com/mapbox/map/mapbox-streets"};

        describe('wax interaction', function() {
    var mm_map, leaf_map;

    var globalsBefore = {};

    afterEach(function() {
        var leaked = [];
        for (var key in window) {
            if (!key in globalsBefore) {
                leaked.push(key);
            }
        }
        if (leaked.length > 0) {
            throw new Error('Leaked global variables: [' + leaked.join(', ') + ']');
        }
        if (mm_map) mm_map.destroy();
    });

    beforeEach(function() {
        for (var key in window) {
            globalsBefore[key] = true;
        }
        callbackResult = null;
        var div = document.createElement('div');
        div.style.width = '400px';
        div.style.height = '400px';

        mm_map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']));
                mm_map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
                pointselector = wax.mm.pointselector(mm_map, {}, {
                    callback: function() {
                        callbackResult = arguments;
                    }
                });


        var ldiv = document.createElement('div');
            leaf_map = new L.Map(ldiv)
            .addLayer(new wax.leaf.connector(superfundjson))
            .setView(new L.LatLng(51.505, -0.09), 1);

    });

    it('mm can be added to a map', function() {
        wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);
    });

    it('leaflet can be added to a map', function() {
        wax.leaf.interaction()
            .map(leaf_map)
            .tilejson(superfundjson);
    });

    it('can be reassigned tilejson', function() {
        var i = wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);

        expect(i.tilejson()).toEqual(superfundjson);

        i.tilejson(tilejsontwo);

        expect(i.tilejson()).toEqual(tilejsontwo);
    });

    it('gives you a formatter', function() {
        var i = wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);

        expect(typeof i.formatter().format).toEqual('function');
    });

    it('gives you a grid getter', function() {
        var i = wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);

        expect(typeof i.grid()).toEqual('function');
    });

    it('gives you a map', function() {
        var i = wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);

        expect(i.map()).toEqual(mm_map);
    });

    it('mm can be removed', function() {
        var i = wax.mm.interaction()
            .map(mm_map)
            .tilejson(superfundjson);

        expect(i.remove()).toEqual(i);
    });

    it('leaflet can be removed', function() {
        var i = wax.leaf.interaction()
            .map(leaf_map)
            .tilejson(superfundjson);

        expect(i.remove()).toEqual(i);
    });
});
