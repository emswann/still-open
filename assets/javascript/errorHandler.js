/**
 * @file Defines Error Handling functionality for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @function processError 
 * @description Pops up error modal containing error message info and refresh button to reload webpage.
 * @param {string} error - Displayed error message.
*/
function processError(error) {
  const MESSAGE = 'Google Maps was unable to process the request.';

  $('#err-modal-body').empty();
  $('#info-modal').modal('hide');
  $('#addr-modal').modal('hide');
  $('#err-modal').modal('show');

  console.log(error);

  var errModalLine = $('<h3>').text(MESSAGE);

  $('#err-modal-body').append(errModalLine);
}