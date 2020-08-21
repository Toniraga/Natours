/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidG9uaXJhZ2EiLCJhIjoiY2tjcm1pb2RjMGE4ODJ3cDQ0MWdpcHljayJ9.4d_zLSzEVjitkGMv6x1SPw';

  var map = new mapboxgl.Map({
    container: 'map',
    style:
      'mapbox://styles/toniraga/ckcrmv6uk10ad1jphmn6t448z',
    scrollZoom: false
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add PopUp
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<p> Day ${loc.day}: ${loc.description} </p>`
      )
      .addTo(map);

    // Extends the mark bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}

