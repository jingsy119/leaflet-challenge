//pull all earthquakes data from the past 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//a GET request to the query URL/
d3.json(url).then(function(data) {
    console.log(data)
    
    createMap(data);
  });

function createMap(data){
  let myMap = L.map("map", {
    center: [40.59, -112.11],
    zoom: 4
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  
  features = data.features;

  for (let i = 0; i < features.length; i++){
    let location = features[i].geometry;
    let depth = location.coordinates[2];
    let magnitude = features[i].properties.mag;
    let place = features[i].properties.place;
    let date = new Date(features[i].properties.time);
    
    let color = "";
    if (depth > 90) {
      color = "red";
    }
    else if (depth > 70) {
      color = "darkorange";
    }
    else if (depth > 50) {
      color = "orange";
    }
    else if (depth > 30) {
      color = "yellow";
    }
    else if (depth > 10) {
      color = "lightgreen";
    }
    else if (depth > -10) {
      color = "green";
    }
    else {
      color = "darkgreen"
    };


    if (location){
      L.circle([location.coordinates[1], location.coordinates[0]], {
        color: "black",
        fillColor: color,
        fillOpacity: 0.75,
        radius: magnitude * 10000 //scaling up the radius by 10000
      }).bindPopup(`Location: ${place}<br>Magnitude: ${magnitude}<br>Depth: ${depth}<br>Date: ${date}`).addTo(myMap)
    }
  };

  
   //Create a Legend
   let legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     let div = L.DomUtil.create("div", "info legend");
     labels = [],
     colCat = ['darkgreen','green','lightgreen','yellow','orange', 'darkorange','red'];
     categories = ['<-10','-10-10','10-30','30-50','50-70','70-90', '90+'];
 
     for (var i = 0; i < categories.length; i++) {
           labels.push("<li> <i style=\"background-color: " + (colCat[i] ? colCat[i] : '+') + "\">__</i> "
           + (categories[i] ? categories[i] : '+')
           + "</li>"); 
         }
         div.innerHTML = labels.join('<br>');
     return div;
   };
 
   // Adding the legend to the map
   legend.addTo(myMap);

};