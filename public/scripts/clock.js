// movie class
// plays a sequence of scenes

// define NAMESPACE
var LernDieUhr = window.LernDieUhr || {};

// clock class
LernDieUhr.Clock = (function(){

    //private properties
    centerX = 0;
    centerY = 0;
    mouseX = 0; 
    mouseY = 0; 
    mouseDown=0;
    alpha = 0;
    lastAlpha = 0;
    lastMouseX = 0;
    lastMouseY = 0;
    hour = 0;
    minute = 0;
    relX = 0;
    relY = 0;
    delta = 0; 
    rad2deg = 360/(2*Math.PI);
    direction = 1;
    completedHours = 0;
    pendingHour = 0;
    newHour = 0;
    attention = 0;
    _me = undefined;
    canvas = undefined;
    context = undefined;
    radius = 0;
    size = 0;
    model = undefined;

    // private functions
 
function checkNewHour(alpha, lastAlpha) {
  if ((Math.abs(alpha) < 90) && (Math.abs(lastAlpha) < 90)) {
    return 0;
    }
  if ((lastAlpha < 0) && (alpha >= 0)) {
    // clockwise
    return 1;
  }
  else if ((lastAlpha >= 0) && (alpha < 0)) {
    // anticlockwise
    return -1;
    }
  return 0;
  }

function checkDirection (alpha, lastAlpha, direction) {
  var dir = lastAlpha - alpha;
  // direction clockwise and angle anticlockwise
  if ((direction == 1)&&(dir < 0)) //clockwise
    {
    if (attention == 0) {
      attention = 1; // remember direction change
      }
    else {
      attention = 0;
      direction = -1;
      }
    }
  // direction anticlockwise and angle clockwise
  if ((direction == -1)&&(dir > 0))
    {
    if (attention == 0) {
      attention = 1; // remember direction change
      }
    else {
      attention = 0;
      direction = 1;
      }
    }
  return direction;
  } 

function calculatePhi(mouseX,mouseY) {
    if ((mouseX == lastMouseX)&&(mouseY == lastMouseY)) {
      return;
      }
    relX = mouseX - centerX;
    relY = mouseY - centerY;
    alpha = Math.atan2(relX, relY);
    newHour = checkNewHour(alpha*rad2deg , lastAlpha*rad2deg);
    lastAlpha = alpha;
    if (alpha < 0) {
      alpha = -alpha + Math.PI;
      }      
    else {
      alpha = Math.PI - alpha;
      }

    direction = checkDirection(alpha, lastAlpha, direction);
    // 
    delta = lastAlpha - alpha; 
    if (direction == -1) {
      delta = Math.abs(delta); 
      }
    else {
      delta = -1 * Math.abs(delta); 
      }
    minute = Math.floor((alpha*rad2deg)/6) % 60;
    if (newHour == 1) {
      completedHours+= 1;
      }
    else if (newHour == -1) {
      completedHours -= 1;
      if (minute == 0) {
        pendingHour = 1;
        }
      }
    else {
      pendingHour = 0;
      }
    if (completedHours < 0 ) {
      completedHours += 24;
      }
    completedHours = completedHours % 24; 
    hour = completedHours + pendingHour;
    model.setTime(hour,minute);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    }

function initialize() {
      var canvas = document.getElementById('mainarea');
      var myDiv = document.getElementById('maindiv');
      registerEvents();
      canvas.width = myDiv.offsetWidth;
      canvas.height = myDiv.offsetHeight;
      var width = canvas.width;
      var height = canvas.height;
      size = width;
      if (width >= height) {
        size = height;
        }
      radius = Math.floor(size/2);
      centerX = Math.floor(width/2);
      centerY = Math.floor(height/2);
      var context = canvas.getContext('2d');
      context.translate(centerX, centerY);

      var now=new Date();
      minute = now.getMinutes();
      completedHours = now.getHours();
      showTime();
      draw();
      };

   function registerEvents() {
      console.log("Clock::registerEvents()");
      canvas.addEventListener('mousedown', canvas_mouseDown, false);
      canvas.addEventListener('mousemove', canvas_mouseMove, false);
      window.addEventListener('mousemove', canvas_mouseMove, false);
      window.addEventListener('mouseup', canvas_mouseUp, false);
      canvas.addEventListener('touchstart', canvas_mouseDown, false);
      canvas.addEventListener('touchmove', canvas_mouseMove, false);
      window.addEventListener('touchmove', canvas_mouseMove, false);
      window.addEventListener('touchend', canvas_mouseUp, false);
      window.addEventListener('touchcancel', canvas_mouseUp, false);  
      window.addEventListener('resize', resizeCanvas, false);
      console.log("Clock::registerEvents() done");
    }

    function getMousePos(e) {
      if (!e)
        var e = event;
      if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        }
      else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
        }
      }

    function canvas_mouseUp() {
      mouseDown = 0;
      }

    function canvas_mouseDown() {
      mouseDown = 1;
      }

    function canvas_mouseMove(e) {
      getMousePos(e);
      showTime(mouseX, mouseY);
      if (mouseDown==1) {
        calculatePhi(mouseX,mouseY);
        draw();
        }
      e.preventDefault();
      }

