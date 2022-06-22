// sprite class
function Sprite(context, x, y, img,frames, startFrame){
this.context = context;
this.ready = 0;
this.x = x;
this.y = y;
this.frames = frames;
this.frame = startFrame;
this.sizeX = 256;
this.sizeY = 256;
this.spriteSheet = img;
if (this.frame == undefined)
{
this.frame = 0;
}
}; 

// methods
Sprite.prototype.animate = function () {
this.frame = (this.frame + 1) % this.frames;
var clipX = this.frame * this.sizeX;
var clipY = 0;
context.drawImage(this.spriteSheet,clipX, clipY, this.sizeX, this.sizeY,this.x,this.y,256,256);
};

Sprite.prototype.move = function(x,y) {
    //translate coords
    this.x = x - 128;
    this.y = y - 256;
    };

// end of sprite class

// Intro class
function Intro(context, img) {
Intro.prototype = new Sprite();
Intro.prototype.constructor = Intro;
this.context = context;
this.ready = 0;
this.x = 0;
this.y = 0;
this.frames = 70;
this.frame = 0;
this.sizeX = context.canvas.width;
this.sizeY = context.canvas.height;
this.spriteSheet = img;
this.painted = false;
this.imgWidth = img.width;
this.imgHeight = img.height;
this.scaleX = this.sizeX / this.imgWidth;
this.scaleY = this.sizeY / this.imgHeight;
this.stepScale = 0.015
this.stepTranslate = -7;
this.translateX = 0;
this.translateY = 0;
if (this.scaleX < this.scaleY) {
    this.scale = this.scaleX;
    }
else {
    this.scale = this.scaleY;
    };
//this.clipX = imgWidth - this.sizeX;
//if (this.clipX < 0) {
this.clipX = 0;
//} 
//this.clipY = imgHeight - this.sizeY;
//if (this.clipY < 0) {
this.clipY = 0;
this.centerX = 750;
this.centerY = 500;
//} 
};

Intro.prototype.animate = function() {
    this.frame += 1;
    if (this.frame < this.frames) {
    this.scale += this.stepScale;
    this.translateX += this.stepTranslate;
    this.translateY += this.stepTranslate;
    }
    this.context.save();
    this.context.scale(this.scale,this.scale);
    this.context.translate(this.translateX, this.translateY);
    this.context.drawImage(this.spriteSheet,
                           this.clipX, this.clipY, 
                           this.imgWidth, this.imgHeight,
                           0,0,
                           //this.sizeX, this.sizeY
                           this.imgWidth, this.imgHeight
                          );
        
    this.context.restore();
};
