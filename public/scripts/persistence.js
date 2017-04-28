// JS module pattern
// store current level and score in cookie and on server

// define NAMESPACE
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Persistence = (function(){
    // private properties
    model = undefined;
    cookieName = "GameState";

    // private functions
    function privateMethod() {
        console.log("Persistence::privateMethod()")
    }

    // module properties
    var Persistence = function(){
        this.moduleProperty = 1;
        return this;
    };

    // module methods
    Persistence.prototype.init = function(_model) {
        console.log("Persistence::init()");
        model = _model;
        //window.addEventListener("unload",  Persistence.prototype.persistData, false); 
        };

    Persistence.prototype.restoreData = function() {
      console.log("Persistence::restoreData()");
      //var cookie = $.cookie(cookieName);
      var val = $.cookie(cookieName);
      // var val = cookie.replace(cookieName + "=", "");
      // val = val.replace("; expires=Fri, 31 Dec 9999 23:59:59 GMT", "");
      // if (val) {
      if (val) {
        var serializedData =  window.atob(val);     
        var data = JSON.parse(serializedData);
        if (data) {
          return data;
          }
        else {
          console.log("Persistence::restoreData(): no cookie found");
          }
        }
      return undefined;
      };

    Persistence.prototype.persistData = function(data) {
      console.log("Persistence::persistData()");
      if (data) {
        var minimizedData = JSON.parse(JSON.stringify(data));
        minimizedData["Canvas"] = undefined;
        var serializedData =  window.btoa(JSON.stringify(minimizedData));     
        if (serializedData) {
          //document.cookie = cookieName + "=" + serializedData + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
          $.cookie(cookieName, serializedData, { expires: 28 });
          }
        else {
          console.log("Persistence::persistData(): error serializing data");
          return false;
          }
        }
      return true;
      };

    return Persistence;
})();
// end of Persistence
