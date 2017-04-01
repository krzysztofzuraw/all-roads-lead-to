const searchForm = document.querySelector('.search-form');
const mapElem = document.getElementById('map');
const questionForm = document.querySelector('.question-form');
const title = document.querySelector('.mdl-layout-title');

function geocodeAddress(address, callback) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address,
  }, function (results, status) {
    if (status === 'OK') {
      callback({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      });
    } else {
      alert('Cannot find address');
    }
  });
}

function geocodeAddressPromise(address) {
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
    geocodeAddressPromise(place).then((response) => {
      onGeocodeComplete(response);
      const titleText = `All roads lead to ${place}`;
      document.title = titleText;
      title.innerHTML = titleText;
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
}

function animateSnackbar() {
  const snackbarContainer = document.querySelector('#select-points-toast');
  // https://getmdl.io/components/index.html#snackbar-section
}
