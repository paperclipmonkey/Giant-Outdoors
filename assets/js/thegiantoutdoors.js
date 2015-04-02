    $(function(){

      $("#btndig, #btnexplore").click(function(){
        $(".btnswitch").addClass("btn-fill");
        $(this).removeClass("btn-fill");
        if($(this).attr('id') == "btndig"){
          mapm.switchModes("dig");
        } else {//Explore
          mapm.switchModes("explore");
          showHideMarkers();
        }
      });

      $("#checkboxes-photo").on('change',function(){$('.fileupload-group').toggle()});
      $("#checkboxes-text").on('change',function(){$('.textarea-group').toggle()});
      $(".btn-upload-add").click(function(){
        $('#add-form').submit();
        // $(this).addClass('active');
        // $(this).find('.txt').text("Sending...");
      });

      $("#slider2").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 100,
        change: function( event, ui ) {
          sliderUpdater(ui.value);
        },
        slide: function( event, ui ) {
          sliderUpdater(ui.value);
        }
      });

      // $("#slider2").slider(
      //   'value',
      //   $("#slider2").slider('value')
      // );

      function sliderUpdater(val){

          var epoch = getEpochFromPercent(val, epochData);

          if(epoch == window.currentEpoch){
            return;
          }

          window.currentEpoch = epoch;

          var startADBC, endADBC;
          if(epoch.dateStart < 0){
            startADBC = "BC";
          } else {
            startADBC = "AD";
          }

          if(epoch.dateEnd < 0){
            endADBC = "BC";
          } else {
            endADBC = "AD";
          }

          $("#slidertitle .inner").html(epoch['name'] + ' ' + Math.abs(epoch.dateStart) + ' ' + startADBC + ' &#8212; ' + Math.abs(epoch.dateEnd) + ' ' + endADBC);//" <i data-original-title class=\"fa fa-info-circle\" data-toggle=\"popover\" data-trigger=\"hover\" title=\"" + epoch.name + "\" data-content=\"" + epoch.description + "\" data-placement=\"top\"></i>"
          //$('i').popover();

          var range = [epoch.dateStart, epoch.dateEnd];
          //Get epoch from lookup

          //Range needs to be from +1 to -1
          showHideMarkers(range);
      }

      window.sliderUpdater = sliderUpdater;

      function getEpochFromPercent(perc, epochs){
        var epochi = 0;
          while(epochi < epochs.length){
            if(perc <= epochs[epochi].percentageStart && perc >= epochs[epochi].percentageEnd){
              return epochs[epochi];
            }
            epochi++;
          }
        return epochs[0];
      }

      $('#sliderholder').mousedown(function(e){
        return false;
      });

    });//Jquery ready function

    var markers;
    function initMap(){
      mapm.init();
      loadMarkers();

      mapm.oms.addListener('click', omsClickHandler);

      //Add walks layer
      addWalkLayers(mapm.layers.walks);

      mapm.switchModes('explore');//Set up default page
      showHideMarkers();

      showIntroMenuHover(0);
    }

    function showIntroMenuHover(num){
      $($('.modebuttons a').get(num)).tooltip('show');
      setTimeout(function() {
        $($('.modebuttons a').get(num)).tooltip('hide');
        if(num < $('.modebuttons a').length){
          showIntroMenuHover(num + 1);
        }
      }, 2500);//2.5 seconds
    }

    function addWalkLayers (walkLGrp) {
      function walkClicked(marker){
        var props = marker.target.feature.properties;
        mapm.sidebar.show();
        $("#walkholder").show();
        $("#walkholder .title").text(props.title);
        $("#walkholder .subtitle").text(props.subtitle);
        $("#walkholder .description").text(props.description);
        $("#walkholder .start").text(props.start);
        $("#walkholder .end").text(props.end);
        $("#walkholder .distance").text(props.distance);
        $("#walkholder .parking").text(props.parking);
        $("#walkholder .photo").attr("src", "assets/content/" + props.photo);
        $("#walkholder .difficulty").text(props.difficulty);
        $("#walkholder .gpx").attr("href","assets/geojson/" + props.gpx);
        $("#walkholder .kml").attr("href", "assets/geojson/" + props.kml);
        this.feature.properties;
      }

      function onEachWalk(feature, layer) {
          layer.bindLabel("Click to view " + feature.properties.title);
          layer.on('click', walkClicked);
      }

      var walkStyleBase = {
          color: '#f00',
          weight: 10,
          opacity: 0
      };

      var walkStyleOdd = {
          color: '#f2822f',
          weight: 4,
          opacity: 1,
          dashArray: '10, 5'
      };

      var walkStyleEven = {
          color: '#ea5994',
          weight: 4,
          opacity: 1,
          dashArray: '10, 5'
      };

      walkLGrp.addLayer(
       L.geoJson(walk1, {
        style: walkStyleBase,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk1, {
        style: walkStyleOdd,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk2, {
        style: walkStyleBase,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk2, {
        style: walkStyleEven,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk3, {
        style: walkStyleBase,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk3, {
        style: walkStyleOdd,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk4, {
        style: walkStyleBase,
        onEachFeature: onEachWalk
      }));

      walkLGrp.addLayer(
       L.geoJson(walk4, {
        style: walkStyleEven,
        onEachFeature: onEachWalk
      }));
    }

    function omsClickHandler(marker) {
      //Show element
      if (marker.feature.properties) {
        var props = marker.feature.properties;
        var htmlString = "";
        var extraProps = {};

        if(props.Marker == "Plant"){
          /*
            "SpeciesName":"Agrostis stolonifera",
            "CommonName":"Florin or Creeping Bent",
            "Yr":2014,
            "FullDate":"05-Jul-14",
            "Image":"CF003267.jpg",
            "Description":"Very common throughout Cornwall and the Isles of Scilly, Creeping Bent is found in a wide variety of damp or wet habitats including marshes, moorland, dune slacks, damp coastal grassland and in flush, or seepage, sites on cliffs. It may also be found on road verges, in gardens, at margins of arable fields, in waste places and, rarely, on the top of old mortared walls.",
            "Recorder":"DR C.N. FRENCH",
            "Marker":"Plant",
            "Code":"CF412779"
          */
          if(props.Image && props.Image != undefined){
            if(typeof props.Image === "object"){//Array of images
              for (var i = 0; i < props.Image.length; i++) {
                htmlString += "<img class='width100' src='assets/content/plants/" + props.Image[i] + "'/>";
              };
            } else {
              htmlString += "<img class='width100' src='assets/content/plants/" + props.Image + "'/>";
            }
          }
          htmlString += "<h4>" + props["CommonName"] + "</h4>";
          htmlString += "<h5>" + props["SpeciesName"] + "</h5>";
          htmlString += "<p>" + props.Description + "</p>";
          htmlString += "<h6>Recorded " + props.Yr + "</h6>";

        } else {//End plant
          if(props.YouTube){
            htmlString += "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + props.YouTube + "\" frameborder=\"0\" allowfullscreen></iframe>";
            extraProps.className = "x-wide-popup"
          }
          if(props.Sketchfab){
            htmlString += "<iframe width=\"400\" height=\"300\" src=\""+ props.Sketchfab + "/embed\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" onmousewheel=\"\"></iframe>\
              <p style=\"font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;\">\
              </p>";
            extraProps.className = "wide-popup"
          } else if(props.Image && props.Image != undefined){
            if(typeof props.Image === "object"){//Array of images
              for (var i = 0; i < props.Image.length; i++) {
                htmlString += "<img class='width100' src='assets/content/" + props.Image[i] + "'/>";
              };
            } else {
              htmlString += "<img class='width100' src='assets/content/" + props.Image + "'/>";
            }
          }
          htmlString += "<h4>" + props.Title + "</h4>" +
              "<p>" + props.Description + "</p>";
          if(props.URL){
            htmlString += "<a href=" + props.URL + " target=\"_BLANK\">find out more...</a>";
          }
          if(props.Tags){
            htmlString += "<div class=\"tags " + props["Marker Type"] + "\">";
              for (var i = 0; i < props.Tags.length; i++) {
                htmlString += "<span>" + props.Tags[i] + "</span>";
              };
            htmlString += "</div>";
          }
        }//End not plant
        
        htmlString += "<div class=\"share\">";
        htmlString += "<a href='#' class=\"share facebook\"><i class=\"button share facebook\"></i></a>";
        htmlString += "<a href='#' class=\"share twitter\"><i class=\"button share twitter\"></i></a>";
        htmlString += "</div>";

        var popup = new L.popup(extraProps);
        popup.setContent(htmlString);
        popup.setLatLng(marker.getLatLng());
        mapm.map.openPopup(popup);

        //Take hash and insert in to address
        if(props.HashCode){
          window.location.hash = props.HashCode;
        }
      }
    }

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });

    /**
    * Share to fb using URL
    * Redirect user to Facebook share URL
    */
    $(document).on("click", ".share.facebook", function(e){
      e.preventDefault();
      window.location = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location);
    });

    /**
    * Share to Twitter using URL
    * Redirect user to Twiter share URL
    */
    $(document).on("click", ".share.twitter", function(e){
      e.preventDefault();
      window.location = "http://www.twitter.com/share?url=" + encodeURIComponent(window.location);
    });    

    $('.btn-tooltip').tooltip();
    $('.label-tooltip').tooltip();
    $('.pick-class-label').click(function(){
        var new_class = $(this).attr('new-class');  
        var old_class = $('#display-buttons').attr('data-class');
        var display_div = $('#display-buttons');
        if(display_div.length) {
          var display_buttons = display_div.find('.btn');
          display_buttons.removeClass(old_class);
          display_buttons.addClass(new_class);
          display_div.attr('data-class', new_class);
        }
    });   

    function addLayerMarkersToOms(layers){
      //console.log(layers);
      //var layer;
      for(x in layers){
        drillOverlay(layers[x]);
      }
    } 

    function drillOverlay(layer){
      if(layer.eachLayer){//It's an LayerGroup - Drill!
        layer.eachLayer(function(eLayer){
          drillOverlay(eLayer);
        });
      }
      else{
        mapm.oms.addMarker(layer);
      }
    }

    function makeMarker(iconsArr, name){
      iconsArr[name] = L.icon({
        iconUrl: 'assets/img/marker-' + name + '.png',
        iconRetinaUrl: 'assets/img/marker-' + name + '-2x.png',
        shadowUrl: 'assets/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, 0]
      });
    }

    function loadMarkers(){
      //Define marker icons that can be used
      var markerIcons = {};

      markerTypes = ['orange', 'brown', 'green', 'blue', 'purple', 'white'];

      for (var i = 0; i < markerTypes.length; i++) {
        makeMarker(markerIcons, markerTypes[i]);
      };

      mapm.layers._markers.find.addLayer(L.geoJson(finds, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.brown});
        }
      }));

      mapm.layers._markers.other.addLayer(L.geoJson(other, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.orange});
        }
      }));

      mapm.layers._markers.keysite.addLayer(L.geoJson(keysites, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.white});
        }
      }));

      mapm.layers._markers.added.addLayer(L.geoJson(added, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.blue});
        }
      }));

      mapm.layers._markers.memories.addLayer(L.geoJson(memories, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.purple});
        }
      }));

      mapm.layers._markers.plant.addLayer(L.geoJson(plants, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {icon: markerIcons.green});
        }
      }));

      addLayerMarkersToOms(mapm.layers.markers);
    }


    function showHideMarkers(dates){
      mapm.oms.clearMarkers();
      //Remove all markers from display layer
      for(x in  mapm.layers.markers){
        var layer = mapm.layers.markers[x];
        layer.clearLayers();//Clears LayerGroup
      }

      //Go through all data layers and add correct data to display layers
      for(x in mapm.layers._markers){
        var layer = mapm.layers._markers[x];
        //Filter
        layer.eachLayer(function(markG){
          markG.eachLayer(function(mark){
            if(filterMarker(dates, mark)){
              mapm.layers.markers[x].addLayer(mark);
            }
          });
        });
      }

      //Re-add all displayed markers to OMS
      for(x in mapm.layers.markers){
        var layer = mapm.layers.markers[x];
        layer.eachLayer(function(mark){
          mapm.oms.addMarker(mark);
        });
      }

    }

    function filterMarker(dates, feature){
      feature = feature.feature;
      if(! feature.properties){
        return true;
      }
      var props = feature.properties;
      if(typeof dates != 'object'){
        return true;
      }

      if(!props.StartDate || !props.EndDate){
        return false;
      }

      if(props.StartDate <= dates[1] && dates[0] <= props.EndDate){
        return true;
      } else {
        return false;
      }
    }

    function showMarkerFromId(Id){
      //Search all markers trying to find correct Id
      //Show correct one.
      for(x in mapm.layers.markers){
        var layer = mapm.layers.markers[x];
        layer.eachLayer(function(mark){
          if(mark.feature.properties.HashCode == Id){
            mark.fire('click');//Opens any 
            mark.fire('click');//opens
          }
        });
      }

    }

    $(function(){
        if(location.hash!=""){
          introVideo.end();
          initMap();
          var StrippedHash = location.hash.replace("#", "");
          showMarkerFromId(StrippedHash);
        }
        //Start it all off
        introVideo.onEnd(function(){
          initMap();
        });
    });