function renderModals(arr, e) {

    var infoArray = arr.restaurantArray;
    var labelText = e.target.innerHTML;

        for (var i = 0; i < infoArray.length; i++) {
            if (infoArray[i].nameStr === labelText) {
                $('.modal-body').empty();
                var modalLine = $('<h3>').text(infoArray[i].nameStr);
                $('.modal-body').append(modalLine);
                modalLine = $('<h3>').text('Address: ' + infoArray[i].addressStr);
                $('.modal-body').append(modalLine);
                modalLine = $('<h3>').text('Cost: ' + infoArray[i].cost);
                $('.modal-body').append(modalLine);
                modalLine = $('<h3>').text('Phone: ' + infoArray[i].phoneStr);
                $('.modal-body').append(modalLine);
                modalLine = $('<h3>').text('URL: ');
                $('.modal-body').append(modalLine);
                modalLine = $('<a>').text(infoArray[i].websiteStr);
                $('.modal-body').append(modalLine);
            }
        }
};