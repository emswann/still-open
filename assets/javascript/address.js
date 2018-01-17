function Address(streetStr, cityStr, stateStr, zipCodeStr) {

  this.convertAddress = function() {
    return this.streetStr + "," +
           this.cityStr   + "," +
           this.stateStr  + "," +
           this.zipCodeStr;
  }

  this.validateAddress = function() {
    // TBD.
    return true;
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