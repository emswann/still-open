function Address(streetStr, cityStr, stateStr, zipCodeStr) {

  this.convertAddress = function() {
    return this.streetStr + "," +
           this.cityStr   + "," +
           this.stateStr  + "," +
           this.zipCodeStr;
  }

  this.validateAddress = function() {
    const STATE_CODES = ['AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC',
                         'FM','FL','GA','GU','HI','ID','IL','IN','IA','KS',
                         'KY','LA','ME','MH','MD','MA','MI','MN','MS','MO',
                         'MT','NE','NV','NH','NJ','NM','NY','NC','ND','MP',
                         'OH','OK','OR','PW','PA','PR','RI','SC','SD','TN',
                         'TX','UT','VT','VI','VA','WA','WV','WI','WY'];
    const ZIP_LENGTH = 5;
    const STATE_LENGTH = 2;

    var isValid      = true; /* Generic boolean to indicate an error exists. */
    var errorObj = {         /* Indicates which errors exist. */
      isValidState: true,
      isValidZip:   true,
      hasMinInput:  true,
      hasCityState: true,
      hasZipCode:   true
    };

    /* Zip code and state are optional as long as have either city/state or zip code. */
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

    /* Check if zipcode is missing, then have city AND state. If city or state is missing, then have zipcode. Also, check if all values are missing.*/
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
  }

  this.toProperCase = function(str) {
    return str.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
  }

  this.streetStr  = this.toProperCase(streetStr);
  this.cityStr    = this.toProperCase(cityStr);
  this.stateStr   = stateStr.toUpperCase();
  this.zipCodeStr = zipCodeStr;
  this.addressStr = this.convertAddress();
}

Address.prototype.street = function() {
  return this.streetStr;
}

Address.prototype.city = function() {
  return this.cityStr;
}

Address.prototype.state = function() {
  return this.stateStr;
}

Address.prototype.zip = function() {
  return this.zipCodeStr;
}

Address.prototype.address = function() {
  return this.addressStr;
}

Address.prototype.isValid = function() {
  return this.validateAddress();
}