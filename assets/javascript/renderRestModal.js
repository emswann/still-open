function renderRestModal(arr, id) {
  var infoArray = arr.restaurantArray;
  var labelId = id;

  for (var i = 0; i < infoArray.length; i++) {
    if (infoArray[i].place_id === labelId) {
      $('#info-modal-body').empty();

      var modalLine = $('<h3 id="rest-name">').html(infoArray[i].nameStr);
      $('#info-modal-body').append(modalLine);

      modalLine = $('<h3>').html('Address: ' + '<span id="address">' + infoArray[i].addressStr + '</span>');
      $('#info-modal-body').append(modalLine);

      modalLine = $('<h3>').html('Cost: ' + '<span id="cost">' + infoArray[i].cost + '</span>');
      $('#info-modal-body').append(modalLine);

      modalLine = $('<h3>').html('Phone: ' + '<span id="phone">' + infoArray[i].phoneStr + '</span>');
      $('#info-modal-body').append(modalLine);

      modalLine = $('<h3>').html('URL: ');
      $('#info-modal-body').append(modalLine);

      modalLine = $('<a>', {
        href:   infoArray[i].websiteStr,
        target: "_blank",
        class: 'rest-link'
      });

      modalURL = $('<h3>').html(infoArray[i].websiteStr);
      modalLine.append(modalURL);
      $('#info-modal-body').append(modalLine);
    }
  }
};