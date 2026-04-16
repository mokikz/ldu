'use strict';
// eslint-disable-next-line no-undef, no-var
var LernDieUhr = window.LernDieUhr || {};

LernDieUhr.Dragon = (function () {
  var SIZE           = 60;
  var WALK_FRAME_COUNT = 4;
  var WALK_INTERVAL  = 130; // ms per frame

  var Dragon = function () {
    this._ctx        = null;
    this._nodeRadius = 22;
    this._spriteImg  = null;
    this._fallbackImg = null;
    this._curFrame   = 0;
    this._lastTime   = 0;
  };

  // Exposed so callers can use it for layout math (e.g. door positioning)
  Dragon.SIZE = SIZE;

  Dragon.prototype.init = function (ctx, nodeRadius) {
    this._ctx        = ctx;
    this._nodeRadius = nodeRadius;

    this._spriteImg      = new Image();
    this._spriteImg.src  = '/images/mokikz_walking_spritemap.png';
    this._fallbackImg     = new Image();
    this._fallbackImg.src = '/images/mokikz_256.png';
  };

  Dragon.prototype.draw = function (x, y, timestamp) {
    var ctx        = this._ctx;
    var nodeRadius = this._nodeRadius;

    // Glow ring behind the dragon
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,200,255,0.7)';
    ctx.lineWidth   = 3;
    ctx.stroke();

    // Advance walk frame when the interval has elapsed
    if (timestamp - this._lastTime >= WALK_INTERVAL) {
      this._curFrame = (this._curFrame + 1) % WALK_FRAME_COUNT;
      this._lastTime = timestamp;
    }

    var destX = x - SIZE / 2;
    var destY = y - SIZE - nodeRadius + 8;

    var sprite = this._spriteImg;
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Each frame occupies one quarter of the sprite map width
      var frameW = sprite.naturalWidth / WALK_FRAME_COUNT;
      ctx.drawImage(sprite,
        this._curFrame * frameW, 0, frameW, sprite.naturalHeight, // source rect
        destX, destY, SIZE, SIZE);                                  // dest rect
    } else if (this._fallbackImg && this._fallbackImg.complete && this._fallbackImg.naturalWidth > 0) {
      ctx.drawImage(this._fallbackImg, destX, destY, SIZE, SIZE);
    }
  };

  return Dragon;
})();
