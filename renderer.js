/*
------------------
JS FractalRenderer
------------------

Made by Kerwizzy and his Father




*/

var juliaC_a = 0; //Julia set variables
var juliaC_b = 0;

var gIterations = 30000; //Global Iterations variable

var inSet; // @jshint suggests declaring function which is reassigned
var renderPixel; // @jshint suggests declaring function which is reassigned 

var size = 1*0.005; //How much is the numerical interval between pixels. I. E., size = 1 would mean that each pixel would roughly correspond to an integer. (Invervals of 1)
var work = {};
work.location = [0,0]; //Location of the CENTER of the view
work.running = false;

renderPixel=renderPixel_default;

function reset() {
	size = 1*0.005; //How much is the numerical interval between pixels. I. E., size = 1 would mean that each pixel would roughly correspond to an integer. (Invervals of 1)
	work.location = [0,0]; //Location of the CENTER of the view
	draw();


}




function changeFractal() {
	fractal=document.getElementById("fractalPicker").value;

	switch(parseInt(fractal)) {
	case 0:
		inSet=inSet_mandelbrot;
		
		break;
	case 1:
		inSet=inSet_burningShip;
		break;
	case 2:
		inSet=inSet_tricornMandelbrot;
		break;
	case 3:
		inSet=inSet_julia;
		getJuliaC();
		alert("In order to display Julia Sets, enter two values (seperated by ';') in the lower box in the other options.");
		break;
	default:
		inSet=inSet_mandelbrot;
		break;
	}
	draw();
}


function getLocation() {
	locData = [];
	locData = document.getElementById('locationDisplay').value.split(";");



	work.location[0] = parseFloat(locData[0]);
	work.location[1] = parseFloat(locData[1]);
	size = parseFloat(locData[2]);
	draw();

}

function getJuliaC() {
	juliaData = [];
	juliaData = document.getElementById('juliaC').value.split(";");



	juliaC_a = parseFloat(juliaData[0]);
	juliaC_b = parseFloat(juliaData[1]);

}




function draw() {



	
	work.yI = 0;
	work.interval = 16;
	document.getElementById('locationDisplay').value = (work.location[0].toString()) + ";" + (work.location[1].toString()) + ";" + (size.toString());

	if (work.running === false) { //Stop it from having two timers.
		work.running = true;

		setTimeout(doWork,0);
	}
}


function doWork () {
	var interval = work.interval;

	var cWidth = myCanvas.width;
	var cHeight = myCanvas.height;
	var viewWidth = work.cWidth*size; //The numerical width of the view.
	var viewHeight = work.cHeight*size;
	var locationX = work.location[0];
	var locationY = work.location[1];
	var ctx = work.ctx;
	var yI = cHeight/2-work.yI;
	var halfcWidth = cWidth/2;
	var halfcHeight = cHeight/2;
	var i = 0;
	var currentPixelColor;
	var ci;
	var p;
	for (var xI = 0; xI < cWidth; xI+=interval) {
		
		

		currentPixelColor = renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)); //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.
		ci = currentPixelColor*3;
		

		p = xI*4;
		
		for (i =0;i < interval;i++) {
			
			
			d[p++] = colors[ci+0];
			d[p++] = colors[ci+1];
			d[p++] = colors[ci+2];
			d[p++] = 0xFF; //Set the alpha
		}
	}
	for (i =0;i < interval;i++) {
		ctx.putImageData(work.imageData,0,yI+i);
	}
	yI = halfcHeight+work.yI;
	
	for (xI = 0; xI < cWidth; xI+=interval) {
		
		

		currentPixelColor = renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)); //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.
		ci = currentPixelColor*3;

		p = xI*4;
		for (i =0;i < interval;i++) {
			d[p++] = colors[ci+0];
			d[p++] = colors[ci+1];
			d[p++] = colors[ci+2];
			d[p++] = 0xFF; //Set the alpha
		}

	}		
	for (i =0;i < interval;i++) {
		ctx.putImageData(work.imageData,0,yI+i);
	}

	work.yI += interval;
	if (work.yI < halfcHeight) {
		setTimeout(doWork,0);
		
	}
	else if (work.interval > 1) {
		work.yI = 0;
		work.interval/=2;
		setTimeout(doWork,0);
		
	}
	else {
		work.running = false;
	}


}



