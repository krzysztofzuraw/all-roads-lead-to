const searchForm = document.querySelector('.place-search');
let map;

function initMap() {  // eslint-disable-line no-unused-vars
  map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 4,
      center: { lat: 52.00, lng: 21.00 },
    });

  const directionsService = new (google.maps.DirectionsService)();
  const directionsDisplay = new (google.maps.DirectionsRenderer)();
  directionsDisplay.setMap(map);

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const placeValue = event.target.querySelector('[name=place]').value;
    geocodeAddress(placeValue).then((geocodedCoords) => {
      const mainWayPoint = createMainWaypoint(geocodedCoords);

      searchForm.parentElement.style.display = 'none';
      const titleText = `All roads lead to ${placeValue}`;
      document.title = titleText;

      createPoint(map).then((startingCoords) => {
        createPoint(map).then((endCoords) => {
          calculateAndDisplayRoute(
            directionsService,
            directionsDisplay,
            mainWayPoint,
            startingCoords,
            endCoords,
          );
        });
      });
    });
  });
}


function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      address,
    }, (results, status) => {
      if (status === 'OK') {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        reject('Cannot find address');
      }
    });
  });
}

function createMainWaypoint(coords) {
  map.setCenter(coords);
  return new google.maps.Marker({
    position: coords,
    map,
    title: 'Place where all roads lead',
    icon: 'compass.png',
  });
}

function createPoint(map) {
  return new Promise((resolve, reject) => {
    google.maps.event.addListenerOnce(map, 'click', (event) => {
      resolve(
        new google.maps.Marker({
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
          map,
        }),
      );
      reject(
        'Error creating point',
      );
    });
  });
}

function calculateAndDisplayRoute(service, display, wayPoint, startingPoint, endPoint) {
  service.route({
    origin: { lat: startingPoint.position.lat(), lng: startingPoint.position.lng() },
    destination: { lat: endPoint.position.lat(), lng: endPoint.position.lng() },
    waypoints: [{ location: wayPoint.position }],
    travelMode: 'DRIVING',
  }, (response, status) => {
    if (status === 'OK') {
      display.setDirections(response);
    } else {
      alert('Route not found!');
    }
  });
}
