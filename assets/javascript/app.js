var createMarkers;
var geocodeAddr;

$(document).ready(function () {
  var map, location, marker, geocoder, service, bounds, restMarkers, oms;
  var searchAPIArray = [];
  var restInfoArray = [];
  var markerArray = [];
  var meterCount;

  // Immediately (self) invoked function which initializes application after document is loaded.
  (function initialize() {
    $('.radio-button').prop('disabled', true);
    $('#radius').hide();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(googleMap, promptUserAddr);
    } 
    else {
      promptUserAddr();
    }
  })();

  function promptUserAddr() {
    $("#addr-modal").modal("show");
  }

  function googleMap(position) {
    location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    bounds = new google.maps.LatLngBounds();

    console.log('GM Latitude: ' + location.lat());
    console.log('GM Longitude: ' + location.lng());

    renderMap();
  }

  function renderMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 100,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    marker = new google.maps.Marker({
      map: map,
      position: location,
      animation: google.maps.Animation.DROP,
      title: 'This is your location',
      icon: 'assets/images/bluemarker.png'
    });

    map.setCenter(location);
    
    oms = new OverlappingMarkerSpiderfier(map, {
      markersWontMove: true,
      markersWontHide: true
    });

    oms.addListener('format', function(marker, status) {
      var iconURL = status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED ? 'assets/images/greenmarker.png' :
        status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE ? 'assets/images/pinkmarker.png' :
        status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE ? 'assets/images/greenmarker.png' :
        null;
      marker.setIcon({
        url: iconURL
      });
    });
    
    $("#map").css('box-shadow', '0px 0px 10px #3be1ec, 0px 0px 10px #3be1ec');
    $('#radius').show();
    getRestaurants();
  }

  function centerMap() {
    for (var i = 0; i < markerArray.length; i++) {
      bounds.extend(markerArray[i].getPosition());
    };

    map.fitBounds(bounds);
    map.setCenter(location);
  }

  geocodeAddr = function (addressStr) {
    var geocoder = new google.maps.Geocoder();
    var appError;

    geocoder.geocode({
      address: addressStr
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('GeoCoder: ', results);
        location = results[0].geometry.location;
        bounds = new google.maps.LatLngBounds();
        renderMap();
      } 
      else {
        processError(status);
      }
    });
  }

  async function getRestaurants() {
    const MAX_QUERY_SIZE = 9;
    const numberOfRadButtons = 3
    const metersToMiles = [0, 1609.34, 3218.69, 6437.38];
    var dummyVar = 0;
    var detailAPIArray = [];

    for (var i = 1; i <= numberOfRadButtons; i++) {
      var element = $("#radio-button-" + i)
      var meters = [0, 1609.34, 3218.69, 6437.38];
      if (element.prop('checked')) {
        meterCount = metersToMiles[i]
      }
        console.log(meterCount)
    }

    // Use current location (global variable) to determine restaurant list.
    console.log('RL Latitude: ' + location.lat());
    console.log('RL Longitude: ' + location.lng());
    service = new google.maps.places.PlacesService(map);

    try {
      searchAPIArray = await nearBySearch();
      dummyVar = await delayProcess(1000);
    }
    catch(error) {
      processError(error);
    }
    console.log('S: ', searchAPIArray);

    var chunkArray = divideArray(searchAPIArray, MAX_QUERY_SIZE);
    console.log('Chunk: ', chunkArray);

    var result;
    for (let i = 0; i < chunkArray.length; i++) {
      try {
        result = await processSlice(chunkArray[i]);
        dummyVar = await delayProcess(4000);
      }
      catch (error) {
        /* Wait and try one more time. Then forget about it. Go ahead and fail. */
        try {
          dummyVar = await delayProcess(4000);
          result = await processSlice(chunkArray[i]);
          dummyVar = await delayProcess(4000);
        }
        catch (error) {
          processError(error);
        }
      }

      // Do this after the delay.
      console.log('D-' + i + ': ', result);
      detailAPIArray = detailAPIArray.concat(result);
    }

    $('.radio-button').prop('disabled', false);
    restInfoArray = new Restaurants(searchAPIArray, detailAPIArray);
    console.log('R: ', restInfoArray);

    renderList(restInfoArray);
  }

  function processSlice(array) {
    return Promise.all(array.map(findDetail));
  }

  function nearBySearch() {
    var request = {
      location: {
        lat: location.lat(),
        lng: location.lng()
      },
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: 'restaurant',
      openNow: true
    };

    return new Promise((resolve, reject) => {
      var filteredRadiusArray = [];
      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          function checkRadiusDistance(place, centerLatLng, radius) {
            return google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, centerLatLng) < radius
          }
          for (var i = 0; i < results.length; i++) {
            if (checkRadiusDistance(results[i], location, meterCount)) {
              filteredRadiusArray.push(results[i]);
            }
          }
          resolve(filteredRadiusArray);
        } 
        else {
          reject(status);
        }
      });
    });
  }

  function findDetail(place) {
    return new Promise((resolve, reject) => {
      service.getDetails({
        placeId: place.place_id
      },
      function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } 
        else {
          reject(status);
        }
      });
    });
  }

  createMarkers = function (latlng, name) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      address: latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('GeoCoder: ', results);
        markerArray.push(
          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            animation: google.maps.Animation.DROP,
            title: name,
          }));
          for (var i = 0; i < markerArray.length; i++) {
            var element = markerArray[i];
            oms.addMarker(element)
          }
          
        console.log(markerArray)
        centerMap();
      } 
      else {
        console.log('Geocoder error: Marker for ' + name + ' not added.');
      }
    });
  }

  function changeCheckedRadius() {
    renderMap(); 
    $('.radio-button').prop('disabled', true);
  }

  function processAddrModal() {
    event.preventDefault();
    processAddr();
  }

  function reloadPage() {
    window.location.reload(true);
  }

  function runRestModal() {
    renderRestModal(restInfoArray[parseInt($(this).attr('data-index'))]); 
  }

  $('.radio-button').on('click', changeCheckedRadius);
  $('#btn-addr-submit').on('click', processAddrModal);
  $('.reload').on('click', reloadPage);
  $(document).on('click', '[id^=item-]', runRestModal);
});

