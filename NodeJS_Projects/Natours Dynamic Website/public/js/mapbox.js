// All js files in the public folder contain front end code
// This file is running on the front end side
/* eslint-disable */
//console.log('hello from the client');
// locations was sent from the tour template as a parameter
exports.uppercase = str => str.toUpperCase()
exports.a = 1
export const displayMap = (locations) => {
mapboxgl.accessToken = 
'pk.eyJ1IjoicnV0aC1jb2hlbjg5IiwiYSI6ImNsMDhicHYwZTAxeWUza3F1aHpqcGp4djYifQ.aKSKkgyvvrMIEveBJu_w4g';

// The Map object represents the map on the page
var map = new mapboxgl.Map({
  // Store the map in the 'map' element in the tour file
  container: 'map',
  style: 'mapbox://styles/ruth-cohen89/cl08eix4s003d14qt3890mgto',
  scrollZoom: false
  //   center: [-118.113491, 34.111745],
//   zoom: 4
});

// The area to be displayed on the map
const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';
  
  // 1) Add Marker
  // New Marker
  // Marker is a visual representation of a coordinate
  // Represents a rectangular geographical area on a map.
  new mapboxgl.Marker({
    element: el,

    // Defining the part of the marker that is the closest to the coordinate
    anchor: 'bottom'

    // Add Marker to the map
    // Sets the location of the anchor on map
  }).setLngLat(loc.coordinates).addTo(map);
  
  // 2) Add popup
  new mapboxgl.Popup({
      offset: 30
  })
  .setLngLat(loc.coordinates)
  .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
  .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

// Sets the viewport to contain the given bounds.
// fitbounds moves and zooms the map right to the bounds
// to fit the markers
  map.fitBounds(bounds,  {
    padding: {
      top: 200,
      buttom: 150,
      left: 100,
      right: 100
    }
  });
};