function checkNewHour(alpha, lastAlpha) {
  if ((Math.abs(alpha) < 90) && (Math.abs(lastAlpha) < 90)) {
    return 0;
    }
  if ((lastAlpha < 0) && (alpha >= 0)) {
    // clockwise
    return 1;
  }
  else if ((lastAlpha >= 0) && (alpha < 0)) {
    // anticlockwise
    return -1;
    }
  return 0;
  }

function checkDirection (alpha, lastAlpha, direction) {
  var dir = lastAlpha - alpha;
  // direction clockwise and angle anticlockwise
  if ((direction == 1)&&(dir < 0)) //clockwise
    {
    if (attention == 0) {
      attention = 1; // remember direction change
      }
    else {
      attention = 0;
      direction = -1;
      }
    }
  // direction anticlockwise and angle clockwise
  if ((direction == -1)&&(dir > 0))
    {
    if (attention == 0) {
      attention = 1; // remember direction change
      }
    else {
      attention = 0;
      direction = 1;
      }
    }
  return direction;
  } 

function calculatePhi(mouseX,mouseY) {
    if ((mouseX == lastMouseX)&&(mouseY == lastMouseY)) {
      return;
      }
    relX = mouseX - centerX;
    relY = mouseY - centerY;
    alpha = Math.atan2(relX, relY);
    newHour = checkNewHour(alpha*rad2deg , lastAlpha*rad2deg);
    lastAlpha = alpha;
    if (alpha < 0) {
      alpha = -alpha + Math.PI;
      }      
    else {
      alpha = Math.PI - alpha;
      }

    direction = checkDirection(alpha, lastAlpha, direction);
    // 
    delta = lastAlpha - alpha; 
    if (direction == -1) {
      delta = Math.abs(delta); 
      }
    else {
      delta = -1 * Math.abs(delta); 
      }
    minute = Math.floor((alpha*rad2deg)/6) % 60;
    if (newHour == 1) {
      completedHours+= 1;
      }
    else if (newHour == -1) {
      completedHours -= 1;
      if (minute == 0) {
        pendingHour = 1;
        }
      }
    else {
      pendingHour = 0;
      }
    if (completedHours < 0 ) {
      completedHours += 24;
      }
    completedHours = completedHours % 24; 
    hour = completedHours + pendingHour;
    model.setTime(hour, minute);

    lastMouseX = mouseX;
    lastMouseY = mouseY;
    }

