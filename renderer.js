/*
------------------
JS FractalRenderer
------------------

Made by Kerwizzy and his Father




*/

var juliaC_a = 0; //Julia set variables
var juliaC_b = 0;

var zRe_end = 0;
var zIm_end = 0;

var r = 0;
var g = 0;
var b = 0;



var gIterations = 30000; //Global Iterations variable

var gPower = 2 //Global power variable (used in fractional fractal)

gEscapeHorizon = 4; //The global escape horizon variable. Changes to 64 when smooth colors are enabled.

var inSet; // @jshint suggests declaring function which is reassigned
var renderPixel; // @jshint suggests declaring function which is reassigned 

var size = 1*0.005; //How much is the numerical interval between pixels. I. E., size = 1 would mean that each pixel would roughly correspond to an integer. (Invervals of 1)
var work = {};
work.location = [0,0]; //Location of the CENTER of the view
work.running = false;

startInterval = 16;

var alertWhenDone = false;

var doZoom = true;
var doClicks = true;

var contrast = 1; //Contrast mulitplier for the image. Code in colors.js 

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
		alert("In order to display Julia Sets, enter two values (seperated by ';') in the box in the advanced options section.");
		break;
	case 4:
		inSet=inSet_mandelbrot_orbitTrap;
		
		break;
	case 5:
		inSet=inSet_multibrot_3;
		
		break;
	case 6:
		inSet=inSet_fractional;
		
		break;			
	default:
		inSet=inSet_mandelbrot;
	
		break;
	}
	draw();
}


function updateInterval() {
	checked = document.getElementById("intervalToggle").checked;
	
	if (checked === true) {
		startInterval = 1;
	}
	else {
		startInterval = 16;
		
		
	}
	
		
	
}

function updateAlertToggle() {
	checked = document.getElementById("doneAlertToggle").checked;
	
	
	alertWhenDone = checked;
	
	
	
		
	
}

function updateExponent(inputNum) {
	
	switch (inputNum) {
	case 0:
		gPower = document.getElementById('powerRange').value; 
		document.getElementById('powDisplay').value = gPower;
		break;
	case 1:
		gPower = document.getElementById('powDisplay').value; 
		document.getElementById('powerRange').value = gPower;
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
	draw();

}




function draw() {



	
	work.yI = 0;
	work.interval = startInterval;
	document.getElementById('locationDisplay').value = (work.location[0].toString()) + ";" + (work.location[1].toString()) + ";" + (size.toString());

	if (work.running === false) { //Stop it from having two timers.
		work.running = true;

		setTimeout(doWork,0);
	}
}

function doWork() {
	
}

doWork = doWork_default;

function doWork_smooth () {
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
		
		

		renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)); //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.

		
		

		p = xI*4;
		
		for (i =0;i < interval;i++) {
			
			
			d[p++] = r;
			d[p++] = g;
			d[p++] = b;
			d[p++] = 0xFF; //Set the alpha
		}
	}
	for (i =0;i < interval;i++) {
		ctx.putImageData(work.imageData,0,yI+i);
	}
	yI = halfcHeight+work.yI;
	
	for (xI = 0; xI < cWidth; xI+=interval) {
		
		

		renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)); //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.


		p = xI*4;
		for (i =0;i < interval;i++) {
			d[p++] = r;
			d[p++] = g;
			d[p++] = b;
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
		if (alertWhenDone === true) {
			alert("Done Rendering");
			
			
		}
	}


}


