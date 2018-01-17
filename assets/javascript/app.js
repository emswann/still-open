$(document).ready(function () {
    var map, location, marker, geocoder, service;
    var restAPIArray = [];
    var restInfoArray = [];

    // Immediately (self) invoked function which initializes application after document is loaded.
    (function initialize() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(GoogleMap, promptUserAddr);
        } else {
            promptUserAddr();
        }
    })();

    function GoogleMap(position) {
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        console.log("GM Latitude: " + location.lat());
        console.log("GM Longitude: " + location.lng());

        renderMap();
    }

    function renderMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        marker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP,
            title: "This is your location",
            icon: "assets/images/bluemarker.png"
        });

        map.setCenter(location);
        getRestaurants();
    }

    // Removed call to showError in navigator.geolocation.
    // Need to add call to appropriate function for error handling.
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.")
                break;
        }
    }

    function promptUserAddr() {
        $("#addr-modal").modal("show");
    }

    function geocodeAddr(addressStr) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({address: addressStr}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                console.log("GeoCoder: ", results);
                location = results[0].geometry.location;
                renderMap();
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function processAddr() {
        event.preventDefault();
        $("#addr-modal").modal("hide");

        var addressObj = new Address($("#addr-street").val().trim(),
                                     $("#addr-city").val().trim(),
                                     $("#addr-state").val().trim(),
                                     $("#addr-zipcode").val());

        console.log("Input Address: ", addressObj);

        (addressObj.isValid()) ? geocodeAddr(addressObj.address())
                               : console.log("processAddr: Handle this error.");
    }

    function getRestaurants() {
        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());
        service = new google.maps.places.PlacesService(map);
        nearBySearch()
        .then(function(results) {
            var tempArray = results.slice(0, 9);
            return Promise.all(
                tempArray.map(findDetail)
            );
        })
        .then(function(results) {
            console.log(results);
            var restaurants = new Restaurants(results);
            console.log("Info: ", restaurants);
        })
        .catch(function(status) {
            alert(status);
        });
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
        return new Promise(function(resolve, reject) {
            service.nearbySearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                }
                else {
                    reject(status);
                }
            });
        });
    }

    function findDetail(place) {
        return new Promise(function(resolve, reject) {
            service.getDetails({placeId: place.place_id}, 
                               function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                }
                else {
                    reject(status);
                }
            });
        });
    }

    // $(document).on("click", ".btn-restaurant", populateRestInfo);
    $("#btn-addr").on("click", processAddr);
});