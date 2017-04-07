const searchForm = document.querySelector('.search-form');
const mapElem = document.getElementById('map');
const questionForm = document.querySelector('.question-form');
const title = document.querySelector('.mdl-layout-title');
let clicked = false;

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
      const titleText = `All roads lead to ${place}`;
      document.title = titleText;
      title.innerHTML = titleText;
      const startingSnackbar = animateSnackbar();
      const startingPoint = createStartingPoint(map, startingSnackbar);
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
  const marker = new google.maps.Marker({  // eslint-disable-line no-unused-vars
    position: coords,
    map,
    title: 'Place where all roads lead',
    icon: 'compass.png',
  });
  return map;
}

function animateSnackbar() {
  const snackbarContainer = document.querySelector('#select-points-toast');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: 'Select starting point',
    actionHandler: () => {
      snackbarContainer.classList.add('is-hidden');
    },
    actionText: 'Done',
    timeout: 100000,
  });
  return snackbarContainer;
  // https://getmdl.io/components/index.html#snackbar-section
}

function createStartingPoint(map, snackbar) {
  google.maps.event.addListenerOnce(map, 'click', (event) => {
    snackbar.classList.add('is-hidden');
    return new google.maps.Marker({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      },
      map,
    })
  });
}
