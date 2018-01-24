/**
 * @file Constructs Address object for the Still Open application. 
 * @author Robert Brown, Joshua Lewis, Elaina Swann
 * @version 1.0 
*/

/** 
 * @constructor Address
 * @param {string} streetStr - Street portion of address.
 * @param {string} cityStr - City portion of address.
 * @param {string} stateStr - State portion of address.
 * @param {string} zipCodeStr - Zip code portion of address.
 * @returns {Object} Object with info for address processing.
*/
function Address(streetStr, cityStr, stateStr, zipCodeStr) {

  /** 
   * @function Address.convertAddress 
   * @description Converts address fields into string separated by commas.
   * @returns {string} Address comma-delimited string format.
  */
  this.convertAddress = (() => {
    return this.streetStr + "," +
           this.cityStr   + "," +
           this.stateStr  + "," +
           this.zipCodeStr;
  });

  /** 
   * @function Address.validateAddress 
   * @description Validates address against following criteria:
   *              1) Must have either city/state or zip code.
   *              2) If state exists, must be valid 2 digit state or
   *                 territory code.
   *              3) If zip code exists, must be 5 digits. (Number 
   *                 validated by form input type.)
   * @returns {Object} isValid {boolean}: Address has errors.
   *                   errorObj {Object}:
   *                     {isValidState {boolean}: valid state.
   *                      isValidZip {boolean}  : valid zip code.
   *                      hasMinInput {boolean} : min input rqmts met.
   *                      hasCityState {boolean}: city/state entered.
   *                      hasZipCode   {boolean}: zip code entered.} 
  */
  this.validateAddress = (() => {
    /* Includes US states and territories. */
    const STATE_CODES = ['AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC',
                         'FM','FL','GA','GU','HI','ID','IL','IN','IA','KS',
                         'KY','LA','ME','MH','MD','MA','MI','MN','MS','MO',
                         'MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP',
                         'OH','OK','OR','PW','PA','PR','RI','SC','SD','TN',
                         'TX','UT','VT','VI','VA','WA','WV','WI','WY'];
    const ZIP_LENGTH = 5;
    const STATE_LENGTH = 2;

    var isValid      = true;
    var errorObj = {
      isValidState: true,
      isValidZip:   true,
      hasMinInput:  true,
      hasCityState: true,
      hasZipCode:   true
    };

    if (this.stateStr.length > 0) {
      if ((this.stateStr.length !== STATE_LENGTH) 
         || (STATE_CODES.indexOf(this.stateStr) < 0)) {
        errorObj.isValidState = false;
      }
    }

    if (this.zipCodeStr.length > 0) {
      if (this.zipCodeStr.length !== ZIP_LENGTH) {
        errorObj.isValidZip = false;
      }
    }

    if (this.cityStr.length === 0 
        && this.stateStr.length === 0
        && this.zipCodeStr.length === 0) {
          errorObj.hasMinInput = false;
    }
    else if (this.zipCodeStr.length === 0 
            && !(this.cityStr.length > 0 && this.stateStr.length > 0)) {
          errorObj.hasCityState = false;
    }
    else if ((this.cityStr.length === 0 || this.stateStr.length === 0)
            && this.zipCodeStr.length === 0) {
          errorObj.hasZipCode = false;
    }

    if (!errorObj.isValidState 
        || !errorObj.isValidZip 
        || !errorObj.hasMinInput
        || !errorObj.hasCityState
        || !errorObj.hasZipCode) {
      isValid = false;
    }

    return {isValid:  isValid,
            errorObj: errorObj};
  });

  /** 
   * @function Address.toProperCase 
   * @description Converts string to proper case - first letter of word in uppercase followed by all lower case.
   * @returns {string} String formatted to proper case.
  */
  this.toProperCase = (str => {
    return str.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
  });

  this.streetStr  = this.toProperCase(streetStr);
  this.cityStr    = this.toProperCase(cityStr);
  this.stateStr   = stateStr.toUpperCase();
  this.zipCodeStr = zipCodeStr;
  this.addressStr = this.convertAddress();
}

/** 
 * @method street
 * @description Getter function for this.streetStr.
 * @returns {string} Street portion of address.
*/
Address.prototype.street = function() {
  return this.streetStr;
}

/** 
 * @method city
 * @description Getter function for this.cityStr.
 * @returns {string} City portion of address.
*/
Address.prototype.city = function() {
  return this.cityStr;
}

/** 
 * @method state
 * @description Getter function for this.stateStr.
 * @returns {string} State portion of address.
*/
Address.prototype.state = function() {
  return this.stateStr;
}

/** 
 * @method zip
 * @description Getter function for this.zipCodeStr.
 * @returns {string} Zip code portion of address.
*/
Address.prototype.zip = function() {
  return this.zipCodeStr;
}

/** 
 * @method address
 * @description Getter function for this.addressStr.
 * @returns {string} Formatted address.
*/
Address.prototype.address = function() {
  return this.addressStr;
}

/** 
 * @method isValid
 * @description Validates Address object.
   * @returns {Object} isValid {boolean}: Address has errors.
   *                   errorObj {Object}:
   *                     {isValidState {boolean}: valid state.
   *                      isValidZip {boolean}  : valid zip code.
   *                      hasMinInput {boolean} : min input rqmts met.
   *                      hasCityState {boolean}: city/state entered.
   *                      hasZipCode   {boolean}: zip code entered.} 
*/
Address.prototype.isValid = function() {
  return this.validateAddress();
}