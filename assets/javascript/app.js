$(document).ready(function () {
<<<<<<< HEAD
    var map, location, marker, geocoder, service, infoWindow;
    var restAPIArray = [];
    var restInfoArray = [];
=======
    var map, location, marker, geocoder, service;
    var searchAPIArray = [];
    var restInfoArray  = [];
>>>>>>> 5a3d8cca34965755052a7b943f74b7e2db06126b

    // Immediately (self) invoked function which initializes application after document is loaded.
    (function initialize() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(googleMap, promptUserAddr);
        } else {
            promptUserAddr();
        }
    })();

    function googleMap(position) {
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
<<<<<<< HEAD
        service = new google.maps.places.PlacesService(map);
       getRestaurants();
=======
        getRestaurants();
>>>>>>> 5a3d8cca34965755052a7b943f74b7e2db06126b
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

    async function getRestaurants() {
        const MAX_QUERY_SIZE = 9;

        var dummyVar = 0;
        var detailsArray = [];

        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());
        service = new google.maps.places.PlacesService(map);

        searchAPIArray = await nearBySearch();
        dummyVar = await delayProcess();

        console.log("S: ", searchAPIArray);

        var chunkArray = divideArray(searchAPIArray, MAX_QUERY_SIZE);
        console.log("Chunk: ", chunkArray);

        for (let i = 0; i < chunkArray.length; i++) {
            var result = await processSlice(chunkArray[i]);
            dummyVar = await delayProcess();

            // Do this after the delay.
            console.log("D-" + i + ": ", result);
            detailsArray = detailsArray.concat(result);
        }

        restInfoArray = new Restaurants(detailsArray);
        console.log("R: ", restInfoArray);
    }

    function processSlice(array) {
        return Promise.all(array.map(findDetail));
    }

<<<<<<< HEAD
        infoWindow = new google.maps.InfoWindow();
        service.nearbySearch({
=======
    function nearBySearch() {
        var request = {
>>>>>>> 5a3d8cca34965755052a7b943f74b7e2db06126b
            location: {
                lat: location.lat(),
                lng: location.lng()
            },
            rankBy: google.maps.places.RankBy.DISTANCE,
            type: 'restaurant',
            openNow: true
        };

        return new Promise((resolve, reject) => {
            service.nearbySearch(request, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                }
                else {
                    reject(status);
                }
            });
<<<<<<< HEAD
        }
        console.log("here")
=======
        });
>>>>>>> 5a3d8cca34965755052a7b943f74b7e2db06126b
    }

    function findDetail(place) {
        return new Promise((resolve, reject) => {
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