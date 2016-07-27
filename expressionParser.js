function processExpression(expression2Parse)
{
var cm = Object.create(obtExprParser);

var ret = cm.ContinuedLineParse(expression2Parse);

/* Want to convert to function notation */
var i = 0;
var out = "";
while(i < ret.tokens.length) {
    out = out + ret.tokens[i].nest + "," + ret.tokens[i].precedence + ":" + ret.tokens[i].text + "\n";
    i++;
}
var binop = {
	"-":"subtract"
	,"+":"add"
	,"*":"multiply"
	,"/":"divide"
	,"^":"complexPower"
};
/* Scalar conversions. When not inside [], expand thinks like
	5.2 + 3.1i 
	to 
	[5.2,0] + [0,3.1]
	
	
	
 */
	i = 0;
	/* Reduce: find highest nest and precedence */
	var nest = 0;
	while(i < ret.tokens.length) {
		if (ret.tokens[i].text == "[") {
			nest++;
		} else if (ret.tokens[i].text == "]") {
			nest--;
		}
		if (!nest && ret.tokens[i].TokenType[1] == "T_number") {
			if (i+1 < ret.tokens.length && ret.tokens[i+1].text == "i") {
				ret.tokens[i].text = "[0, " + ret.tokens[i].text + "]";
				ret.tokens.splice(i+1,1);
			} else {
				ret.tokens[i].text = "[" + ret.tokens[i].text + ", 0]";
			}
		}
		i++;
	}
 "T_number"
while(ret.tokens.length > 1) {
	var maxi = 0;
	i = 0;
	/* Reduce: find highest nest and precedence */
	while(i < ret.tokens.length) {
	    if (ret.tokens[i].nest > ret.tokens[maxi].nest) {
			maxi = i;
	    } else if (ret.tokens[i].nest == ret.tokens[maxi].nest) {
			if (ret.tokens[i].precedence+1 && 
				(typeof(ret.tokens[maxi].precedence)=="undefined"||
					(ret.tokens[i].precedence > ret.tokens[maxi].precedence)) )
				{
				maxi = i;
			}
	    }
	    i++;
	}
	out += "maxi=" + maxi + ":" + ret.tokens[maxi].text + "\n";
	if (ret.tokens[maxi].text=='(' || ret.tokens[maxi].text=='[') {
		/* Collect and unnest */
		i = maxi+1;
		while(i < ret.tokens.length && ret.tokens[i].nest == ret.tokens[maxi].nest) {
			ret.tokens[maxi].text += ret.tokens[i].text;
			ret.tokens.splice(maxi+1,1);
		}
		ret.tokens[maxi].nest -= 1;
		delete ret.tokens[maxi].precedence;
		if (maxi > 0 && ret.tokens[maxi-1].TokenType[1] == "T_vname") {
			/* Function call */
			ret.tokens[maxi].text = ret.tokens[maxi-1].text + ret.tokens[maxi].text; 
			ret.tokens.splice(maxi-1,1);
		}
	} else if (binop[ret.tokens[maxi].text] && maxi > 0 && ret.tokens[maxi-1].nest == ret.tokens[maxi].nest) {
		/* Combine */
		ret.tokens[maxi-1].text = binop[ret.tokens[maxi].text] + "(" + ret.tokens[maxi-1].text + "," + ret.tokens[maxi+1].text + ")";
		ret.tokens.splice(maxi,2);
		delete ret.tokens[maxi-1].precedence;
		
	} else {
		out += "Not found\n";
		break;
	}
}
out += "--------------------------\n";
i =0;
while(i < ret.tokens.length) {
    out = out + ret.tokens[i].nest + "," + ret.tokens[i].precedence + ":" + ret.tokens[i].text + "\n";
    i++;
}

if (ret.tokens.length == 1) {
	return ret.tokens[0].text
	
	
} else {
	return "ERROR"	
}


}


/**************************************************************/