function doWork_default () {
	var interval = work.interval;

	var cWidth = myCanvas.width;
	var cHeight = myCanvas.height;
	var viewWidth = work.cWidth*size; //The numerical width of the view.
	var viewHeight = work.cHeight*size; //BUG: These variables don't actually do anything!!!!! Should be deleted.
	var locationX = work.location[0];
	var locationY = work.location[1];
	var ctx = work.ctx;
	var yI = cHeight/2-work.yI;
	var halfcWidth = cWidth/2
	var halfcHeight = cHeight/2
	
	for (var xI = 0; xI < cWidth; xI+=interval) {
		
		

		var currentPixelColor = renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)) //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.
		var ci = currentPixelColor*3;
		

		var p = xI*4;
		
		for (var i =0;i < interval;i++) {
			
			
			d[p++] = colors[ci+0];
			d[p++] = colors[ci+1];
			d[p++] = colors[ci+2];
			d[p++] = 0xFF; //Set the alpha
		}
	}
	for (var i =0;i < interval;i++) {
		ctx.putImageData(work.imageData,0,yI+i);
	}
	yI = halfcHeight+work.yI;
	
	for (var xI = 0; xI < cWidth; xI+=interval) {
		
		

		var currentPixelColor = renderPixel((((xI-halfcWidth)*size)+locationX),(((yI-halfcHeight)*-size)+locationY)) //the percentage accross the view we are, times the actual size of the view, offset by the location from the orgin.
		var ci = currentPixelColor*3;

		var p = xI*4;
		for (var i =0;i < interval;i++) {
			d[p++] = colors[ci+0];
			d[p++] = colors[ci+1];
			d[p++] = colors[ci+2];
			d[p++] = 0xFF; //Set the alpha
		}

	}		
	for (var i =0;i < interval;i++) {
		ctx.putImageData(work.imageData,0,yI+i);
	}

	work.yI += interval;
	if (work.yI < halfcHeight) {
		setTimeout(doWork,0);
		
	}
	else if (work.interval > 1) {
		work.yI = 0
		work.interval/=2;
		setTimeout(doWork,0)
		
	}
	else {
		work.running = false;
		if (alertWhenDone === true) {
			alert("Done Rendering");
			
			
		}
	}


}



function renderPixel_default(real,imaginary) {


	var outColor = Math.floor(inSet(real,imaginary)*contrast);
	if (outColor == -1) {
		return 999;
	}
	
	return 998 - (outColor%999);
	

}

function renderPixel_log(real,imaginary) {


	var outColor = Math.floor(inSet(real,imaginary)*contrast);
	if (outColor == -1) {
		return 999;
	}

	

	outColor = 35.1*(Math.pow(outColor,0.7));
	outColor = Math.floor(outColor);
	
	
	return 998 - (outColor%999);


}

function renderPixel_smooth(real,imaginary) {


	var outColor = Math.floor(inSet(real,imaginary)*contrast);
	var mapperDiff_r = 0;
	var mapperDiff_g = 0;
	var mapperDiff_b = 0;

	
	
	var mapperLoc = 0;

	
	var dist =  Math.sqrt(zRe_end*zRe_end + zIm_end*zIm_end);
	

	
	var ratio = (1-(Math.log(Math.log(dist)))) / Math.log(2);

	if (Math.sqrt(real*real + imaginary*imaginary) > 8) { //Make the colors after 8 be flat.
	
		ratio = -1.0821509904820257
		outColor = 1;
		
		
	}
	
	
	if (outColor == -1) {
		r = colors[999*3]
		g = colors[999*3+1]
		b = colors[999*3+2]
		return;
	}
	outColor = 998 - (outColor%999);
	
	mapperLoc = outColor*3
	
	mapperDiff_r = colors[mapperLoc+0] - colors[mapperLoc+0+3*contrast]
	mapperDiff_g = colors[mapperLoc+1] - colors[mapperLoc+1+3*contrast]
	mapperDiff_b = colors[mapperLoc+2] - colors[mapperLoc+2+3*contrast]
	
	r = mapperDiff_r * ratio + colors[mapperLoc+0]
	g = mapperDiff_g * ratio + colors[mapperLoc+1]
	b = mapperDiff_b * ratio + colors[mapperLoc+2]
	




}

function renderPixel_log_smooth(real,imaginary) {


	var outColor = Math.floor(inSet(real,imaginary)*contrast);
	var mapperDiff_r = 0;
	var mapperDiff_g = 0;
	var mapperDiff_b = 0;
	
	var mapperLoc = 0;
	var mapperLoc2 = 0;
	
	var dist =  Math.sqrt(zRe_end*zRe_end + zIm_end * zIm_end);
	

	
	
	
	
	var ratio = (1-(Math.log(Math.log(dist))) / Math.log(2));
	//Will changing the 2 to 3 (or whatever) make multibrot and variable work right?
	
		if (Math.sqrt(real*real + imaginary*imaginary) > 8) { //Make the colors after 8 be flat.
	
		ratio = -1.0821509904820257
		outColor = 1;
		
		
	}
	
	
	if (outColor == -1) {
		r = colors[999*3]
		g = colors[999*3+1]
		b = colors[999*3+2].
		return;
	}
	
	var outColor2 = (Math.pow(((outColor+1)*12),0.7))
	outColor = (Math.pow((outColor*12),0.7)); 
	
	outColor = Math.floor(outColor);
	outColor2 = Math.floor(outColor2);
	
	outColor = 998 - (outColor%999);
	outColor2 = 998 - (outColor2%999);
	
	mapperLoc = outColor*3
	mapperLoc2 = outColor2*3
	
	mapperDiff_r = colors[mapperLoc+0] - colors[mapperLoc2+0]
	mapperDiff_g = colors[mapperLoc+1] - colors[mapperLoc2+1]
	mapperDiff_b = colors[mapperLoc+2] - colors[mapperLoc2+2]
	
	r = mapperDiff_r * -ratio + colors[mapperLoc+0]
	g = mapperDiff_g * -ratio + colors[mapperLoc+1]
	b = mapperDiff_b * -ratio + colors[mapperLoc+2]
	




}





