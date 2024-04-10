//create the map
let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
  });
  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//create the color gradient function
function chooseColor(depth) {
    if (depth >= 90) return "#f62626";
    else if (depth >= 70) return "#e86900";
    else if (depth >= 50) return "#ca9700";
    else if (depth >= 30) return "#a0ba00";
    else if (depth >= 10) return "#60d915";
    else return "#0fe64c";
}

// code copied from https://leafletjs.com/examples/choropleth/
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


//create function to size the visualization
function getRadius(magnitude) {
    return magnitude * 3;
}

// Get the data with d3
 d3.json(geoData).then(function(data) {
    console.log(data);

    //create the markers
    L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    //create the popups
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place +
                      "</h3><p>Depth: " + feature.geometry.coordinates[2] + " km</p>" +
                      "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(myMap);
});