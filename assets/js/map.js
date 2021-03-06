(function(){
	var expo = {};

    function init(){
        expo.map = L.map('mapdiv', '', {zoomControl: false});

        if (!expo.map.restoreView()) {//Load map from previous state - Remembered between loads
          expo.map.setView([50.188214, -5.293300], 18);//Set default map state
        }

        L.edgeMarker({
          fillOpacity:0.5
        }).addTo(expo.map);

        expo.sidebar = L.control.sidebar('leftsideholder', {
            position: 'left'
        });

        /* Turn off quoit icon at specified zoom level */
        mapm.map.on('zoomend', function(e){
          var zoomLevel = e.target.getZoom();
          if(zoomLevel > 20){//Remove Quoit icon
            expo.map.removeLayer(quoitMarker);
          } else if(!mapm.map.hasLayer(quoitMarker)) {//Add Quoit icon if not already
            expo.map.addLayer(quoitMarker);
          }
        });

        mapm.map.on('popupclose', function(){
          window.location.hash = "";//Remove the hash from the url
        });

        expo.map.addControl(expo.sidebar);

        expo.oms = new OverlappingMarkerSpiderfier(expo.map, {keepSpiderfied: true});

        expo.layers.satellite = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kggafd49/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 22,
            maxNativeZoom: 19
        }).addTo(expo.map);

        expo.layers.road = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kgon2gjp/{z}/{x}/{y}.png', {
            attribution: 'Road map &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 22,
            maxNativeZoom: 19
          });

        expo.layers.old = L.tileLayer('http://nls-{s}.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg', {
            maxZoom: 22,
            maxNativeZoom: 19,
            subdomains: "123",
            opacity: 0.5,
            attribution: 'OS Map provided by; <a href="http://maps.nls.uk/os/6inch-england-and-wales/index.html">NLS</a>'
        });

        expo.layers.geology = L.tileLayer.wms('http://ogc.bgs.ac.uk/cgi-bin/BGS_Bedrock_and_Superficial_Geology/wms?', {
          format: 'image/png',
          transparent: true,
          layers: 'GBR_BGS_625k_BA',
          attribution: "BGS",
          opacity: 0.5,
        });

        expo.layers.archaeology = L.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
            maxZoom: 30,
            minZoom: 19,
            maxNativeZoom: 25,
            attribution: 'archaeology layer by: <a href="http://www.cornwall.gov.uk/cau">CAU</a>'
        }).addTo(expo.map);

        expo.layers.walks = L.featureGroup();
        expo.layers.viscloak = L.featureGroup();

        expo.layers.markers = {
          'other': L.featureGroup().addTo(expo.map),
          'find': L.featureGroup().addTo(expo.map),
          'plant': L.featureGroup(),
          'keysite': L.featureGroup().addTo(expo.map),
          'memories': L.featureGroup().addTo(expo.map),
          'added': L.featureGroup().addTo(expo.map),
          'waypoints': L.featureGroup()
        };

        expo.layers._markers = {
          'other': L.featureGroup(),
          'find': L.featureGroup(),
          'plant': L.featureGroup(),
          'keysite': L.featureGroup(),
          'memories': L.featureGroup(),
          'added': L.featureGroup(),
          'waypoints': L.featureGroup()
        };


        var quoitIcon = L.icon({
            iconUrl: 'assets/img/quoit-up.png',
            iconSize: [75, 38],
            iconAnchor: [50, 25],
            popupAnchor: [-3, -50],
        });

        var quoitMarker = L.marker([50.18823492598261, -5.2934097312390795], {icon: quoitIcon}).addTo(expo.map);

        var baseLayers = [
          {
            group: "Maps",
            layers: [
              {
                name: "Satellite",
                layer: expo.layers.satellite
              },
              { 
                name: "Road",
                layer: expo.layers.road
              }
            ]
          }
        ];

        var overlayLayers = [
          {
            group: "Overlays",
            layers: [
              {
                name: "Old OS",
                layer: expo.layers.old,
                opacity: true
              },
              {
                name: "Archaeology",
                layer: expo.layers.archaeology,
                opacity: true
              },
              { 
                name: "Geology",
                layer: expo.layers.geology,
                opacity: true
              },
              { 
                name: "View Shed",
                layer: expo.layers.viscloak,
                opacity: true
              }
            ]
          },
          {
            group: "Markers",
            layers: [
              {
                name: "Key sites",
                layer: expo.layers.markers.keysite,
                icon: '<i class="marker-icon marker-white"></i>'
              },
              {
                name: "Other sites",
                layer: expo.layers.markers.other,
                icon: '<i class="marker-icon marker-orange"></i>'
              },
              { 
                name: "Finds",
                layer: expo.layers.markers.find,
                icon: '<i class="marker-icon marker-brown"></i>'
              },
              {
                name: "Plants",
                layer: expo.layers.markers.plant,
                icon: '<i class="marker-icon marker-green"></i>'
              },
              {
                name: "Added",
                layer: expo.layers.markers.added,
                icon: '<i class="marker-icon marker-blue"></i>'
              },
              {
                name: "Memories",
                layer: expo.layers.markers.memories,
                icon: '<i class="marker-icon marker-purple"></i>'
              },
              {
                name: "Waypoints",
                layer: expo.layers.markers.waypoints,
                icon: '<i class="marker-icon marker-pink"></i>'
              }
            ]
          }
        ];

        var panelLayers = new L.Control.PanelLayers(baseLayers, overlayLayers, {collapsed: true});
        expo.map.addControl(panelLayers);
    }

    expo.init = init;

    expo.closePopups = function(){
        mapm.map.closePopup();
        $("#leftsideholder").hide();
    }

	expo.switchModes = function(mode){
        mapm.closePopups();
        //Hide all of the things
        $("#sliderholder").hide();
        $("#leftsideholder").hide();
        //Hide overlays
        mapm.map.removeLayer(mapm.layers.walks);
        if(mode == "dig"){
          $("#sliderholder").show();//Show timebar
          //Init timebar
          $("#slider2").slider('value', $("#slider2").slider('value'));
          renderTimeLine("#sliderholder .epochholder", epochData);
          //Add dig data
        } else if (mode == "explore"){
          mapm.map.addLayer(mapm.layers.walks);
          mapm.map.setZoom(14);
        }
    };

    expo.layers = {};
    expo.layers.current = "satellite";

    window.mapm = expo;
})();