var obtExprParser = {
enumttype: {
	T_space:[0,"T_space"],
	T_keyword:[1,"T_keyword"],
	T_operator:[2,"T_operator"],
	T_opequal:[3,"T_opequal"],
	T_string:[4,"T_string"],
	T_unrecognized:[5,"T_unrecognized"],
//	T_comment:[6,"T_comment"],
	T_vname:[7,"T_vname"],
	T_number:[8,"T_number"],
	T_rewrite:[9,"T_rewrite"],
	T_separator:[10,"T_separator"],
	T_unaryoperator:[11,"T_unaryoperator"]

},
chartype: {

mask: [ 
	 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 
	,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 

       //    !  "  #  $  %  &  '  (  )  *  +  ,  -  .  /
		, 0,56, 0, 0, 0,24,24, 0, 8, 8,24,24, 8,24, 8,24 

       // 0  1  2  3  4  5  6  7  8  9  :  ;  <  =  >   ?
		, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 8,56,56,120, 8

       // @  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O 
		, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1

       // P  Q  R  S  T  U  V  W  X  Y  Z  [  \  ]  ^  _ 
		, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 0, 8,24, 0

       // `  a  b  c  d  e  f  g  h  i  j  k  l  m  n  o 
		, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1

       // p  q  r  s  t  u  v  w  x  y  z  {  |  }  ~   
		, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8,24, 8, 8, 0 
],
isDigit: function(ch)
{
	var i =	ch.charCodeAt(0);
	if (i >= 128) {
		return false;
	}
	return (this.mask[i] & 2) != 0;
},
isLetter: function(ch)
{
	var i =	ch.charCodeAt(0);
	if (i >= 128) {
		return false;
	}
	return (this.mask[i] & 1) != 0;
}
},
    Reserved: {

		/* operator */
		 "And":7
		 ,"Or":7
		 ,"Not":7

	 },

	TokenParse: function/*static int*/(/*string*/ line, /*int*/ istart, out)
	{
		var ccode = line.charCodeAt(istart);
		if (ccode >= 128) {
		  ccode = 0;
		}
		var ctype = this.chartype.mask[ccode];
		if ((ctype & 1) || ccode == 0x5f) {
			/* Letter or _ */
			var/*int*/ cNum = 0;
			while (istart+cNum < line.length && "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789$".indexOf(line[istart+cNum]) >= 0)
			{
				cNum++;
			}
			var /*string*/ word = line.substr(istart+0, cNum);
			out.TokenType = this.enumttype.T_vname;
			if (this.Reserved[word]==7) {
				if (word == "Not") {
					out.TokenType = this.enumttype.T_unaryoperator;
				} else {
					out.TokenType = this.enumttype.T_operator;
				}

			} else if (this.Reserved[word]) {
				out.TokenType = this.enumttype.T_keyword;
			}
			return cNum;
			
		} else if (ctype & 2) { /* number */
			var /*int*/ cNum = 0;
			var /*bool*/ sawdot = false;
			while (istart+cNum < line.length && ("0123456789.".indexOf(line[istart+cNum]) >= 0))
			{
				if (line[istart + cNum] == '.')
				{
					if (sawdot)
					{
						out.TokenType = this.enumttype.T_number;
						return cNum - 1;
					}
					else
					{
						sawdot = true;
					}
				}
				cNum++;
			}
			if (istart+cNum < line.length && "Ee".indexOf(line[istart+cNum]) >= 0)
			{
				cNum++;
				if (line[istart+cNum] == '-') {
					cNum++;
				}
				while (istart+cNum < line.length && ("0123456789".indexOf(line[istart+cNum]) >= 0))
				{
					cNum++;
				}
			}
			out.TokenType = this.enumttype.T_number;
			return cNum;
		}
		var ch = line[istart];
		if (" \t".indexOf(ch) >= 0) {
			var/*int*/cSpace = 0;
			while (cSpace+istart < line.length && (" \t".indexOf(line[cSpace+istart]) >= 0))
			{
				cSpace++;
			}
			out.TokenType = this.enumttype.T_space;
		  return cSpace;
		}
		if (ch == '$') {
			/* String operator */
			var cNum = 1;
			while (istart + cNum < line.length && ("=<>".indexOf(line[istart+cNum]) >= 0))
			{
				cNum++;
			}
			out.TokenType = this.enumttype.T_opequal;
			out.precedence = 3;
			return cNum;
		}
		if (ch == '.') {
			out.precedence = 7;
			out.TokenType = this.enumttype.T_operator;
			return 1;
		}
		if ("^".indexOf(ch) >= 0)
		{
			out.TokenType = this.enumttype.T_operator;
			out.precedence = 6;
			return 1;
		}
		if ("/*".indexOf(ch) >= 0)
		{
			out.TokenType = this.enumttype.T_operator;
			out.precedence = 5;
			return 1;
		}
		if ("+-".indexOf(ch) >= 0)
		{
			out.TokenType = this.enumttype.T_operator;
			out.precedence = 4;
			return 1;
		}
		if ("=<>".indexOf(ch) >= 0)
		{
			var/*int*/ cNum = 0;

			while (istart + cNum < line.length && ("=<>".indexOf(line[istart+cNum]) >= 0))
			{
				cNum++;
			}
			out.TokenType = this.enumttype.T_opequal;
			out.precedence = 3;
			return cNum;
		}
		if ("(),[]".indexOf(ch) >= 0)
		{
			out.TokenType = this.enumttype.T_separator;
			out.precedence = 0;
			return 1;
		}
		if (ch == '&')
		{
			out.TokenType = this.enumttype.T_operator;
			out.precedence = 1;
			return 1;
		}
		if (ch == '\'')
		{
			var/*int*/ i = -1 + istart;
			out.TokenType = this.enumttype.T_string;
			do {
				i = i + 2;
				i = line.indexOf('\'',i)+1;
				if (i == 0)
				{
					i = line.length;
				}
			} while (i <= line.length-1 && line[i] == '\'') ;
			return i - istart;
		}
		if (ch == '\"')
		{
			var/*int*/ i = -1 + istart;
			out.TokenType = this.enumttype.T_string;
			do {
				i = i + 2;
				i = line.indexOf('\"',i)+1;
				if (i == 0)
				{
					i = line.length;
				}
			} while (i <= line.length-1 && line[i] == '\"') ;
			return i - istart;
		}
		out.TokenType = this.enumttype.T_unrecognized;
		return 1;
	} /* TokenParse */
		
	,ContinuedLineParse: function(/*string*/line)
	{ /* VB6 documentation calls everything "statements", even declarations.
	   */
		var TokenType = {};
		var iStart = 0;
		var out = "";
		var tokens = [];
		var ret = {};
		var nest = 0;
		var bExpectOperand = true;
		while (iStart < line.length) {
			TokenType = {};
			var cToken = this.TokenParse(line,iStart,/*out*/TokenType);
			var prespace = "";
			/* Collapse spaces */
			if (TokenType.TokenType == this.enumttype.T_space && iStart + cToken < line.length) {
				prespace = line.substr(iStart,cToken);
				TokenType = {};
				iStart += cToken;
				cToken = this.TokenParse(line,iStart,/*out*/TokenType);
			}
			TokenType.text = line.substr(iStart,cToken);
			if (TokenType.text == "(" || TokenType.text == "[") {
				nest += 1;
				bExpectOperand = true;
			} else if (TokenType.TokenType == this.enumttype.T_operator 
					|| TokenType.TokenType == this.enumttype.T_opequal) {
				if (bExpectOperand) {
					TokenType.TokenType = this.enumttype.T_unaryoperator;
					TokenType.precedence = 8;
				}
				bExpectOperand = true;
			} else {
				bExpectOperand = false;
			}
			TokenType.prespace = prespace;
//			TokenType.line = iLine;
			TokenType.nest = nest;
			tokens.push(TokenType);
			if (TokenType.text == ")") {
				nest -= 1;
			}
			if (TokenType.text == "]") {
				nest -= 1;
			}
			
			//out = out + "[" + TokenType.TokenType + ":" + line.substr(iStart,cToken) + ":" + cToken + "]";
			iStart = iStart + cToken;
		}
		var iTok = 0;

		/* Statement labels */
		if (iTok < tokens.length && tokens[iTok].TokenType == this.enumttype.T_vname) {
			ret.label = tokens[iTok].text;
			if (tokens[iTok+1] && tokens[iTok+1].text == ":") {
				iTok += 2;
			}
			
			while (iTok < tokens.length && (tokens[iTok].TokenType == this.enumttype.T_space)) {
				iTok += 1;
			}
		}
		
		/* Ignore end space + comment */
		iLastToken = tokens.length-1;
		if (iLastToken >= 0 && tokens[iLastToken].TokenType == this.enumttype.T_comment) {
			ret.eolComment = tokens[iLastToken].text;
			tokens.pop();
			iLastToken -= 1;
		} else if (iLastToken >= 0 && tokens[iLastToken].TokenType == this.enumttype.T_space) {
			ret.eolComment = tokens[iLastToken].text;
			tokens.pop();
			iLastToken -= 1;
		}
//		if (tokens[iTok]) {
//			librock_v8_stdio = "I-262:" + tokens[iTok].text + ":";
//		}
		ret.tokens = tokens;
//		this.DetermineStatementType(ret,iTok,iLastToken);
		ret.type = "{EXPRESSION}";
		
		/* Returned object has these items
			type
			tokens
			nest

			(optional members)
			label
			eolComment
			

			(optional members, type-specific)
			expression
			statement
		*/
		return ret;
	
	}
} /*obtExprParser */

//out20130228 if (Object.freeze) {Object.freeze(enumttype);}

