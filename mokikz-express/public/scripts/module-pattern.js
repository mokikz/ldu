// JS module pattern

// define NAMESPACE
var NAMESPACE = window.NAMESPACE || {};
NAMESPACE.MODULE = (function(){
    // private properties
    privateVariable = 4;

    // private functions
    function privateMethod() {
        console.log("MODULE::privateMethod()")
    }

    // module properties
    var MODULE = function(){
        this.moduleProperty = 1;
        return this;
    };

    // module methods
    MODULE.prototype.moduleMethod = function() {
        console.log ("MODULE::moduleMethod()" + this.moduleProperty);
        console.log ("MODULE::moduleMethod()" + privateVariable);
        privateMethod();
        };
    return MODULE;
})();
// end of MODULE

// create instance
var instance = new NAMESPACE.MODULE();
