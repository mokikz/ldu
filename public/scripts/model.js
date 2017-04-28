// JS module pattern

// define LernDieUhr
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Model = (function(){
    // private properties
    var observers;
    var data = {};
    var persistence = undefined;
    var initialized = false;
    // private functions

    function sendEvent(type, data) {
        if (isIE) {
            var myEvent = document.createEvent("CustomEvent");
            myEvent.initEvent(type, true, false, type);
            }
        else {
            var myEvent = new CustomEvent(type , data);
            }
        document.dispatchEvent(myEvent);
    };

    // module properties
    var Model = function(){
        persistence = new LernDieUhr.Persistence();
        persistence.init(this);
        //data = persistence.restoreData();
        this.data = data;
        return this;
    };

    // module methods
    Model.prototype.increaseValue = function(key, byNumber) {
        console.log("Model::increaseValue(" + key + ")");
        var value = this.data[key];
        if (byNumber) {
            value += byNumber;
        } else {
            value++;
            }
        this.data[key] = value;
        
        // notfiy change
        // var myEvent = new CustomEvent('DataChanged', {'Data':key});
        // document.dispatchEvent(myEvent);
        sendEvent('DataChanged', {'Data':key});
        return value;
        };

    Model.prototype.setValue = function(key, value) {
        console.log("Model::setValue(" + key + ")");
        this.data[key] = value;
        // notfiy change
        sendEvent('DataChanged', {'Data':value});
        };

    Model.prototype.setData = function(value) {
        console.log("Model::setData()");
        this.data = value;
        // notfiy change
        sendEvent('DataChanged', {'Data':value});
        };

    Model.prototype.setTime = function(hour, minute) {
        // if minute is undefined keep current value
        if (minute == undefined) {
          minute = this.data['time'][1];
          }
        if (hour == undefined) {
          hour = this.data['time'][0];
          }
        console.log("Model::setTime(" + hour + "," + minute + ")");
        this.data['time'] = [hour, minute];
        // notfiy change
        sendEvent('DataChanged', {'Data':[hour, minute]});
        };

    Model.prototype.getTime = function() {
        console.log("Model::getTime()");
        return this.data['time'];
        };

    Model.prototype.getValue = function(key) {
        console.log("Model::getValue(" + key + ")");
        if (key === undefined) {
          return this.data;  
          }
        return this.data[key];
        };
   
    Model.prototype.refreshViews = function() {
        console.log("Model::refresh()");
        // notfiy change
        sendEvent('refreshView');
        };

    Model.prototype.initialized = function() {
        return initialized;
        };

    Model.prototype.reset = function() {
	this.setValue("currentLevel", -1);
	this.setValue("currentWorld", 0);
	this.setValue("completedLevels", 0);
        initialized = false;
        return true;
        };

    Model.prototype.persist = function() {
        console.log("Model::persist()");
        persistence.persistData(this.data); 
        };

    Model.prototype.restore = function() {
        console.log("Model::restore()");
        var restoredData = persistence.restoreData(); 
        if (restoredData === undefined) {
          return false; 
          }
        this.data = restoredData;
        initialized = true;
        return true;
        };

    return Model;
})();
// end of Model

// create instance
//var instance = new LernDieUhr.Model();
