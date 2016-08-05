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
	if (doClicks == true) {
	size = 1*0.005; //How much is the numerical interval between pixels. I. E., size = 1 would mean that each pixel would roughly correspond to an integer. (Invervals of 1)
	work.location = [0,0]; //Location of the CENTER of the view
	draw();
	}

}




function changeFractal() {
	if (doClicks == true) {
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
		//alert("In order to display Julia Sets, enter two values (seperated by ';') in the box in the advanced options section.");
		//$('fractalPicker').popover('[title="Information",data-content="In order to display Julia Sets, enter two values (seperated by \';\') in the box in the advanced options section."')
		document.getElementById("alertPlaceholder").innerHTML = '<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>In order to display Julia Sets, enter two values (seperated by \';\') in the box in the advanced options section.</div>'
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
	case 7:
		document.getElementById("functionAlertBox").innerHTML = "" //Clear the old errors.
		document.getElementById("alertPlaceholder").innerHTML = ""
	
		var inFunction = document.getElementById("customFunctionInput").value;
		var zStartCode = document.getElementById("customFunctionStartZInput").value;
		
		inFunction = processExpression(inFunction)
		zStartCode = processExpression(zStartCode)
		if (inFunction == "ERROR") {	
			printFunctionAlert("Error parsing function.")
		} else if (zStartCode=="ERROR") {
			printFunctionAlert("Error parsing initial Z value equation.")
			

		}
		else {
			var inEscapeHorizon = 10000
					

			var newInSetCustom = "function(real,imaginary){var zRe = 0;var zIm = 0;var C = [];C[0] = real;C[1] = imaginary;"+
			"var Z ="+zStartCode+";Z=Z.slice(0);zRe = Z[0];zIm = Z[1];var escapeHorizon = "+inEscapeHorizon+
			";var out = 0;var iterations=gIterations;var i = 0;for (i=0; i < iterations; i++) {Z[0] = zRe;Z[1] = zIm;Z = "+inFunction+
		"; zRe = Z[0];zIm = Z[1];var zResq = zRe*zRe;var zImsq = zIm*zIm;if ((zResq)+(zImsq) > escapeHorizon) {zRe_end = zRe;zIm_end = zIm;return (i);}}return -1;}" //we leave out the return block in this step to stop it from giving a "return not in function error" in part of the code below.

		newInSetCustom = newInSetCustom.replace(/;/g, ";\n") //Insert some linebreaks for easier debugging.
		
			//function(real,imaginary){var zRe = 0;var zIm = 0;var C = [];C[0] = real;C[1] = imaginary;var Z = [];Z[0] = C[0];Z[1] = C[1];zRe = Z[0];zIm = Z[1];var escapeHorizon = 10000;var out = 0;var iterations=gIterations;var i = 0;for (i=0; i < iterations; i++) {Z[0] = zRe;Z[1] = zIm;Z = add(complexPower(z,[5, 0]),[0.544, 0]); zRe = Z[0];zIm = Z[1];var zResq = zRe*zRe;var zImsq = zIm*zIm;if ((zResq)+(zImsq) > escapeHorizon) {zRe_end = zRe;zIm_end = zIm;return (i);}}return -1;}
		
		var theCodeIsBuggy = false;
		try {
			eval("var testNewInSetCustomFunction ="+newInSetCustom+";testNewInSetCustomFunction(1,1);") //See if we could run the function
				
		} catch (err) {
			var errorText = err.message;
			
			if (errorText == "z is not defined") {
				printFunctionAlert("Z needs to be capitalized.")				
			}
			if (errorText == "c is not defined") {
				printFunctionAlert("C needs to be capitalized.")
			}
			else {
				printFunctionAlert("Error executing function. (" + errorText  + ")")
			}
			
			theCodeIsBuggy = true;
	
		}
		if (!theCodeIsBuggy) {
			eval("inSet_custom ="+newInSetCustom)
			inSet=inSet_custom;
		}
			
		}
		
	break;	
	default:
		inSet=inSet_mandelbrot;
	
		break;
	}
	draw();
	}
}

function printFunctionAlert(alertText) {
	var newHTMLtag = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ alertText +'</div>'
	document.getElementById("functionAlertBox").innerHTML+= newHTMLtag
	document.getElementById("alertPlaceholder").innerHTML = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Error in custom function. Go to the Custom Function tab in Advanced Options for more information.</div>'
	
}