function showTime(mouseX, mouseY) {
        var hour;
        var minute;
        [hour, minute] = model.getTime();
        var displayHour = hour;
        var displayMinute = minute;
        if (hour < 10) {displayHour = "0" + hour};
        if (hour == 0) {displayHour = "00"};
        if (minute < 10) {displayMinute = "0" + minute};
        if (minute == 0) {displayMinute = "00"};
        var displayTime = displayHour + ":" + displayMinute;
	console.log(displayTime);
        if (_me.timechanged) {
          _me.timechanged(displayTime);
          }
    }

    function resizeCanvas() {
      var canvas = document.getElementById('mainarea');
      var myDiv = document.getElementById('maindiv');
      var oldSizeX = canvas.width;
      var oldSizeY = canvas.height;
      canvas.width = myDiv.offsetWidth;
      canvas.height = myDiv.offsetHeight;
      var width  = canvas.width;
      var height  = canvas.height;
      var scaleX = oldSizeX / width; 
      var scaleY = oldSizeY / height;
      if (width >= height) {
        size = height;
        }
      else {
        size = width;
        }
      radius = Math.floor(size/2);
      centerX = Math.floor(width/2);
      centerY = Math.floor(height/2);
      context = canvas.getContext('2d');
      context.translate(centerX, centerY);
      draw();
      }

    function draw() {
      var outerBorder = radius - 12;
      var innerBorder = radius - 21;
      var outerMinuteMark = radius - 30;
      var innerMinuteMark = radius - 40;
      var innerFiveMinuteMark = radius - 55;
      var innerNumber = radius - 70;
      var minuteHand = radius - 40;
      var hourHand = radius - 80;
      var secondHand = radius - 40;
      if (canvas.getContext) {
        var c2d=context;
        c2d.clearRect(-size/2,-size/2,size,size);
        //Define gradients for 3D / shadow effect
        var grad1=c2d.createLinearGradient(0,0,canvas.width,canvas.height);
        grad1.addColorStop(0,"#D83040");
        grad1.addColorStop(1,"#801020");
        var grad2=c2d.createLinearGradient(0,0,canvas.width,canvas.height);
        grad2.addColorStop(0,"#801020");
        grad2.addColorStop(1,"#D83040");
        c2d.font="Bold 20px Arial";
        c2d.textBaseline="middle";
        c2d.textAlign="center";
        c2d.lineWidth=1;
        c2d.save();
        c2d.beginPath();
        c2d.arc(0,0,outerBorder,0,Math.PI*2,true);
        c2d.fillStyle = "white";
        c2d.fill();
        c2d.stroke();
        //Outer bezel
        c2d.strokeStyle=grad1;
        c2d.lineWidth=10;
        c2d.beginPath();
        c2d.arc(0,0,outerBorder,0,Math.PI*2,true);
        //c2d.shadowOffsetX=4;
        //c2d.shadowOffsetY=4;
        //c2d.shadowColor="rgba(0,0,0,0.6)";
        //c2d.shadowBlur=6;
        c2d.stroke();
        //Inner bezel
        c2d.restore();
        c2d.strokeStyle=grad2;
        c2d.lineWidth=10;
        c2d.beginPath();
        c2d.arc(0,0,innerBorder,0,Math.PI*2,true);
        c2d.stroke();
        c2d.strokeStyle="#222";
        c2d.save();
        //c2d.translate(centerX,centerY);
        //Markings/Numerals
        for (i=1;i<=60;i++) {
          ang=Math.PI/30*i;
          sang=Math.sin(ang);
          cang=Math.cos(ang);
          //If modulus of divide by 5 is zero then draw an hour marker/numeral
          if (i % 5 == 0) {
            c2d.lineWidth=8;
            sx=sang*innerFiveMinuteMark;
            sy=cang* -1 * innerFiveMinuteMark;
            ex=sang*outerMinuteMark;
            ey=cang* -1 * outerMinuteMark;
            nx=sang*innerNumber;
            ny=cang* -1 * innerNumber;
            c2d.fillText(i/5,nx,ny);
          //Else this is a minute marker
          } else {
            c2d.lineWidth=2;
            sx=sang*innerMinuteMark;
            sy=cang*innerMinuteMark;
            ex=sang*outerMinuteMark;
            ey=cang*outerMinuteMark;
          }
          c2d.beginPath();
          c2d.moveTo(sx,sy);
          c2d.lineTo(ex,ey);
          c2d.stroke();
        }
        //Fetch the current time
        //var ampm="AM";
        var hrs;
        var min;
        [hrs, min] = model.getTime();
        var sec = 0;
        c2d.strokeStyle="#000";
        //Draw AM/PM indicator
        //if (hrs>=12) ampm="PM";
        //c2d.lineWidth=1;
        //c2d.strokeRect(21,-14,44,27);
        //c2d.fillText(ampm,43,0);
        c2d.lineWidth=Math.floor(size*6/300);
        c2d.save();
        //Draw clock pointers but this time rotate the canvas rather than
        //calculate x/y start/end positions.
        //
        //Draw hour hand
        c2d.rotate(Math.PI/6*(hrs+(min/60)+(sec/3600)));
        c2d.beginPath();
        c2d.moveTo(0,10);
        c2d.lineTo(0,-1* hourHand);
        c2d.stroke();
        c2d.restore();
        c2d.save();
        //Draw minute hand
        c2d.rotate(Math.PI/30*(min+(sec/60)));
        c2d.beginPath();
        c2d.moveTo(0,20);
        c2d.lineTo(0,-1 * minuteHand);
        c2d.stroke();
        c2d.restore();
        //c2d.save();
        //Draw second hand
        //c2d.rotate(Math.PI/30*sec);
        //c2d.strokeStyle="#E33";
        //c2d.beginPath();
        //c2d.moveTo(0,20);
        //c2d.lineTo(0,-secondHand);
        //c2d.stroke();
        c2d.restore();
        
        //Additional restore to go back to state before translate
        //Alternative would be to simply reverse the original translate
        //c2d.restore();
        //setTimeout(draw,1000);
      }
    }

    // module properties
    var Clock = function(){
        this.moduleProperty = 1;
        return this;
    };
    // module methods
    Clock.prototype.init = function(_model, _size,_centerX, _centerY ) {
        model = _model;
        canvas = model.getValue("Canvas");
        //if (_me == undefined) {
          this.context = canvas.getContext('2d');
          context = this.context;
          size = _size;
          this.timechanged = undefined;
          _me = this;
      //    }
      registerEvents();
      this.radius = Math.floor(size/2);
      radius = this.radius;
      this.centerX = _centerX;
      centerX = this.centerX;
      this.centerY = _centerY;
      centerY = this.centerY;
      this.context.translate(centerX, centerY);

      var now=new Date();
      this.minute = now.getMinutes();
      this.completedHours = now.getHours();
      //minute = this.minute;
      //completedHours = this.completedHours;
      model.setTime(this.completedHours, this.minute);
      showTime();
      draw();

       };

    Clock.prototype.draw = function() {
        return draw();
        }
    Clock.prototype.resizeCanvas = function() {
        return resizeCanvas();
        }
    Clock.prototype.animate = function(timestamp) {

      return true;
      }



    return Clock;
})();
