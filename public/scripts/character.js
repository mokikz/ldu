// JS module pattern

// define LernDieUhr
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Character = (function(){
    // private properties
    var model = undefined;
    var frameIndex = 0;
    var tickCount = 0;
    var ticksPerFrame = 0;
    var numberOfFrames = 1;

    // private functions
    function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function blink () {
      var div = document.getElementById("Eyes");
      if ( div.classList.contains('blink') ) {
        div.classList.toggle('blink');
        setTimeout(blink, rand(3300,6000)); // intervall zwischen Lidschlaegen
        }
      else {
        div.classList.add('blink');
        setTimeout(blink, rand(300,400)); //dauer Lidschlag 
        //div.classList.remove('Move');
        }
      }

    // module properties
    var Character = function(_model, options){
      var that = this;
      model = _model;
      that.visible = true;
      return that;
    };

    // module methods
    Character.prototype.init = function(_model) {
        console.log ("Character::moduleMethod()" + this.moduleProperty);
        model = _model;
        blink();
        };

    Character.prototype.isVisible = function() {
        return that.visible;
        };


    return Character;
})();
// end of Character

// create instance
// var instance = new LernDieUhr.Character();

/*
(function () {
            
    var coin,
        coinImage,
        canvas;                    

    function gameLoop () {
    
      window.requestAnimationFrame(gameLoop);

      coin.update();
      coin.render();
    }
    
    function sprite (options) {
    
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;
        
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        
        that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;
                
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {    
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };
        
        that.render = function () {
        
          // Clear the canvas
          that.context.clearRect(0, 0, that.width, that.height);
          
          // Draw the animation
          that.context.drawImage(
            that.image,
            frameIndex * that.width / numberOfFrames,
            0,
            that.width / numberOfFrames,
            that.height,
            0,
            0,
            that.width / numberOfFrames,
            that.height);
        };
        
        return that;
    }
    
    // Get canvas
    canvas = document.getElementById("coinAnimation");
    canvas.width = 100;
    canvas.height = 100;
    
    // Create sprite sheet
    coinImage = new Image();    
    
    // Create sprite
    coin = sprite({
        context: canvas.getContext("2d"),
        width: 1000,
        height: 100,
        image: coinImage,
        numberOfFrames: 10,
        ticksPerFrame: 4
    });
    
    // Load sprite sheet
    coinImage.addEventListener("load", gameLoop);
    coinImage.src = "images/coin-sprite-animation.png";

} ());
*/
