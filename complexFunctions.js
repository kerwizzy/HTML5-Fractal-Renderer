function add(num1,num2) {
var sum = [];

sum[0] = num1[0] + num2[0];
sum[1] = num1[1] + num2[1];

return sum



}

function subtract(num1,num2) {
	var result = [];
	
	result[0] = num1[0] - num2[0]
	result[1] = num1[1] - num2[1]
	
	return result
	
	
	
}

function multiply(num1,num2) {
var product = [];

product[0] = num1[0]*num2[0]-num1[1]*num2[1] 
product[1] = num1[0]*num2[1]+num2[0]*num1[1]

return product	
	
	
}

function divide(num1,num2) {
	//(a+bi)/(c+di) =
	//((ac+bd)+i(bc-ad))/(c^2 + d^2)
	var result = [];
	
	var cSqdSq = num2[0]*num2[0] + num2[1]*num2[1]
	
	var resultReal = num1[0]*num2[0] + num1[1]*num2[1]
	var resultImag = num1[1]*num2[0] - num1[0]*num2[1]
	
	result[0] = resultReal/cSqdSq
	result[1] = resultImag/cSqdSq
	
	return result
	
}

function realPart(num) {
	var result = [0,0];
	result[0] = num[0]
	return result	
}

function imagPart(num) {
	var result = [0,0];
	result[0] = num[1]
	return result	
}

function exp(num) { //e to a complex number
var result = [];

var realExp = Math.pow(Math.E,num[0])

result[0] = Math.cos(num[1])*realExp
result[1] = Math.sin(num[1])*realExp

return result;	
}

function ln(num) {
	var result = []
	result[0] = Math.log(abs(num)[0])
	result[1] = Math.atan2(num[1],num[0])
	
	return result
	
	
	
}

function abs(num) { //complex modulus/abs
	var result = [0,0];
	
	
	result[0] = Math.sqrt(num[0]*num[0] + num[1]*num[1])
	return result
}

function floor(num) {
	var result = [0,0];
	result[0] = Math.floor(num[0])
	result[1] = Math.floor(num[1])
	return result	
}
function ceil(num) {
	var result = [0,0];
	result[0] = Math.ceil(num[0])
	result[1] = Math.ceil(num[1])
	return result	
}

function complexConj(num) { //Complex conjugate
	var result = [0,0]
	result[0] = num[0]
	result[1] = -num[1]
	
	return result
	
	
}

function complexArg(num) { //complex argument 
	var result = [0,0];
	result[0] = Math.atan2(num[1],num[0])
	return result
	
	
}


function sin(num) {
	
	
	//function = 0.5*i*(e^(-i*z)-e^(i*z))
	var exponent2 = multiply([0,1],num) // number times i
	var exponent1 = multiply([0,-1],num) //number times -i
	
	var innerTerm = add(exp(exponent1),multiply(exp(exponent2),[-1,0]))
	return multiply(innerTerm,[0,0.5])
	
}

function cos(num) {
	var exponent1 = multiply([0,1],num) // number times i
	var exponent2 = multiply([0,-1],num) //number times -i
	
	var innerTerm = add(exp(exponent1),exp(exponent2))
	return multiply(innerTerm,[0.5,0])
	
}

function sinh(num) {
	//function = 0.5*(e^z-e^(-z))
	
	var inner1 = exp(num)
	var inner2 = exp(multiply(num,[-1,0]))
	return multiply([0.5,0],add(inner1,multiply(inner2,[-1,0])))
	
	
	
}

function cosh(num) {
	//function = 0.5*(e^z+e^(-z))
	
	var inner1 = exp(num)
	var inner2 = exp(multiply(num,[-1,0]))
	return multiply([0.5,0],add(inner1,inner2))
	
	
	
}




function pow(num,power) {
	var result = []
	
	var radius = Math.sqrt(num[0]*num[0]+num[1]*num[1]);
	radius = Math.pow(radius,power);
	var theta = Math.atan2(num[1],num[0])*power;
	
	result[0] = radius*Math.cos(theta);
	result[1] = radius*Math.sin(theta);
	
	return result
	
	
	
}

function complexPower(numB,numE) {
	if (numB[0] == 0 && numB[1] == 0) {
		return [0,0] //We can obviously skip all the stuff below anyway, and there is a NaN problem below when it's 0. (log(0) = -infinity, and 0*-infinity = undefined)
	}
	
	
	//(a+bi)^(c+di) =
	//(a^2+b^2)^(c/2)*e^(-d*arg(a+bi))*(cos(c*arg(a+bi) + 0.5*d*ln(a^2 + b^2)) + i(sin(c*arg(a+bi)+0.5*d*ln(a^2+b^2))))
	var result = []
	
	var aSqbSq = numB[0]*numB[0]+numB[1]*numB[1]
	var argAB = Math.atan2(numB[1],numB[0])
	var innerTerm = numE[0]*argAB + 0.5*numE[1]*Math.log(aSqbSq)
	
	var magnitudeMultiplier = Math.pow(aSqbSq,(numE[0]/2))*Math.pow(Math.E,(-numE[1]*argAB))
	
	
	result[0] = Math.cos(innerTerm)
	result[1] = Math.sin(innerTerm)
	
	var complexMultiplier = [0,0]
	
	complexMultiplier[0] = magnitudeMultiplier
	result = multiply(complexMultiplier,result)
		
	return result
	
}










