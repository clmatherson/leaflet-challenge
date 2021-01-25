const centerUS = [39.5, -98.35]

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url = "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";

// add the light layer tile 
var lightLayer = L.tileLayer(url, {
  attribution: attribution,
  maxZoom: 13,
  id: "light-v10",
  accessToken: API_KEY
});

var darkLayer = L.tileLayer(url, {
  attribution: attribution,
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var streetLayer = L.tileLayer(url, {
  attribution: attribution,
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
});
  
var satelliteStLayer = L.tileLayer(url, {
  attribution: attribution,
  maxZoom: 18,
  id: "satellite-streets-v11",
  accessToken: API_KEY
});
  
var baseMaps = {
  Light: lightLayer,
  Dark: darkLayer,
  Street: streetLayer,
  Satellite: satelliteStLayer,
};

// create the base map
var myMap = L.map("map", {
  center: centerUS,
  zoom: 5,
  layers: [lightLayer],
});

L.control.layers(baseMaps).addTo(myMap);

// create a function that changes marker size depending on the magnitute values
function markerSize(mag){
  return mag * 5
}
function getColors(mg) {
  if (mg < 1){
    return "green"
  }
  else if (mg < 2){
    return "yellow"
  }
  else if (mg < 3){
    return "pink"
  }
  else if (mg < 4){
    return "blue"
  }
  else if (mg < 5 ){
    return "red"
  }
  else {
    return "black"
  }
};

function createCircleMarker(feature, latlng){
  var markerOptions = {
    fillOpacity: 0.75,
    color: "white",
    fillColor: getColors(feature.properties.mag),
    radius: markerSize(feature.properties.mag),
  }
  return L.circleMarker(latlng, markerOptions);
};

d3.json(queryUrl, function(data) {
  var earthquakes = data.features
  
  earthquakes.forEach(function(quakes){
    L.geoJSON(quakes,{
      pointToLayer: createCircleMarker
    }).bindPopup(`
    <h2>Date: ${new Date(quakes.properties.time)}</h2>
    <hr/>
    <h3>Place: ${quakes.properties.place}</h3>
    <h2>Magnitude: ${quakes.properties.mag}</h2>
    `
    ).addTo(myMap)
});

// Create legend
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  grades = [0, 1, 2, 3, 4, 5],
  labels = ["Micro", "Minor", "Light", "Moderate", "Strong", "Major"];
  
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
    `<span style="height: 10px; width: 10px; background-color: ${getColors(i)}; border-radius: 50%;display: inline-block;"></span>`
     + ' | ' + labels[i] + ' | '  + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap);
});