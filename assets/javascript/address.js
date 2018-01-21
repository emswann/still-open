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

    var isValid = true;

    /* Check state code is valid. Zip code is optional. */
    if (this.zipCodeStr.length > 0) {
      if (this.zipCodeStr.length !== ZIP_LENGTH) {
        isValid = false;
      }
    }

    if ((this.stateStr.length !== STATE_LENGTH) 
             || (STATE_CODES.indexOf(this.stateStr) < 0)) {
      isValid = false;
    }

    return isValid;
  }

  this.toProperCase = function(str) {
    return str.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
  }

  this.streetStr  = this.toProperCase(streetStr);
  this.cityStr    = this.toProperCase(cityStr);
  this.stateStr   = stateStr.toUpperCase();
  this.zipCodeStr = zipCodeStr;
  this.addressStr = this.convertAddress();
  this.isValid    = this.validateAddress();
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
  return this.isvalid;
}