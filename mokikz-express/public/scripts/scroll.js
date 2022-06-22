// inside main_javascript.js

var can = document.getElementById('canvas1');

// The 2D Context for the HTML canvas element. It
// provides objects, methods, and properties to draw and
// manipulate graphics on a canvas drawing surface.
var ctx = can.getContext('2d');

// canvas width and height
can.width = 1200;
can.height = 1620;

// create an image element
var img = new Image();

// specify the image source relative to the html or js file
// when the image is in the same directory as the file
// only the file name is required:
img.src = "/images/background-landscape.jpg";

// window.onload is an event that occurs when all the assets
// have been successfully loaded( in this case only the spacebg.png)
window.onload = function() {
	// the initial image height
	var imgHeight = 0;

	// the scroll speed
	// an important thing to ensure here is that can.height
	// is divisible by scrollSpeed
	var scrollSpeed = 10;

	// this is the primary animation loop that is called 60 times
	// per second
	function loop()
	{
		// draw image 1
		ctx.drawImage(img, 0, imgHeight);

		// draw image 2
		ctx.drawImage(img, 0, imgHeight - can.height);

		// update image height
		imgHeight += scrollSpeed;

		//resetting the images when the first image entirely exits the screen
		if (imgHeight == can.height)
			imgHeight = 0;

		// this function creates a 60fps animation by scheduling a
		// loop function call before the
		// next redraw every time it is called
		window.requestAnimationFrame(loop);
	}

	// this initiates the animation by calling the loop function
	// for the first time
	loop();

}


