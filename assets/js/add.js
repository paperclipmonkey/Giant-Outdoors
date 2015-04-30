(function(){
	var addMap;
	var marker;

	function initialise(){
			addMap = new L.Map('addmap', {
			center: new L.LatLng(50.188214, -5.293300), 
			zoom: 15,
			zoomControl: true
		});

		L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kggafd49/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 22,
            maxNativeZoom: 19
        }).addTo(addMap);

		// Drag & Drop
		$("#adddrag").draggable({
			helper: 'clone',
			zIndex: 1000,
			containment: 'addmap',
			start: function(evt, ui) {
				//$('#box').fadeTo('fast', 0.6, function() {});
			},
			stop: function(evt, ui) {
				//$('#box').fadeTo('fast', 1.0, function() {})
				
				var top = ui.offset.top - $("#addmap").offset().top + 41;
				var left = ui.offset.left - $("#addmap").offset().left + (25/2);

				insertPoint(
					addMap.containerPointToLatLng([left, top])
				);
			}
		});
	}

	function insertPoint(position){
		//Remove all other markers
		if(typeof marker != "undefined"){
			addMap.removeLayer(marker);
		}

		var myIcon = L.icon({
		    iconUrl: 'assets/img/marker-purple.png',
		    iconRetinaUrl: 'assets/img/marker-purple-2x.png',
	        shadowUrl: 'assets/img/marker-shadow.png',
	        iconSize: [25, 41],
	        iconAnchor: [12, 41],
	        popupAnchor: [0, 0]
		});

		marker = L.marker(position, {icon: myIcon, draggable: true}).addTo(addMap);
		$('#lat').val(position.lat);
		$('#lng').val(position.lng);
	}

	window.add = {
		initialise: initialise,
	}

})();