/**
 * @file Defines Address modal processing functionality for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @function showAddrError 
 * @description Processes errors based on validating address input.
 * @param {Object} errorObj - Booleans detailing validation.
 * @param {Object} addressObj - Address info.
*/
function showAddrError(errorObj, addressObj) {
  var defaultStr = ' is not valid!';

  /* Check if all required input is missing first, since set same fields as other state/zip checks. */
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

/** 
 * @function addAddrError 
 * @description Adds error DOM attributes and elements to an id. 
 * @param {string} id - HTML id (no #) to add errors.
 * @param {string} error - Error text placed below address field.
*/
function addAddrError(id, error) {
  $('#' + id).addClass('has-error');
  $('#' + id).children('input').addClass('error-input'); 
  $('#' + id).append($('<h5>').addClass('error-text')
                              .text(error));         
}

/** 
 * @function removeAddrError 
 * @description Removes error DOM attributes and elements so DOM is clean when user submits address. 
*/
function removeAddrError() {
  $('[id^=form-addr-]').removeClass('has-error');
  $('[id^=form-addr-]').children('input').removeClass('error-input'); 
  $('.error-text').detach();
}

/** 
 * @function processAddr 
 * @description Evaluates address modal after user inputs/submits address. Either address is okay with input/geocoder results - continue application processing. Or errors detected - user must input/submit address again. 
*/
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