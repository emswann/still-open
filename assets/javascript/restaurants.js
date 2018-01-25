/**
 * @file Constructs Restaurants and Restaurant objects for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @constructor Restaurants
 * @constructs {Object[]} Restaurant objects array.
 * @param {Object[]} searchAPIArray - Google Places (Nearby Search) array. Contains restaurants ordered by distance to center (ascending).
 * @param {Object[]} detailAPIArray - Google Places Details array. Contains detail info for each restaurant returned by Nearby Search.
 * @returns {Object[]} Restaurant objects array.
*/
function Restaurants(searchAPIArray, detailAPIArray) {

  /** 
    * @function Restaurants.sortArray 
    * @description Sorts restaurant array based on Nearby Search order. Required due to asynchronous processing for Google Places Details.
    * @param {Object[]} refArray - Array to determine sort order.
    * @param {Object[]} sortArray - Array with data objects to be sorted.
    * @returns {Object[]} Array sorted by distance to center (ascending).
  */
  var sortArray = ((refArray, sortArray) => {
    sortedArray = [];

    if (refArray.length === sortArray.length) {
      refArray.forEach(refPlace => {
        sortArray.forEach(sortPlace => {
          if (refPlace.place_id === sortPlace.place_id) {
            sortedArray.push(sortPlace);
          }
        })
      })
    }
    else {
      sortedArray = sortArray;
      console.log('Restaurants: API search array does not match length of details array...bypassing sorting.');
    }

    return sortedArray;
  });

  /** 
  * @constructor Restaurant
  * @constructs {Object} Object with restaurant detail info in a format easily used by the app.
  * @param {Object} apiObj - Google Places Details object.
  */    
  function Restaurant(apiObj) {

    /** 
      * @function Restaurant.formatCost 
      * @description Converts cost integer to text.
      * @param {number} costNum - Integer cost.
      * @returns {string} Text cost in $.
    */
    var formatCost = (costNum => {
      var costStr = '';

      switch (costNum) {
        case 0: 
          costStr = 'Free';
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          for (let i = 0; i < costNum; i++) {
            costStr += '$';
          }
          break;
        default:
          costStr = 'No pricing info';
      }

      return costStr;
    });

    /** 
      * @function Restaurant.formatHours 
      * @description Creates Hours array.
      * @param {Object[]} periodArray - Open/close time info per day of the week.
      * @param {array} weekdayTextArray - Time string per day of the week.
      * @returns {Object[]} Hours array.
    */
    var formatHours = ((periodArray, weekdayTextArray) => {
      return new Hours(periodArray, weekdayTextArray);
    });

    this.place_id        = apiObj.place_id;
    this.locationObj     = apiObj.geometry.location;
    this.nameStr         = apiObj.name;
    this.addressStr      = apiObj.formatted_address;
    this.phoneStr        = apiObj.formatted_phone_number; 
    this.hoursArray      = formatHours(apiObj.opening_hours.periods,
                                       apiObj.opening_hours.weekday_text);
    this.cost            = formatCost(apiObj.price_level);
    this.websiteStr      = apiObj.website 
                            ? apiObj.website 
                            : 'No website info';
  }

  /** 
  * @method isClosing
  * @description Determines if restaurant is within closing window.
  * @param {Object} currTime - Current (moment) time.
  * @param {number} timeFrame - Closing window in minutes.
  * @returns {Object} sendAlert {boolean}: within closing window.
  *                   timeLeft {number}: minutes left until closing.
  *                   closeTimeStr {string}: closing time (military hrs:mins).
  *                   isOpen24Hrs {boolean}: open 24 hrs.
  */
  Restaurant.prototype.isClosing = function (currTime, timeFrame) {

    /** 
      * @function checkForUserCrossover 
      * @description Determines if user has crossed over into next day.
      * @param {Object} currTime - Current (moment) time.
      * @param {Object} hoursInfo - Open/close time info.
      * @returns {boolean} User has crossed over.
    */
    var checkForUserCrossover = (currTime, openTime) => {
      return (currTime.isBefore(openTime)) ? true : false;
    }

    /** 
      * @function setTimes 
      * @description Sets open and close times based on input parameters.
      * @param {Object} currTime - Current (moment) time.
      * @param {Object} hoursInfo - Open/close time info.
      * @returns {Object} openTime {Object}: Open (moment) time.
      *                   closeTime {Object}: Close (moment) time.
    */
    var setTimes = ((currTime, hoursInfo) => {
      return ({openTime:  moment().set({'year':        currTime.year(),
                                        'month':       currTime.month(),
                                        'date':        currTime.date(),
                                        'hour':        hoursInfo.open.hours,
                                        'minute':      hoursInfo.open.minutes,
                                        'second':      0,
                                        'millisecond': 0
                                      }),
               closeTime: moment().set({'year':        currTime.year(),
                                        'month':       currTime.month(),
                                        'date':        currTime.date(),
                                        'hour':        hoursInfo.close.hours,
                                        'minute':      hoursInfo.close.minutes,
                                        'second':      0,
                                        'millisecond': 0
                                      })
      });
    });

    const INTERVAL = 15;
    const CLOSE_TEXT_POS = -8;
    const OPEN_24_HRS_STR = 'Open 24 hours';

    var sendAlert    = false;
    var timeLeft     = 0;
    var closeTimeStr = '';

    var timeObj;

    var dayOfWeek   = currTime.day();

    var hoursInfo  = this.hoursArray[dayOfWeek];

    if (!hoursInfo.isOpen24Hrs) { 
      timeObj = setTimes(currTime, hoursInfo);

      /* If user crossed over, need to revert to previous day info. */
      if (checkForUserCrossover(currTime, timeObj.openTime)) {
        /* Cloning so do not mutate/change current time. */
        var prevTime = moment(currTime).subtract(1, 'd');
        var prevDayOfWeek = prevTime.day(); 

        var prevHoursInfo  = this.hoursArray[prevDayOfWeek];

        /* Reload time data with previous day info & reset. */
        timeObj = setTimes(prevTime, prevHoursInfo);
      }
    
      /* This will work any time the day is a crossover (user time in same day or next day) because have adjusted to previous day earlier. NOTE: This step must follow check for user crossover because may need either current or previous day data. */
      if (hoursInfo.isCrossover) {
        timeObj.closeTime.add(1, 'd');
      }

      /* Cloning so do not mutate/change current time. */
      if (moment(currTime).add(timeFrame, 'm').isAfter(timeObj.closeTime)) {
        sendAlert = true;
        timeLeft = 
          Math.ceil(timeObj.closeTime.diff(currTime, 'm') / INTERVAL) * INTERVAL;
      }

      var closeTimeTxt = hoursInfo.text;
      closeTimeStr = closeTimeTxt.substr(CLOSE_TEXT_POS).trim();
    }
    else {
      /* sendAlert is already set to false. */
      closeTimeStr = OPEN_24_HRS_STR;
    }
 
    return ({'sendAlert':    sendAlert,
             'timeLeft':     timeLeft,
             'closeTimeStr': closeTimeStr,
             'isOpen24Hrs':  hoursInfo.isOpen24Hrs
            });
  }

  return (() => {
    var restaurantArray = [];

    /* Constructor assumes all objects are added. List has been scrubbed for null/undefined or permanently closed restaurants. */
    detailAPIArray.forEach(place =>  
      restaurantArray.push(new Restaurant(place))
    );

    return sortArray(searchAPIArray, restaurantArray);
  })(); 
}
