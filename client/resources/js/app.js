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

  map = L.map(idMap, {
    center: [0, 0],
    zoom: 3,
    zoomControl: true,
    layers: [mapboxTiles]
  });

  layerControl = L.control.layers({"Mapbox": mapboxTiles}, {}, {collapsed:false}).addTo(map);

  L.control.locate({
    strings: {
      title: "Encuéntrame"
    }
  }).addTo(map);

  dataLayer = L.featureGroup().addTo(map);
}


function addLayerFromDirectory(directoryName, center){
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

   if(center)
    map.fitBounds(dataLayer.getBounds());
  });
}

$(function(){
  initMap("map");

  addLayerFromDirectory("FMB", false);
  addLayerFromDirectory("Monterrey", false);
  addLayerFromDirectory("Puebla", true);
});