var doFinalPassFirst = false;
function updateInterval() {
	
	
	if (doFinalPassFirst === true) {
		startInterval = 1;
	}
	else {
		startInterval = 16;
		
		
	}
	
		
	
}
var alertWhenDone = false;
/*
function updateAlertToggle() {
	checked = document.getElementById("doneAlertToggle").checked;
	
	
	alertWhenDone = checked;
	
	
	
		
	
}
*/

function updateExponent(inputNum) {
	if (doClicks == true) {
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
	
}




function getLocation() {
	if (doClicks == true) {
	locData = [];
	locData = document.getElementById('locationDisplay').value.split(";");



	work.location[0] = parseFloat(locData[0]);
	work.location[1] = parseFloat(locData[1]);
	size = parseFloat(locData[2]);
	draw();
	}
}

function getJuliaC() {
	if (doClicks == true) {
	juliaData = [];
	juliaData = document.getElementById('juliaC').value.split(";");



	juliaC_a = parseFloat(juliaData[0]);
	juliaC_b = parseFloat(juliaData[1]);
	draw();
	}
}



var renderStartTime;
function draw() {

	if (doClicks == true) {

		
		work.yI = 0;
		work.interval = startInterval;
		document.getElementById('locationDisplay').value = (work.location[0].toString()) + ";" + (work.location[1].toString()) + ";" + (size.toString());
		renderStartTime = Date.now();
			
		if (work.running === false) { //Stop it from having two timers.
			work.running = true;

			setTimeout(doWork,0);
		}
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
			
			
			rowD[p++] = r;
			rowD[p++] = g;
			rowD[p++] = b;
			rowD[p++] = 0xFF; //Set the alpha
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
			rowD[p++] = r;
			rowD[p++] = g;
			rowD[p++] = b;
			rowD[p++] = 0xFF; //Set the alpha
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
			var millisRenderTime = Date.now() - renderStartTime;
			var secondsRenderTime = Math.round(millisRenderTime/1000)
			var minutesValue = Math.floor(secondsRenderTime/60)
			var secondsValue = secondsRenderTime%60	
			alert("Done Rendering. Took " + minutesValue + ((minutesValue == 1) ? " minute ":" minutes ") + (secondsRenderTime%60) +  ((secondsValue == 1) ? " second.":" seconds."));
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
			
			
			rowD[p++] = colors[ci+0];
			rowD[p++] = colors[ci+1];
			rowD[p++] = colors[ci+2];
			rowD[p++] = 0xFF; //Set the alpha
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
			rowD[p++] = colors[ci+0];
			rowD[p++] = colors[ci+1];
			rowD[p++] = colors[ci+2];
			rowD[p++] = 0xFF; //Set the alpha
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
			var millisRenderTime = Date.now() - renderStartTime;
			var secondsRenderTime = Math.round(millisRenderTime/1000)
			var minutesValue = Math.floor(secondsRenderTime/60)
			var secondsValue = secondsRenderTime%60	
			alert("Done Rendering. Took " + minutesValue + ((minutesValue == 1) ? " minute ":" minutes ") + (secondsRenderTime%60) +  ((secondsValue == 1) ? " second.":" seconds."));
			
			
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

var inSet_custom
/*
function inSet_custom(real,imaginary) {
	var zRe = 0;
	var zIm = 0;
	
	var C = [];
	C[0] = real
	C[1] = imaginary
	
		
	var Z = C;
	
	Z = Z.slice(0) //Make it not a pointer to C
	
	
	
	zRe = Z[0]
	zIm = Z[1]
	
	

	var escapeHorizon = 10000//gEscapeHorizon;
	

	var out = 0;

	var iterations=gIterations;

	var i = 0;
	for (i=0; i < iterations; i++) {
		Z[0] = zRe
		Z[1] = zIm
		
		Z = add(exp(Z),[-0.65,0])
		//exp(z) - 0.65
		
		
		//Z = add(pow(sinh(multiply(Z,Z)),0.5),[0.065,0.122])
		//Z = subtract(exp(pow(Z,3)),[0.621,0])
		//Z = add(pow(Z,3),[0.400,0])
		//Z = add(multiply(Z,exp(Z)),0.04)
		//Z = add(multiply(Z,Z),[0.285,0.01])
		//Z = add(divide(add(multiply(Z,Z),Z),ln(Z)),[0.268,0.060])
		//z = ((z^2+z)/Ln(z)) + (0.268+0.060i)
		
		/*
		Testing of above function
		
		Wolfram alpha seqence
		
		INITIAL INPUT: ((z^2+z)/Ln(z)) + (0.268+0.060i) where z = 0.1 + 0.04i
		0.224307+0.0309988 i
		0.0880856+0.0131317 i
		0.228978+0.0512258 i
		0.0876737-0.0188937 i
		0.22971+0.0725792 i
		0.0971422-0.0511538 i
		0.228891+0.0962338 i
		0.114072-0.0846754 i
		
		
		My sequence
		
		
		0.22430679052183067,0.030998803064910856
		0.08808588816024945,0.013131704012789139
		0.2289774888459618,0.05122578440088869
		0.0876744810869032,-0.01889351222907122
		0.22970965613874045,0.07257910528843652
		0.09714263472371659,-0.05115348365502005
		0.22889059821410063,0.09623366942346531
		0.11407261531089044,-0.08467490847419396
		
		
		
		
		
		
		
		
		/
		
		
		
		
		
		
		//Z = sin(divide(Z,C))
		
		//Z = add(multiply(exp(Z),Z),[0.04,0])
		//z * exp(z) + 0.04
		
		
		//Z = divide(subtract(1,add(pow(Z,2),pow(Z,5))),add(add(2,multiply(4,Z)),[20,0.2]))
		//1-z^2+z^5/(2 + 4z)+c
		
		zRe = Z[0]
		zIm = Z[1]
		
		var zResq = zRe*zRe;
		var zImsq = zIm*zIm;

		if ((zResq)+(zImsq) > escapeHorizon) { //If it is outside the 2 unit circle...
			zRe_end = zRe;
			zIm_end = zIm;

			return (i); //stop it from running longer
		}



	}
	return -1;
}
*/


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
	rowD = work.imageData.data;
	
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
		draw();
	}
}

function wheelZoom(canvas,event) {
	if (doClicks === true) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
	
		
		
	
		
		//console.log(event.deltaY);
		if (doZoom === true) {
			if (event.deltaY > 0) {
				size = size*2				
			}
			if (event.deltaY < 0) {
				
				//We want the place we scrolled at to be at the same place on the screen as before.
							
				
				
				//work.location[0] = ((x-myCanvas.width/2)*size+work.location[0]); //This puts it in the center
				//work.location[1] = ((y-myCanvas.height/2)*-size+work.location[1]);		
				
				work.location[0] = ((x-myCanvas.width/2)*size+work.location[0])-(x-myCanvas.width/2)*size/1.5; 
				work.location[1] = ((y-myCanvas.height/2)*-size+work.location[1])-(y-myCanvas.height/2)*-size/1.5;
				size = size/1.5
				}
		}
		draw();
	}	
}



