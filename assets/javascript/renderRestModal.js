function renderRestModal(restObj) {

  $('#info-modal-body').empty();

  var modalLine = $('<h3 id="rest-name">').html(restObj.nameStr);
  $('#info-modal-body').append(modalLine);

  modalLine = $('<h3>').html('Address: ' + '<span id="address">' + restObj.addressStr + '</span>');
  $('#info-modal-body').append(modalLine);

  modalLine = $('<h3>').html('Cost: ' + '<span id="cost">' + restObj.cost + '</span>');
  $('#info-modal-body').append(modalLine);

  modalLine = $('<h3>').html('Phone: ' + '<span id="phone">' + restObj.phoneStr + '</span>');
  $('#info-modal-body').append(modalLine);

  modalLine = $('<h3>').html('URL: ');
  $('#info-modal-body').append(modalLine);

  modalLine = $('<a>', {
    href:   restObj.websiteStr,
    target: "_blank",
    class: 'rest-link'
  });

  modalURL = $('<h3>').html(restObj.websiteStr);
  modalLine.append(modalURL);
  $('#info-modal-body').append(modalLine);
};