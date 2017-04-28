// JS module pattern

// define LernDieUhr
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Cache = (function(){
    // private properties
    cache = undefined;
    cacheStatusValues = [];
    cacheStatusValues[0] = 'uncached';
    cacheStatusValues[1] = 'idle';
    cacheStatusValues[2] = 'checking';
    cacheStatusValues[3] = 'downloading';
    cacheStatusValues[4] = 'updateready';
    cacheStatusValues[5] = 'obsolete';
    _me = undefined;

    // private functions
    function logEvent(e) {
      var footer = document.getElementById('online');
      var online, status, type, message;
      online = (navigator.onLine) ? 'yes' : 'no';
      status = cacheStatusValues[cache.status];
      type = e.type;
      message = 'online: ' + online;
      message+= ', event: ' + type;
      message+= ', status: ' + status;
      if (type == 'error' && navigator.onLine) {
        message+= ' error';
        }
      footer.innerHTML = message; 
      }

    // module properties
    var Cache = function(){
        this.moduleProperty = 1;
        _me = this;
        return this;
    };

    // module methods
    Cache.prototype.update = function(callback) {
        window.applicationCache.update()
        setInterval(function(){cache.update()}, 10000);
        console.log ("Cache::init() done");
        };

    Cache.prototype.init = function(callback) {
        cache = window.applicationCache;
        if (_me != undefined) {
          _me = this;
          }
        cache.addEventListener('cached', logEvent, false);
        cache.addEventListener('checking', logEvent, false);
        cache.addEventListener('downloading', logEvent, false);
        cache.addEventListener('error', logEvent, false);
        cache.addEventListener('noupdate', logEvent, false);
        cache.addEventListener('obsolete', logEvent, false);
        cache.addEventListener('progress', logEvent, false);
        cache.addEventListener('updateready', logEvent, false);
        window.applicationCache.addEventListener(
          'updateready',
          function(){
            window.applicationCache.swapCache();
            console.log('swap cache has been called');
            },
            false
          );
        setInterval(function(){cache.update()}, 10000);
        console.log ("Cache::init() done");
        };
    return Cache;
})();
// end of Cache

// create instance
var instance = new LernDieUhr.Cache();

