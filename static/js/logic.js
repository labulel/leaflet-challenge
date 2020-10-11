

// Creating map object
// var myMap = L.map("mapid", {
//     center: [40.7128, -74.0059],
//     zoom: 11
//   });
  
//   // Adding tile layer
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   }).addTo(myMap);


  
  // // Use this link to get the geojson data.
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    console.log(data)
      // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

  });

  // function styles()
    // Conditionals for countries points
    
    
    function getcolor(x){
    var color = "";
    if (x>= 20) {
      color = "green";
    }

    else if (x >= 15 & x <20) {
      color = "yellow";
    }

    else if (x >= 10 & x <15) {
      color = "orange";
    }

    else {
      color = "red";
    }
    return color
  }
  


  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array

    function onEachFeature(feature, layer) {

    //draw circles based on magnitude

    // Give each feature a popup describing the place and time of the earthquake
      layer.bindPopup("<h3>" + "Magnitude: " + feature.properties.mag + "; " + "Depth: " + feature.geometry.coordinates[2]+
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,

      pointToLayer: function(feature,latlng){
        var depth = feature.geometry.coordinates[2]
        var featurecolor = getcolor(depth)
  
        var mag = feature.properties.mag
        
        return L.circleMarker(latlng, {
          stroke: false,
          fillOpacity: 0.75,
          radius:mag*5,
          color:featurecolor
        })
        
      }

    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  
function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}