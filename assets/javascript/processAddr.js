function showAddrError(errorObj, addressObj) {
  var defaultStr = ' is not valid!';

  /* Check if all required input is missing first, since it sets the same fields as other state/zip checks. */
  if (!errorObj.hasMinInput || !errorObj.hasCityState || !errorObj.hasZipCode) {
    addAddrError('form-addr-city', 
                 (addressObj.city() === '') ? 'Empty field' + defaultStr : '');
    addAddrError('form-addr-state',
                 (addressObj.state() === '') ? 'Empty field' + defaultStr : '');
    addAddrError('form-addr-zipcode',
                 (addressObj.zip() === '') ? 'Empty field' + defaultStr : '');
  }
  else {
    if (!errorObj.isValidState) {
      addAddrError('form-addr-state', addressObj.state() + defaultStr);   
    }

    if (!errorObj.isValidZip) {
       addAddrError('form-addr-zipcode', addressObj.zip() + defaultStr);     
    }
  }
}

function addAddrError(id, error) {
  $('#' + id).addClass('has-error');
  $('#' + id).children('input').addClass('error-input'); 
  $('#' + id).append($('<h5>').addClass('error-text')
                              .text(error));         
}

function removeAddrError() {
  $('[id^=form-addr-]').removeClass('has-error');
  $('[id^=form-addr-]').children('input').removeClass('error-input'); 
  $('.error-text').detach();
}

function processAddr() {
  removeAddrError();

  var addressObj = new Address($('#addr-street').val().trim(),
    $('#addr-city').val().trim(),
    $('#addr-state').val().trim(),
    $('#addr-zipcode').val());

  console.log('Input Address: ', addressObj);

  var {isValid, errorObj} = addressObj.isValid();

  if (isValid) {
    $('#addr-modal').modal('hide');
    geocodeAddr(addressObj.address()); 
  }
  else {
    $('#addr-modal-title').text('Input errors found. Fix and re-submit')
    showAddrError(errorObj, addressObj);
  }
}