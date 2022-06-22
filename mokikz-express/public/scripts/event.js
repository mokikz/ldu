// JS module pattern

// define LernDieUhr
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Event = (function(){
    // private properties

    // private functions

    // module properties
    var Event = function(sender) {
      this._sender = sender;
      this._listeners = [];
      return this;
    };

    // module methods
    Event.prototype.attach = function(listener) {
        console.log ("Event::attach()");
        this._listeners.push(listener);
        };

    Event.prototype.notify: function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    };

    return Event;
})();
// end of Event

// create instance
// var instance = new LernDieUhr.Event();
