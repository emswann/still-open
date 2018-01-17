$(document).ready(function () {
    const MAX_RESTAURANTS = 20;
    var map, location, marker, geocoder, service;
    var detailAPIArray = [];
    var restInfoArray  = [];

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

    function convertAddr(addressObj) {

        var addressStr = addressObj.street + "," + 
                         addressObj.city + "," +
                         addressObj.state + "," +
                         addressObj.zipcode;

        // Need to validate address here.

        return addressStr;
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
        
        var addressObj = {
            "street"  : $("#addr-street").val().trim().toUpperCase(),
            "city"    : $("#addr-city").val().trim().toUpperCase(),
            "state"   : $("#addr-state").val().trim().toUpperCase(),
            "zipcode" : $("#addr-zipcode").val()
        }

        console.log("Input Address: ", addressObj);
        var addressStr = "";

        if ((addressStr = convertAddr(addressObj)) !== "") {
            geocodeAddr(addressStr);
        }
        else {
            console.log("processAddr: Handle this error.");
        }
    }

    async function getRestaurants() {
        var dummy = 0;

        // Use current location (global variable) to determine restaurant list.
        console.log("RL Latitude: " + location.lat());
        console.log("RL Longitude: " + location.lng());
        service = new google.maps.places.PlacesService(map);

        var searchAPIArray = await nearBySearch();
        dummy = await delayProcess();

        console.log("S: ", searchAPIArray);

        var tempArray1 = searchAPIArray.slice(0, 9);
        console.log("T1: ", tempArray1);

        var result1 = await processSlice(tempArray1);
        dummy = await delayProcess();

        console.log("D1: ", result1);

        var tempArray2 = searchAPIArray.slice(9, 18);
        console.log("T2: ", tempArray2);

        var result2 = await processSlice(tempArray2);
        dummy = await delayProcess();
        
        console.log("D2: ", result2);

        result1 = result1.concat(result2);
        console.log(result1);

        restInfoArray = new Restaurants(result1);
        console.log(restInfoArray);
    }

    function delayProcess() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(1);
            }, 5000);
        });
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