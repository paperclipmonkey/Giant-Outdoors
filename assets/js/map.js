(function(){
	var expo = {};
	expo.map = L.map('map', '', {zoomControl: false}).setView([50.188214, -5.293300], 18);
    expo.oms = new OverlappingMarkerSpiderfier(map);


	expo.switchModes = function(mode){
        //Hide all of the things
        $("#sliderholder").hide();
        $("#walkholder").hide();
        //Hide overlays
        mapm.map.removeLayer(mapm.layers.walks);
        console.log(mode + 'Modehere');
        if(mode == "dig"){
          $("#sliderholder").show();
          //Show timebar
          //Add dig data
        } else if (mode == "explore"){
          //$("#walkholder").show();//Only show when clicked on
          mapm.map.addLayer(mapm.layers.walks);
          mapm.map.setZoom(14);
          //Show walk information
          //Add walk data
        }
    };

    expo.layers = {};
    expo.layers.satellite = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kggafd49/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(expo.map);

    expo.layers.road = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kgon2gjp/{z}/{x}/{y}.png', {
        attribution: 'My road map &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'});

    expo.layers.current = "satellite";

    var myIcon = L.icon({
        iconUrl: 'assets/img/quoit-shape.png',
        // iconRetinaUrl: 'my-icon@2x.png',
        iconSize: [75, 38],
        iconAnchor: [50, 25],
        popupAnchor: [-3, -50],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowRetinaUrl: 'my-icon-shadow@2x.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });



    var m = L.marker([50.188214, -5.293300], {icon: myIcon}).addTo(expo.map);
    window.mapm = expo;
})();