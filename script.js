const searchForm = document.querySelector('.search-form');
const mapElem = document.getElementById('map');
const questionForm = document.querySelector('.question-form');

function geocodeAddress(address) {
  let mainPointCoords = {};
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === 'OK') {
      mainPointCoords = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
    } else {
      alert('Cannot find address');
    }
    return mainPointCoords;
  });
}

function initMap() {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    questionForm.classList.add('is-hidden');
    const mainPointCoords = geocodeAddress(searchForm.querySelector('[name=place]').value);
    const map = new google.maps.Map(
     mapElem,
     { zoom: 4, center: mainPointCoords });
  });
}
