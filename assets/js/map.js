(function(){
	var expo = {};

    function init(){
        expo.map = L.map('mapdiv', '', {zoomControl: false}).setView([50.188214, -5.293300], 18);
        expo.oms = new OverlappingMarkerSpiderfier(expo.map);

        expo.layers.satellite = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kggafd49/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(expo.map);

        expo.layers.road = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kgon2gjp/{z}/{x}/{y}.png', {
            attribution: 'Road map &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});

        expo.layers.old = L.tileLayer('http://nls-1.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg', {
            attribution: 'OS Map provided by; <a href="http://maps.nls.uk/os/6inch-england-and-wales/index.html">NLS</a>'});


        var quoitIcon = L.icon({
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

        var m = L.marker([50.188214, -5.293300], {icon: quoitIcon}).addTo(expo.map);
    }

    expo.init = init;

    expo.closePopups = function(){
        mapm.map.closePopup();
        $("#walkholder").hide();
    }

	expo.switchModes = function(mode){
        mapm.closePopups();
        //Hide all of the things
        $("#sliderholder").hide();
        $("#walkholder").hide();
        //Hide overlays
        mapm.map.removeLayer(mapm.layers.walks);
        if(mode == "dig"){
          $("#sliderholder").show();//Show timebar
          //Init timebar
          $("#slider2").slider('value', $("#slider2").slider('value'));
          //sliderUpdater($("#slider2").slider('value'));
          renderTimeLine("#sliderholder .epochholder", epochData);
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
    
    expo.layers.current = "satellite";

    window.mapm = expo;
})();