function renderPixel_default(real,imaginary) {


	var outColor = inSet(real,imaginary);
	if (outColor == -1) {
		return 999;
	}
	return 998 - (outColor%999);



}

function renderPixel_log(real,imaginary) {


	var outColor = inSet(real,imaginary);
	if (outColor == -1) {
		return 999;
	}
	return 998 - ((Math.log(outColor)*2000)%999);



}





function inSet_mandelbrot(real,imaginary) {
	var zRe = 0;
	var zIm = 0;



	var iterations=gIterations;



	var i = 0;
	for (i=0; i < iterations; i++) {

		var nzRe = (zRe*zRe+(-1*(zIm*zIm))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zRe*zRe)+(zIm*zIm) > 4) { //If it is outside the 2 unit circle...


			return (i); //stop it from running longer
		}



	}
	return -1;
}
var inSet = inSet_mandelbrot;

function inSet_burningShip(real,imaginary) {
	var zRe = 0;
	var zIm = 0;

	imaginary = -imaginary; //Flip this because it looks "upside down" otherwise.

	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {

		zRe = Math.abs(zRe);
		zIm = Math.abs(zIm);


		var nzRe = (zRe*zRe+(-1*(zIm*zIm))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zRe*zRe)+(zIm*zIm) > 4) { //If it is outside the 2 unit circle...


			return (i); //stop it from running longer
		}



	}
	return -1;
}

function inSet_tricornMandelbrot(real,imaginary) {
	var zRe = 0;
	var zIm = 0;
	real = -real; //Flip it, because with this algorithm it is backwards.

	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {

		znRe = zIm*-1;
		zIm = zRe*-1;
		zRe = znRe; //Swap the real and complex parts each time. 

		var nzRe = (zRe*zRe+(-1*(zIm*zIm))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zRe*zRe)+(zIm*zIm) > 4) { //If it is outside the 2 unit circle...


			return (i); //stop it from running longer
		}



	}
	return -1;
}

function inSet_julia(real,imaginary) {
	var zRe = real;
	var zIm = imaginary;
	
	var muRe = juliaC_a;
	var muIm = juliaC_b;
	
	



	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {
		
		
		
		var nzRe = (zRe*zRe+(-1*(zIm*zIm))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += muRe;
		zIm += muIm;

		if ((zRe*zRe)+(zIm*zIm) > 4) { //If it is outside the 2 unit circle...


			return (i); //stop it from running longer
		}



	}
	return -1;
}





function getCursorPosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	if (x/myCanvas.width < 0.1 || x/myCanvas.width > 0.9 || y/myCanvas.height < 0.1 || y/myCanvas.height > 0.9) {
		size = size*2; //Zoom out.
	}
	else {
		work.location[0] = ((x-myCanvas.width/2)*size+work.location[0]); 
		work.location[1] = ((y-myCanvas.height/2)*-size+work.location[1]);
		size = size/2;
	}
	draw();
}



function initialize() {
	generateColPicker(); //Add the interior data for the color selector box, based on current color palettes. The function is in colors.js
	
	myCanvas = document.getElementById("myCanvas");

	myCanvas.width = window.innerWidth; //Make it a full screen
	myCanvas.height = window.innerHeight;


	myCanvas.addEventListener("mouseup",function(event) { if(event.button===0) getCursorPosition(myCanvas,event);});
	work.ctx = myCanvas.getContext("2d");
	work.imageData = work.ctx.createImageData(myCanvas.width,1); //Create an image for the row.

	d = work.imageData.data;

	document.getElementById("fractalPicker").value=0; //Make it actually SAY it's the mandelbrot set when it starts up. 
	document.getElementById("colPicker").value=0; //Make it actually SAY it's the default color when it starts up.

	draw(); //Make it render when it starts.

}

window.addEventListener("load",initialize);