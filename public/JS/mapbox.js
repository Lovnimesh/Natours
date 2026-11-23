/*eslint-disable*/

// console.log(locations);

export const displayMap = (locations) => {
  const map = new mapboxgl.Map({
    accessToken: process.env.MAPBOXGL_ACESS_TOKEN,
    container: 'map', // container ID
    style: 'mapbox://styles/nimeshlov52/cmwoyoo0f00az01r885no8tke',
    scrollZoom: false,
    // center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    // zoom: 9, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add a marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bound to include current location
    bounds.extend(loc.coordinates);
  });

  // fitBounds is the method which is for zooming and  moving and animation and all
  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