function inSet_mandelbrot(real,imaginary) {
	var zRe = 0;
	var zIm = 0;



	var iterations=gIterations;
	var escapeHorizon = gEscapeHorizon;



	var i = 0;
	for (i=0; i < iterations; i++) {
//OPTIMIZATION: COMPUTE zIm^2 and zRe^2 variables.
var zResq = zRe*zRe;
var zImsq = zIm*zIm;
		var nzRe = (zResq+(-1*(zImsq))); //Make a new variable to aviod reusing it in the next line.

		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;


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
	var escapeHorizon = gEscapeHorizon;

	var i = 0;
	for (i=0; i < iterations; i++) {

		zRe = Math.abs(zRe);
		zIm = Math.abs(zIm);

		var zResq = zRe*zRe;
		var zImsq = zIm*zIm;

		var nzRe = (zResq+(-1*(zImsq))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;


			return (i); //stop it from running longer
		}



	}
	return -1;
}

function inSet_tricornMandelbrot(real,imaginary) {
	var zRe = 0;
	var zIm = 0;
	var znRe = 0;

	real = -real; //Flip it, because with this algorithm it is backwards.

	var out = 0;

	var iterations=gIterations;
	var escapeHorizon = gEscapeHorizon;

	var i = 0;
	for (i=0; i < iterations; i++) {
		
		znRe = zIm*-1;
		zIm = zRe*-1;
		zRe = znRe; //Swap the real and complex parts each time.

		var zResq = zRe*zRe;
		var zImsq = zIm*zIm;		

		var nzRe = (zResq+(-1*(zImsq))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;



		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;


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
	var escapeHorizon = gEscapeHorizon;

	var i = 0;
	for (i=0; i < iterations; i++) {
		
		var zResq = zRe*zRe;
		var zImsq = zIm*zIm;
		
		var nzRe = (zResq+(-1*(zImsq))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += muRe;
		zIm += muIm;

		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;


			return (i); //stop it from running longer
		}



	}
	return -1;
}

function inSet_mandelbrot_orbitTrap(real,imaginary) {
	var zRe = 0;
	var zIm = 0;
	
	var closest = 10000000;
	var distance = 0;
	var lineDist = 0;


	var iterations=gIterations;
	var escapeHorizon = gEscapeHorizon;



	var i = 0;
	for (i=0; i < iterations; i++) {
		var zResq = zRe*zRe;
		var zImsq = zIm*zIm;
	
	
		var nzRe = (zResq+(-1*(zImsq))); //Make a new variable to aviod reusing it in the next line.
		zIm = 2*(zRe*zIm);
		zRe = nzRe;

		zRe += real;
		zIm += imaginary;

		distance = Math.sqrt((zResq)+(zImsq));
		lineDist = Math.abs((zRe)+(zIm));
		
		
		if (lineDist < closest) { //If it is closer than ever before...
			
			
			
			closest = lineDist;
		}
		
		
		
		if (distance > escapeHorizon) {
			/*
			var wRatio = closest%1.0; //The ratio we want for smooth coloring.
			wRatio = -wRatio; //Needs to be switched
			var wDist = Math.pow(Math.E,(Math.pow(Math.E,((wRatio+1)*(Math.LOG2E))))); //The inversion of the ratio calculator.
			var zEnd = wDist/(Math.SQRT2);			
			
			alert(zEnd);
			alert(wDist);
			*/
			zRe_end = zRe//zEnd;
			zIm_end = zIm;
			return Math.floor(4*Math.log(4/closest));
		}
		


	}
	return Math.floor(4*Math.log(4/closest));

}



function inSet_multibrot_3(real,imaginary) {
	var zRe = 0;
	var zIm = 0;

	var escapeHorizon = gEscapeHorizon;
	

	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {
		
var zResq = zRe*zRe;
var zImsq = zIm*zIm;
	
	
		var nzRe = (zResq*zRe - 3*zRe*(zImsq)); //Make a new variable to aviod reusing it in the next line.
		zIm = 3*((zResq)*zIm) - (zImsq*zIm);
	
		

		zRe = nzRe;
		
	
		
		

		zRe += real;
		zIm += imaginary;



		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;

			return (i); //stop it from running longer
		}



	}
	return -1;
}


function inSet_fractional(real,imaginary) {
	var zRe = real;
	var zIm = imaginary;

	var r = 0;
	var t = 0;
	
	var escapeHorizon = gEscapeHorizon;

	power = parseFloat(gPower);

	//real = -real; //Flip it, because with this algorithm it is backwards.

	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {
		
		
		r = Math.sqrt(zRe*zRe+zIm*zIm);
		r = Math.pow(r,power);
		t = Math.atan2(zIm,zRe)*power;
		


		var nzRe = r*Math.cos(t);
		zIm = r*Math.sin(t);
		
		zRe = nzRe;
		
	


		zRe += real;
		zIm += imaginary;



		if ((zRe*zRe)+(zIm*zIm) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;

			return (i); //stop it from running longer
		}



	}
	return -1;
}


function updateSize() {
	
	myCanvas.width = document.getElementById("customWidth").value;
	myCanvas.height = document.getElementById("customHeight").value;
	

	work.ctx = myCanvas.getContext("2d");
	work.imageData = work.ctx.createImageData(myCanvas.width,1); //Create an image for the row.
	d = work.imageData.data;
	
	draw();
	
}



function getCursorPosition(canvas, event) {
	if (doClicks === true) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
	
		if (x/myCanvas.width < 0.1 || x/myCanvas.width > 0.9 || y/myCanvas.height < 0.1 || y/myCanvas.height > 0.9) {
			size = size*2; //Zoom out.
		}
		else {
			work.location[0] = ((x-myCanvas.width/2)*size+work.location[0]); 
			work.location[1] = ((y-myCanvas.height/2)*-size+work.location[1]);
			if (doZoom === true) {
				size = size/2;
			}
		}
		document.getElementById("startupHelp").style.display = "none"; //Hide the little help bar on the first click.
		draw();
	}
}

function wheelZoom(canvas,event) {
	if (doClicks === true) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
	
		
		
	
		
		console.log(event.deltaY);
		if (doZoom === true) {
			if (event.deltaY > 0) {
				size = size*2				
			}
			if (event.deltaY < 0) {
				size = size/2
				work.location[0] = ((x-myCanvas.width/2)*size+work.location[0]); 
				work.location[1] = ((y-myCanvas.height/2)*-size+work.location[1]);				
				}
		}
		document.getElementById("startupHelp").style.display = "none"; //Hide the little help bar on the first click.
		draw();
	}	
}