function initialize() {
	generateColPicker(); //Add the interior data for the color selector box, based on current color palettes. The function is in colors.js
	
	myCanvas = document.getElementById("myCanvas");
	
	var canvHeight = window.innerHeight;
	
	var topHeight = $("#topRow").outerHeight(false) //false is for include margin
	//console.log($("#topRow"))
	
	//alert(topHeight);
	
	myCanvas.width = $("#topRow").width(); 
	myCanvas.height = canvHeight-(topHeight*0.1);


	myCanvas.addEventListener("mouseup",function(event) { if(event.button===0) getCursorPosition(myCanvas,event);});
	myCanvas.addEventListener("wheel",function(event) { wheelZoom(myCanvas,event);});
	work.ctx = myCanvas.getContext("2d");
	work.imageData = work.ctx.createImageData(myCanvas.width,1); //Create an image for the row.

	rowD = work.imageData.data;

	document.getElementById("fractalPicker").value=0; //Make it actually SAY it's the mandelbrot set when it starts up. 
	document.getElementById("colPicker").value=0; //Make it actually SAY it's the default color when it starts up.
	
	//document.getElementById('clickToggle').checked = true;
	//document.getElementById('zoomToggle').checked = true;
	
	//document.getElementById('doneAlertToggle').checked = false;
	//document.getElementById('intervalToggle').checked = false;
	
	
	document.getElementById('customWidth').value = myCanvas.width;
	document.getElementById('customHeight').value = myCanvas.height;
	
	//document.getElementById("logToggle").checked = false; //Make it actually LOOK unchecked when it starts up. (Might be different because someone had reloaded the page, and had checked on before they reloaded.)
	//document.getElementById("smoothColorToggle").checked = false;

	draw(); //Make it render when it starts.

}

window.addEventListener("load",initialize);