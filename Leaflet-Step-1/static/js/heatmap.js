const centerUS = [39.5, -98.35]

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var attribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

var myMap = L.map("map", {
  center: centerUS,
  zoom: 4
});

L.tileLayer(url, {
  attribution: attribution,
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl, function(data) {

  console.log(data.features[0].geometry.coordinates);

  var heatArray = [];
  var count = Object.keys(data.features).length;

  for (var i = 0; i < count; i++) {
    var location = data.features[i].geometry.coordinates;

    if (location) {
      heatArray.push([location[1], location[0]]);
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});