function renderModals(arr, e) {

    var infoArray = arr.restaurantArray;
    var labelId = e

        for (var i = 0; i < infoArray.length; i++) {
            if (infoArray[i].place_id === labelId) {
                $('#info-modal-body').empty();
                var modalLine = $('<h3>').text(infoArray[i].nameStr);
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text('Address: ' + infoArray[i].addressStr);
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text('Cost: ' + infoArray[i].cost);
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text('Phone: ' + infoArray[i].phoneStr);
                $('#info-modal-body').append(modalLine);
                modalLine = $('<h3>').text('URL: ');
                $('#info-modal-body').append(modalLine);
                modalLine = $('<a>', {
                    text: infoArray[i].websiteStr,
                    href: infoArray[i].websiteStr,
                    target: "_blank"
                })
                $('#info-modal-body').append(modalLine);
            }
        }
};