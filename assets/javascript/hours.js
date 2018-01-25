/**
 * @file Constructs Hours and DayOfWeek objects for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @constructor Hours
 * @constructs {Object[]} DayOfWeek objects array.
 * @param {Object[]} periodArray - Open/close time info per day. Weekdays where restaurant is closed do not have a period object. Open 24 hour restaurants have 1 period object with either open OR close populated (not both). Uses 0 = Sunday, 6 = Saturday.
 * @param {array} weekdayTextArray - Time string per day of the week. All 7 days are always populated. Uses 0 = Monday, 6 = Sunday. (Thank you Google!)
 * @returns {Object[]} DayOfWeek objects array.
*/
function Hours(periodArray, weekdayTextArray) {
    
  /** 
   * @function Hours.getRefDay 
   * @description Determines which day object (open/close) to extract day. Defaults to using open day unless undefined. Otherwise, uses close day. (Needed due to inconsistencies for 24 hour restaurants.)
   * @param {Object} periodObj - Period object mapped to current day.
   * @returns {number} Reference day.
  */
  var getRefDay = (periodObj => {
    return (typeof(periodObj.open) === 'undefined') 
              ? periodObj.close.day 
              : periodObj.open.day;
  });
     
  /** 
   * @constructor DayOfWeek 
   * @constructs {Object} Object with day of week info in format easily used by the app.
   * @param {number} currDayIndex - Current day.
   * @param {Object} periodObj - Period object mapped to current day.
   * @param {string} weekdayTextStr - Period text mapped to current day.
  */
  function DayOfWeek(currDayIndex, periodObj, weekdayTextStr) {

    /** 
     * @function DayOfWeek.addDefaultPeriod 
     * @description Adds default period object to fill missing API days.
     * @returns {Object} Default period object.
    */      
    var addDefaultPeriod = (day => {
      return {close:    {day:     day,
                         time:    '0000',
                         hours:   0,
                         minutes: 0},
              open:     {day:     day,
                         time:    '0000',
                         hours:   0,
                         minutes: 0},
              isDefault: true};
    });

    /** 
     * @function DayOfWeek.adjustCloseDay 
     * @description Determines if restaurant has open time in one day and close time in the far off future (> the next day). This occurs when restaurant switches from set hours to 24 hours within the week.
     * @param {Object} periodObj - Period info to determine adjustment.
     * @returns {number} Close day or adjusted day for far off future close days.
    */ 
    var adjustCloseDay = (periodObj => {
      const OPEN_TO_CLOSE_MAP = [1, 2, 3, 4, 5, 6, 0];

      var openObj  = periodObj.open;
      var closeObj = periodObj.close;
      var closeDay = periodObj.close.day;

      if (openObj.day !== closeObj.day) {
        /* Set to be at most one day of the week into the future. */
        closeDay = OPEN_TO_CLOSE_MAP[openObj.day];
      }
      /* else return original day */

      return closeDay;
    });

    /** 
     * @function DayOfWeek.checkFor24Hrs 
     * @description Determines if restaurant is open 24 hours.
     * @param {string} text - String checked for 24 hour regular expression.
     * @returns {boolean} Is open 24 hours.
    */ 
    var checkFor24Hrs = (text => {
      var regex = new RegExp(/open 24 hours/, 'gi');

      return regex.test(text);
    });

    /** 
     * @function DayOfWeek.checkForCrossover 
     * @description Determines if restaurant has open time in one day and close time in the next day (crossover).
     * @param {Object} periodObj - Period info to determine crossover.
     * @returns {boolean} Is restaurant a crossover.
    */ 
    var checkForCrossover = (periodObj => {
      var isCrossover = false;

      /* Need to check special case of when close day wrap around to 0. Only need to check one day in the future since the close day has already been checked and adjusted if needed. */      
      if ((periodObj.close.day > periodObj.open.day) 
          || ((periodObj.close.day === 0) && (periodObj.open.day === 6))) {
        isCrossover = true;
      }
      /* else isCrossover is already initialized to false. */

      return isCrossover;
    });
      
    var refDayIndex = (typeof(periodObj) !== 'undefined')
                      ? getRefDay(periodObj)
                      : 0;

    this.text        = weekdayTextStr;
    this.isOpen24Hrs = checkFor24Hrs(this.text);

    /* Do first to determine if default element is required.
       1) Closed days
       2) 24 hour restaurants
       3) Fill to end of week.
       NOTE: weekdayTxtStr is always populated for all days of the week either with hours, closed text or open 24 hours text. */
    var tmpPeriodObj = ((currDayIndex < refDayIndex) 
                        || (typeof(periodObj) === 'undefined') 
                        || (this.isOpen24Hrs))
      ? addDefaultPeriod(currDayIndex)
      : periodObj;

    /* Needs to be done after addDefaultPeriod and before checkForCrossover. */
    tmpPeriodObj.close.day = adjustCloseDay(tmpPeriodObj);

    this.open        = {day    : tmpPeriodObj.open.day,
                        time   : tmpPeriodObj.open.time,
                        hours  : tmpPeriodObj.open.hours,
                        minutes: tmpPeriodObj.open.minutes};
    this.close       = {day    : tmpPeriodObj.close.day,
                        time   : tmpPeriodObj.close.time,
                        hours  : tmpPeriodObj.close.hours,
                        minutes: tmpPeriodObj.close.minutes};
    this.isCrossover = checkForCrossover(tmpPeriodObj);
    this.isDefault   = (typeof(tmpPeriodObj.isDefault) === 'undefined')
                        ? false : true; /* isDefault is false if defined. */
  }

  return (() => {
    const PERIOD_SUNDAY = 0;
    const PERIOD_TO_WEEKDAY_MAP = [6, 0, 1, 2, 3, 4, 5]; 

    var hoursArray = [];

    var currDayIndex = PERIOD_SUNDAY;
    /* Use periodArray as the driver. 0 = Sunday. 6 = Saturday. weekdayTxtArray starts at 0 = Monday, so need to adjust for values. */
    for (let i = PERIOD_SUNDAY; 
          currDayIndex < PERIOD_TO_WEEKDAY_MAP.length 
          && i < periodArray.length; 
          i++) {

      var dayNum = getRefDay(periodArray[i]);  
      while (currDayIndex <= dayNum) {
        hoursArray.push(new DayOfWeek(currDayIndex,
                                      periodArray[i], 
                                      weekdayTextArray[PERIOD_TO_WEEKDAY_MAP[currDayIndex]]));
        currDayIndex++;
      }
    }

    /* Need to consider case where run out of periodArray values and still have days to process. Process these until end of week. */
    while (currDayIndex < PERIOD_TO_WEEKDAY_MAP.length) {
      hoursArray.push(new DayOfWeek(currDayIndex,
                                    undefined, 
                                    weekdayTextArray[PERIOD_TO_WEEKDAY_MAP[currDayIndex]]));
      currDayIndex++;
    }

    return hoursArray;
  })();
}
