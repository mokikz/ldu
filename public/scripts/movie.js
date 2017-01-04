// movie class
// plays a sequence of scenes

// define NAMESPACE
var Intro = window.Intro || {};

// scene class
Intro.Scene = (function(){
    var me = {};
    
    // module properties
    me.fps = 25;
    me.context = null;
    me.scaleX = 1;
    me.scaleY = 1;
    me.translateX = 0;
    me.translateY = 0;

    me.Scene = function(){
        return me;
    };

    // module methods
    me.calculateFrames = function(duration) {
        return Math.floor((duration * me.fps) / 1000);
        };

    me.init = function(context, img, duration, opt) {
        me.context = context;
        me.img = img;
        me.duration = duration;
        me.scaleX = opt[0];
        me.scaleY = opt[1];
        me.translateX = opt[2];
        me.translateY = opt[3];
        };
 
    me.animate = function() {
        alert ("missing animate implementation");
        };

    return me;
}());
// end of scene

// Fade
Intro.Fade = (function(){
    // private properties
    var _fps = 25;
    // private functions

    // module properties
    var Fade = function(){
        this.moduleProperty = 1;
        return this;
    };

    Fade.prototype.calculateFrames = function(duration) {
        return Math.floor((duration * _fps) / 1000);
        };

    // module methods
    Fade.prototype.init = function(context, img, opt) {
        this.context = context;
        this.img = img;
        this.duration = opt[0];
        this.scaleX = this.img.width / this.context.canvas.width;
        this.scaleY = this.img.height / this.context.canvas.height;
        this.startTime = 0;
       };

    Fade.prototype.animate = function(timestamp, scenePlayed) {
        var elapsed = timestamp-this.startTime;
        if (this.startTime == 0) {
            this.startTime = timestamp;
            elapsed = 0;
            console.log("Start=" + this.startTime);
            }
        if (elapsed >= this.duration) {
            console.log("scene played, elapsed=%d", elapsed);
            scenePlayed();
            return false;
            }
        else {
            // calculate x = f(t)
            var transparency = 1 - (elapsed/this.duration);
            console.log("start= %d elapsed=%d transparency=%d", this.startTime, elapsed, transparency);
            this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height); 
            this.context.save();
            this.context.globalAlpha = Math.max(0, transparency);
            this.context.drawImage(this.img, 0,0,
                this.img.width, this.img.height,
                0,0,
                this.context.canvas.width, this.context.canvas.height
                ); 
            this.context.restore();
            }
        return true;
        }

    return Fade;
})();

Intro.FadeIn = (function(){
    // private properties
    var _fps = 25;
    // private functions

    // module properties
    var FadeIn = function(){
        this.moduleProperty = 1;
        return this;
    };

    FadeIn.prototype.calculateFrames = function(duration) {
        return Math.floor((duration * _fps) / 1000);
        };

    // module methods
    // FadeIn(context, img, duration, scaleX, scaleY,transX, transY, fade) {
    // Zoom  (context, img, duration,  0    1     2       3        4           5        6)
    FadeIn.prototype.init = function(context, img, opt) {
        this.context = context;
        this.img = img;
        this.duration = opt[0];
        this.scaleX = this.img.width / this.context.canvas.width;
        this.scaleY = this.img.height / this.context.canvas.height;
        this.startTime = 0;
       };

    FadeIn.prototype.animate = function(timestamp, scenePlayed) {
        var elapsed = timestamp-this.startTime;
        if (this.startTime === 0) {
            this.startTime = timestamp;
            elapsed = 0;
            }
        if (elapsed >= this.duration) {
            scenePlayed();
            return false;
            }
        else {
            // calculate x = f(t)
            var transparency = elapsed/this.duration;
            this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height); 
            this.context.save();
            this.context.globalAlpha = Math.min(1, transparency);
            this.context.drawImage(this.img, 0,0,
                this.img.width, this.img.height,
                0,0,
                this.context.canvas.width, this.context.canvas.height
                ); 
            this.context.restore();
            }
        return true;
        }

    return FadeIn;
})();
// end of module Fade

Intro.Zoom = (function(){
    // private properties
    var _fps = 25;
    // private functions

    // module properties
    var Zoom = function(){
        this.scaleX = 1;
        this.scaleY = 1;
        return this;
    };

    Zoom.prototype.calculateFrames = function(duration) {
        return Math.floor((duration * _fps) / 1000);
        };

    // module methods
    // Zoom (context, img, duration, toX, toY, width, height, translatex, translatey, fade)
    // Zoom (context, img, duration,  0    1     2       3        4           5        6)
    Zoom.prototype.init = function(context, img, opt) {
        this.context = context;
        this.img = img;
        this.duration = opt[0];
        this.toX = opt[1];
        this.toY = opt[2];
        this.toWidth = opt[3];
        this.toHeight = opt[4];
        if (this.toX != 0) {
            this.slope = this.toY / this.toX;
            }
        else {
            this.slope = undefined;
            }
        if (!this.toWidth) {
            this.toWidth = img.width;
            }
        if (!this.toHeight) {
            this.toHeight = img.height;
            }
        this.dw = img.width - this.toWidth;
        this.dh = img.height - this.toHeight;
        this.startTime = 0;
       };

    Zoom.prototype.animate = function(timestamp, scenePlayed) {
        var elapsed = timestamp-this.startTime;
        if (this.startTime === 0) {
            this.startTime = timestamp;
            elapsed = 0;
            }
        if (elapsed >= this.duration) {
            scenePlayed();
            return false;
            }
        else {
            // calculate x = f(t)
            var dt = Math.min(1, elapsed/this.duration);
            var x = dt * this.toX;

            // calculate y = f(x)
            var y;
            if (this.slope) {
                y = this.slope * x;
                }
            else {
                y = dt * this.toY; 
                }
            var width = this.img.width - (this.dw * dt);
            var height = this.img.height - (this.dh * dt);
            x = Math.floor(x);
            y = Math.floor(y);
            width = Math.floor(width);
            height = Math.floor(height);
            this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height); 
            this.context.save();
            //var scaleX= this.ScaleX * fraction;
            //var scaleY= this.ScaleY * fraction;
            //var transY= this.translateY * fraction;
            //this.context.translate(x, y);
            //this.context.scale(scaleX,scaleY);
            console.log("elapsed: %5.2f, pos (%d/%d) width, height (%f/%f)", elapsed, x, y, width, height);
            this.context.drawImage(this.img, x,y,
                width, height,
                0,0,
                this.context.canvas.width, this.context.canvas.height
                //this.img.width, this.img.height
                ); 
            this.context.restore();
            }
        return true;
        }

    return Zoom;
})();
// end of module Zoom

