/**
 * @file Defines Restaurant List rendering functionality for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @function renderList 
 * @description Renders restaurant list and adds restaurant markers on map.
 * @param {Object[]} listArr - Restaurant objects to render. Max of 10.
*/
function renderList(listArr) {
  const MAX_COUNT = 10;
  const TIMEFRAME = 120; /* 2 hours or 120 mins. */

  var container   = $('#list-container');
  var textStr     = '';

  var nowMoment = moment();

  /** 
  * @function createList (self-invoking)
  * @description Renders restaurant list and adds restaurant markers on map. If no restaurants available, renders message to webpage.
  */
  (function createList() {
    container.empty();

    if (listArr.length > 0) {
      $('#no-rest-message').detach();

      for (let i = 0; i < listArr.length && i < MAX_COUNT; i++) {
        var {sendAlert, timeLeft, closeTimeStr, isOpen24Hrs} =
          listArr[i].isClosing(nowMoment, TIMEFRAME);
 
        var rest = $('<div>')
          .addClass('row list restaurant');
 
        var button = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12 btn btn-default btn-restaurant')
          .attr({
            'type':        'button',
            'id':          'item-' + i,
            'data-toggle': 'modal',
            'data-target': '#info-modal',
            'data-index' : i,
            'data-id'    : listArr[i].place_id
          });
        rest.append(button);
 
        var buttonRow = $('<div>')
          .addClass('row');
        button.append(buttonRow);
 
        var restInfo = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-8 rest-info');
        buttonRow.append(restInfo);
 
        var title = $('<p>')
          .text(listArr[i].nameStr);
        restInfo.append(title);
 
        var timeInfo = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-4 time-info');
        buttonRow.append(timeInfo);
 
        var closeInfo = $('<div>')
          .addClass('row close-info');
        timeInfo.append(closeInfo);
 
        var closeInfoCol = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12');
        closeInfo.append(closeInfoCol);
 
        var closeInfoTxt = $('<h5>')
        textStr = (isOpen24Hrs) ? 'Open 24 Hours' : 'Closes at ' + closeTimeStr;
        closeInfoTxt.text(textStr);
        closeInfoCol.append(closeInfoTxt);
 
        var alertInfo = $('<div>')
          .addClass('row');
        timeInfo.append(alertInfo);
 
        var alertInfoCol = $('<div>')
          .addClass('col-xs-12 col-sm-12 col-md-12');
        alertInfo.append(alertInfoCol);
 
        if (sendAlert) {
          var alertInfoTxt = $('<h5>')
            .addClass('alert-info');
          textStr = (timeLeft > 0)
            ? ('Closes in less than ' + timeLeft + ' mins')
            : ('Closing soon!');
          alertInfoTxt.text(textStr);
          alertInfoCol.append(alertInfoTxt);
        }
 
        container.append(rest);
        createMarkers(listArr[i].addressStr, listArr[i].nameStr, listArr[i].phoneStr, listArr[i].cost, listArr[i].websiteStr);
      }

      var nextBtnRow = $('<div>')
        .addClass('row list');
      container.append(nextBtnRow);

      var nextBtn = $('<button>')
        .addClass('btn btn-default')
        .attr({
          'type':     'button',
          'id':       'btn-rest-next',
          'disabled': 'disabled'
        })
        .text('Next');
      nextBtnRow.append(nextBtn);
    }
    else {
      var messageDiv = $('<h3>')
                         .addClass('row')
                         .attr('id', 'no-rest-message')
                         .text('No restaurants are open within the search area.');
        var errorImg = $('<img>')
                        .attr('src', 'assets/images/closed.jpg')
                        .attr('id', 'error-img')
                        .addClass('col-xs-12 col-sm-12 col-md-12');
      messageDiv.append(errorImg);
      container.append(messageDiv);
    }
  })();

  
}