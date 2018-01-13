// function initMap() {}

$(document).ready(function () {
    var map, location;

    function GoogleMap(position) {
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var marker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP,
            title: "This is your location"
        });

        map.setCenter(location);
    }

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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(GoogleMap, showError);
    } else {
        showError();
    }
})