Intro.Pann = (function(){
    // private properties
    var _fps = 25;
    // private functions

    // module properties
    var Pann = function(){
        this.scaleX = 1;
        this.scaleY = 1;
        return this;
    };

    Pann.prototype.calculateFrames = function(duration) {
        return Math.floor((duration * _fps) / 1000);
        };

    // module methods
    // Pann (context, img, duration,  X,   Y, width, height, translatex, translatey )
    // Pann (context, img, duration,  0    1     2       3        4           5     )
    Pann.prototype.init = function(context, img, opt) {
        this.context = context;
        this.img = img;
        this.duration = opt[0];
        this.startX = opt[1];
        this.startY = opt[2];
        this.width = opt[3];
        this.height = opt[4];
        this.translateX = opt[5];
        this.translateY = opt[6];
        if (this.translateX != 0) {
            this.slope = this.translateY / this.translateX;
            }
        else {
            this.slope = undefined;
            }
        if (this.translateX == undefined) {
            this.translateX = img.width - this.width;
            }
        if (this.translateY == undefined) {
            this.translateY = img.height - this.height;
            }
        this.startTime = 0;
       };

    Pann.prototype.animate = function(timestamp, scenePlayed) {
        var elapsed = timestamp-this.startTime;
        if (this.startTime === 0) {
            this.startTime = timestamp;
            elapsed = 0;
            }
        if (elapsed >= this.duration) {
            scenePlayed();
            return false;
            }
        else {
            // calculate x = f(t)
            var dt = Math.min(1, elapsed/this.duration);
            var x = this.startX + dt * this.translateX;

            // calculate y = f(x)
            var y;
            if (this.slope) {
                y = this.slope * x;
                }
            else {
                y = this.startY + dt * this.translateY; 
                }
            var width = this.width;
            var height = this.height;
            x = Math.floor(x);
            y = Math.floor(y);
            width = Math.floor(width);
            height = Math.floor(height);
            this.context.clearRect(0,0, this.context.canvas.width, this.context.canvas.height); 
            this.context.save();
            console.log("elapsed: %5.2f, pos (%d/%d) width, height (%f/%f)", elapsed, x, y, width, height);
            this.context.drawImage(this.img, x,y,
                width, height,
                0,0,
                this.context.canvas.width, this.context.canvas.height
                //this.img.width, this.img.height
                ); 
            this.context.restore();
            }
        return true;
        }

    return Pann;
})();
// end of module Zoom

var Movie = {
    playing: false,
    scenes: [],
    currentScene: -1,
    images: [],
    start: 0,

    // methods
    init: function (context, moviePlayed) {
        Movie.context = context;
        Movie.moviePlayed = moviePlayed;
    },

    addScene : function(typeOfScene, img, duration, options) {
        var scene;
        Movie.images.push(img);
        // scene (duration, scalex, scaley, translatex, translatey, fade)
        switch (typeOfScene) {
        case "FadeOut":
        case "Fade":
            scene = new Intro.Fade();
            scene.init(Movie.context, img, duration, options);
            break;
        case "FadeIn":
            scene = new Intro.FadeIn();
            scene.init(Movie.context, img, duration, options);
            break;
        case "Zoom":
            scene = new Intro.Zoom();
            // Zoom (context, img, duration, toX, toY, width, height, translatex, translatey, fade)
            scene.init(Movie.context, img, duration, options);
            break;
        case "Pan":
        case "Pann":
            scene = new Intro.Pann();
            // Zoom (context, img, duration, startX, startY, width, height, translatex, translatey)
            scene.init(Movie.context, img, duration, options);
            break;
        default:
            scene = new Intro.Scene();
            }
        Movie.scenes.push(scene);
        }, 
        
    nextScene : function() {
        console.timeEnd("scene");
        Movie.currentScene +=1;
        if (Movie.currentScene >= Movie.scenes.length) {
            Movie.playing = false;
        Movie.moviePlayed();
        }
        else {
           console.time("scene");
       Movie.renderFrame();
           }
        },

    play : function() {
        Movie.playing = true;
        Movie.start= new Date().getTime();
        console.time("scene");
        Movie.nextScene();
        },

    renderFrame : function (timestamp) {
        // context.clearRect(0,0, canvas.width, canvas.height);
        if (Movie.playing) {
            if (timestamp) {
                if (Movie.scenes[Movie.currentScene].animate(timestamp, Movie.nextScene)) {
                    //var requestAnimationId = setTimeout(Movie.renderFrame, timeout);
                    requestAnimationFrame(Movie.renderFrame);
                    }
                }
            else {
                // first frame
                requestAnimationFrame(Movie.renderFrame);
                } 
            }
        }
    }




