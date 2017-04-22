const searchForm = document.querySelector('.search-form');
const mapElem = document.getElementById('map');
const questionForm = document.querySelector('.question-form');
const title = document.querySelector('.mdl-layout-title');
let mainWaypoint;
let startingPoint;
let endPoint;


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

function initMap() {  // eslint-disable-line no-unused-vars
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    questionForm.classList.add('is-hidden');
    const place = searchForm.querySelector('[name=place]').value;
    geocodeAddress(place).then((response) => {
      const map = onGeocodeComplete(response);
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);
      const titleText = `All roads lead to ${place}`;
      document.title = titleText;
      title.innerHTML = titleText;
      animateSnackbar(directionsService, directionsDisplay);
      createPoint(map).then((startingCoords)=>{
        startingPoint = startingCoords;
        createPoint(map).then((endCoords)=>{
          endPoint = endCoords;
        })
      });
    }, (error) => {
      alert(error);
    });
  });
}

function onGeocodeComplete(coords) {
  const map = new google.maps.Map(
    mapElem, {
      zoom: 4,
      center: coords,
    });
  mainWaypoint = new google.maps.Marker({  // eslint-disable-line no-unused-vars
    position: coords,
    map,
    title: 'Place where all roads lead',
    icon: 'compass.png',
  });
  return map;
}

function animateSnackbar(service, display) {
  const snackbarContainer = document.querySelector('#select-points-toast');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: 'Select starting & end point',
    actionHandler: () => {
      snackbarContainer.classList.add('is-hidden');
      calculateAndDisplayRoute(service, display);
    },
    actionText: 'Done',
    timeout: 100000,
  });
}

function calculateAndDisplayRoute(service, display) {
  service.route({
    origin: {lat : startingPoint.position.lat(), lng: startingPoint.position.lng()},
    destination: {lat: endPoint.position.lat(), lng: endPoint.position.lng()},
    waypoints: [{location: mainWaypoint.position}],
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status == 'OK') {
      display.setDirections(response);
    } else {
      console.log(response);
    }
  });
}
function createPoint(map) {
  return new Promise(function(resolve, reject) {
  google.maps.event.addListenerOnce(map, 'click', (event) => {
      resolve(
        new google.maps.Marker({
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          map,
        })
      );
    });
  });
}
