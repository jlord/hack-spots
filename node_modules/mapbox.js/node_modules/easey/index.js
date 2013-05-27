var map;

window.onload = function() {
    var mm = com.modestmaps;
    var dmap = document.getElementById('map');
    wax.tilejson('http://a.tiles.mapbox.com/v3/mapbox.mapbox-streets.jsonp',
        function(tj) {
        map = new com.modestmaps.Map(dmap,
            new wax.mm.connector(tj), null, [
                easey_handlers.DragHandler(),
                easey_handlers.TouchHandler(),
                easey_handlers.MouseWheelHandler(),
                easey_handlers.DoubleClickHandler()
            ]);
        map.setCenterZoom(new com.modestmaps.Location(-10, 50), 3);

        map.addCallback('zoomed', function() {
            // console.log(map.getZoom());
        });

        var pres = document.getElementsByTagName('pre');

        for (var i = 0; i < pres.length; i++) {
          pres[i].onclick = function() {
            eval(this.innerHTML);
          };
        }

        var scrolly = document.getElementById('scrolly');

        var positions = [
          map.locationCoordinate({ lat: 33.5, lon: 65.6 }).zoomTo(6),
          map.locationCoordinate({ lat: 33.1, lon: 44.6 }).zoomTo(6),
          map.locationCoordinate({ lat: 28.7, lon: 69.2 }).zoomTo(6)];

        var ea = easey().map(map).easing('easeInOut');

        function update() {
          var pos = scrolly.scrollTop / 200;

          ea.from(positions[Math.floor(pos)])
            .to(positions[Math.ceil(pos)])
            .t(pos - Math.floor(pos));
        }

        scrolly.addEventListener('scroll', update, false);
    });
};
