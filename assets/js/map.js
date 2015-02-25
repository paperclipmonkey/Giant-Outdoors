(function(){
	var expo = {};

    function init(){
        expo.map = L.map('mapdiv', '', {zoomControl: false});

        if (!expo.map.restoreView()) {//Load map from previous state - Remembered between loads
          expo.map.setView([50.188214, -5.293300], 18);//Set default map state
        }

        L.edgeMarker().addTo(expo.map);

        expo.sidebar = L.control.sidebar('walkholder', {
            position: 'left'
        });

        expo.map.addControl(expo.sidebar);

        expo.oms = new OverlappingMarkerSpiderfier(expo.map, {keepSpiderfied: true});

        expo.layers.satellite = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kggafd49/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 22,
            maxNativeZoom: 19
        }).addTo(expo.map);

        expo.layers.road = L.tileLayer('http://{s}.tiles.mapbox.com/v3/paperclipmonkey.kgon2gjp/{z}/{x}/{y}.png', {
            attribution: 'Road map &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'});

        expo.layers.old = L.tileLayer('http://nls-1.tileserver.com/os_6_inch_gb/{z}/{x}/{y}.jpg', {
            //subdomains ['',''],
            opacity: 0.5,
            attribution: 'OS Map provided by; <a href="http://maps.nls.uk/os/6inch-england-and-wales/index.html">NLS</a>'
        });

        expo.layers.geology = L.tileLayer.wms('http://ogc.bgs.ac.uk/cgi-bin/BGS_Bedrock_and_Superficial_Geology/wms?', {
          format: 'image/png',
          transparent: true,
          layers: 'GBR_BGS_625k_BA',
          attribution: "BGS",
          opacity: 0.5,
          //maxZoom: 13,
          //minZoom: 13,
          //minNativeZoom: 13
        });

        expo.layers.archaeology = L.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
            //opacity: 1.0,
            //subdomains ['',''],
            maxZoom: 30,
            minNativeZoom: 20,
            maxNativeZoom: 25,
            attribution: 'archaeology layer by: <a href="http://www.cornwall.gov.uk/cau">CAU</a>'
        });

        expo.layers.walks = L.featureGroup();

        expo.layers.markers = {
          'other': L.featureGroup().addTo(expo.map),
          'find': L.featureGroup().addTo(expo.map),
          'plant': L.featureGroup(),
          'keysite': L.featureGroup().addTo(expo.map),
          'memories': L.featureGroup().addTo(expo.map),
          'added': L.featureGroup().addTo(expo.map)
        };

        expo.layers._markers = {
          'other': L.featureGroup(),
          'find': L.featureGroup(),
          'plant': L.featureGroup(),
          'keysite': L.featureGroup(),
          'memories': L.featureGroup(),
          'added': L.featureGroup()
        };


        var quoitIcon = L.icon({
            iconUrl: 'assets/img/quoit-shape.png',
            // iconRetinaUrl: 'my-icon@2x.png',
            iconSize: [75, 38],
            iconAnchor: [50, 25],
            popupAnchor: [-3, -50],
            //opacity: 1.0,
            // shadowUrl: 'my-icon-shadow.png',
            // shadowRetinaUrl: 'my-icon-shadow@2x.png',
            // shadowSize: [68, 95],
            // shadowAnchor: [22, 94]
        });

        var m = L.marker([50.188214, -5.293300], {icon: quoitIcon}).addTo(expo.map);

        var baseLayers = [
          {
            name: "Satellite",
            layer: expo.layers.satellite
          },
          { 
            name: "Road",
            layer: expo.layers.road
          }
          // {
          //   name: "Archaeology",
          //   layer: expo.layers.archaeology,
          // },
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
              // { 
              //   name: "Geology",
              //   layer: expo.layers.geology,
              //   opacity: true
              // }
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
              }
            ]
          }
        ];

        var panelLayers = new L.Control.PanelLayers(baseLayers, overlayLayers, {collapsed: true});
        expo.map.addControl(panelLayers);
    }8

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