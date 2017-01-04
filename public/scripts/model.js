// JS module pattern

// define LernDieUhr
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Model = (function(){
    // private properties
    var observers;
    var data = {};
    
    // private functions

    // module properties
    var Model = function(){
        this.data = data;
        return this;
    };

    // module methods
    Model.prototype.setValue = function(key, value) {
        this.data[key] = value;
        // notfiy change
        var myEvent = new CustomEvent('DataChanged', {'Data':key});
        document.dispatchEvent(myEvent);
        };

    Model.prototype.setTime = function(hour, minute) {
        this.data['time'] = [hour, minute];
        // notfiy change
        var myEvent = new CustomEvent('DataChanged', {'Data':'time'});
        document.dispatchEvent(myEvent);
        };

    Model.prototype.getTime = function() {
        return this.data['time'];
        };

    Model.prototype.getValue = function(key) {
        return this.data[key];
        };
    return Model;
})();
// end of Model

// create instance
var instance = new LernDieUhr.Model();