function initialize() {
	generateColPicker(); //Add the interior data for the color selector box, based on current color palettes. The function is in colors.js
	
	myCanvas = document.getElementById("myCanvas");

	myCanvas.width = window.innerWidth-(0.013*window.innerWidth); //Make it a full screen
	myCanvas.height = window.innerHeight-(0.02*window.innerHeight);


	myCanvas.addEventListener("mouseup",function(event) { if(event.button===0) getCursorPosition(myCanvas,event);});
	myCanvas.addEventListener("wheel",function(event) { wheelZoom(myCanvas,event);});
	work.ctx = myCanvas.getContext("2d");
	work.imageData = work.ctx.createImageData(myCanvas.width,1); //Create an image for the row.

	d = work.imageData.data;

	document.getElementById("fractalPicker").value=0; //Make it actually SAY it's the mandelbrot set when it starts up. 
	document.getElementById("colPicker").value=0; //Make it actually SAY it's the default color when it starts up.
	
	document.getElementById('clickToggle').checked = true;
	document.getElementById('zoomToggle').checked = true;
	document.getElementById('advancedOptionsToggle').checked = false;
	
	document.getElementById('doneAlertToggle').checked = false;
	document.getElementById('intervalToggle').checked = false;
	
	
	document.getElementById('customWidth').value = myCanvas.width;
	document.getElementById('customHeight').value = myCanvas.height;
	
	//document.getElementById("logToggle").checked = false; //Make it actually LOOK unchecked when it starts up. (Might be different because someone had reloaded the page, and had checked on before they reloaded.)
	document.getElementById("smoothColorToggle").checked = false;

	draw(); //Make it render when it starts.

}

window.addEventListener("load",initialize);