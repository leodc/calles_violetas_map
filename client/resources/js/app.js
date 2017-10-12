var map;
var dataLayer;
var layerControl;


var iconMarker = L.AwesomeMarkers.icon({
  icon: 'podcast',
  prefix: 'fa',
  markerColor: 'purple'
});


function initMap(idMap){
  var mapboxTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
  });
  
  // mapbox satellite streets
  var mapboxSatelliteTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
  });

  map = L.map(idMap, {
    center: [0, 0],
    zoom: 3,
    zoomControl: true,
    layers: [mapboxSatelliteTiles]
  });

  layerControl = L.control.layers({"Mapbox Satellite": mapboxSatelliteTiles, "Mapbox": mapboxTiles}, {}, {collapsed:false}).addTo(map);

  L.control.locate({
    strings: {
      title: "Encuéntrame"
    }
  }).addTo(map);

  dataLayer = L.featureGroup().addTo(map);

  map.fitBounds(L.latLngBounds({"lat":16.214674588248556,"lng":-112.03857421875}, {"lat":29.305561325527698,"lng":-87.31933593750001}));
}


function addLayerFromDirectory(directoryName){
  var url = "resources/data/" + directoryName + "/";

  var auxLayer;
  $.get( url + "noteLocations.gpx", function(result){
    var jsonResult = $.xml2json(result);

    var audioPrefix = "<p><audio width='300' height='32' src='";
    var audioSuffix = "' controls='controls'><br />Your browser does not support the audio element.<br /></audio></p>";

    auxLayer = L.featureGroup().addTo(dataLayer);
    var poi;
    for (var i = 0; i < jsonResult.wpt.length; i++) {
      poi = jsonResult.wpt[i];
      
      L.marker([poi.lat, poi.lon], {icon: iconMarker}).addTo(auxLayer).bindPopup(audioPrefix + url + poi.link.href + audioSuffix);
   }

   layerControl.addOverlay(auxLayer, directoryName);
  });
}

$(function(){
  initMap("map");

  addLayerFromDirectory("Barrio antiguo Monterrey 2017");
  addLayerFromDirectory("Ex-Convento Churubusco Coyoacan CDMX 2017");
  addLayerFromDirectory("Puebla 2017");
  addLayerFromDirectory("San Pablo Merced CDMX 2017");
});

/*global $ L*/
