
// this is so super messy right now, sorry!

    $('.spotRow').live("click", function(event) {
  		$('.spotRow').removeClass("selectedRow")
  		console.log("clicked!")
      // get the row number from the table's class and select it
 			var rowNumber = $(this).closest("tr").attr("id")
 			$('#' + rowNumber).addClass("selectedRow")
       // filter out that rownumber from the data
 			var dataElement = Sheetsee.getMatches(gData, rowNumber, "rowNumber")
       // use icanhas to make spot detail div
 			var selectedSpot = ich.selectedSpot({ rows: dataElement })
       // swap out latest spot for selected spot with its new content
		  $('#latestSpot').css("display", "none")
		  $('#selectedSpot').html(selectedSpot).css("display", "inline")
      // grab the lat/long associated with that rownumber to
      // redraw the map
		  var selectedCoords = [dataElement[0].lat, dataElement[0].long]
      // change the marker color for this element in the geoJSON
		  matchGeoJSONbyRowNumber(rowNumber, geoJSON, gData, "#FF4646")
      // add the new marker layer, popups and reset view to zoon in more
		  var markerLayer = Sheetsee.addMarkerLayer(geoJSON, map, 13)
			addPopups(map, markerLayer)
		  map.setView(selectedCoords, 13)
 		})

  // the most recently added spot should show by default
  // and have a matching red marker
	function highlightLastMarker(geoJSON, highlightColor) {
		geoJSON[0].properties["marker-color"] = highlightColor
		return geoJSON
	}

	function addPopups(map, markerLayer) {
	  markerLayer.on('click', function(e) {
	  // 	e.layer.feature["marker-color"] = "#ff00ff"
			// map.marker(geoJSON, map, 11).addTo(map)
			$('.spotRow').removeClass("selectedRow")
	  	var rowNumber = e.layer.feature.opts.rowNumber.toString()
	  	$('#' + rowNumber).addClass("selectedRow")
	  	matchGeoJSONbyRowNumber(rowNumber, geoJSON, gData, "#FF4646")
	  	console.log(geoJSON)
	  	var markerLayer = Sheetsee.addMarkerLayer(geoJSON, map, 11)
			addPopups(map, markerLayer)
	  	var dataElement = Sheetsee.getMatches(gData, rowNumber, "rowNumber")
	  	console.log("rowNumber", rowNumber, "dataElement", dataElement)
				var selectedSpot = ich.selectedSpot({
		  	rows: dataElement
	 	 	})
	  	$('#latestSpot').css("display", "none")
	  	$('#selectedSpot').html(selectedSpot).css("display", "inline")
	    var feature = e.layer.feature
	    var popupContent = '<h2>' + feature.opts.name + '</h2>'
	    e.layer.bindPopup(popupContent,{closeButton: false,})
	  })
	}

	$('.resetMap').click(function() {
		$('.spotRow').removeClass("selectedRow")
		Sheetsee.addMarkerLayer(geoJSON, map, 11)
		$('#latestSpot').css("display", "inline")
	  $('#selectedSpot').css("display", "none")
	})

	function matchGeoJSONbyRowNumber(rowNumber, geoJSON, gdata, highlightColor) {
 		geoJSON.forEach(function (d) {
 			if (d.properties["marker-color"] === highlightColor) {
 				var origColor = gData[0].hexcolor
 				d.properties["marker-color"] = origColor
 			}

    	for (var key in d.opts) {
      	var value = d.opts[key].toString().toLowerCase()
   			if (key === 'rowNumber' && value.match(rowNumber.toString().toLowerCase())) {
     	    d.properties["marker-color"] = highlightColor
     	    return geoJSON
     		}
     	}
     })
    }
