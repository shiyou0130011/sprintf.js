/**
 * @license Apache-2.0
 */


/**
 * @typedef {string}	FormatKeyword
 * The keyword for formating. 
 * These are the keyword supported:
 * 
 * <dl>
 * 	<dt>%</dt>	<dd>Returns the string <code>%</code>.</dd>
 * 	<dt>b</dt>	<dd>Convert the number to binery number.</dd>
 * 	<dt>o</dt>	<dd>Convert the number to octal numeral. </dd>
 * 	<dt>d</dt>	<dd>Convert the number to decimal integer.</dd>
 * 	<dt>x</dt>	<dd>Convert the number to hexadecimal number (lower case).</dd>
 * 	<dt>X</dt>	<dd>Convert the number to hexadecimal number (upper case).</dd>
 * 	<dt>e</dt>	<dd>Expressing the number by scientific notation (lower case).</dd>
 * 	<dt>E</dt>	<dd>Expressing the number by scientific notation (upper case).</dd>
 * 	<dt>f</dt>	<dd>Convert the number to a float number.</dd>
 * 	<dt>F</dt>	<dd>Convert the number to a float number.</dd>
 * 	<dt>g</dt>	<dd>Convert the number. If it is a large exponents, it is same as <code>%e</code>. Otherwise <code>%f</code></dd>
 * 	<dt>G</dt>	<dd>Convert the number. If it is a large exponents, it is same as <code>%E</code>. Otherwise <code>%f</code></dd>
 * 	<dt>T</dt>	<dd>Return the type of the argument. If the argument is an object, it will return the name of its constructor.</dd>
 * 	<dt>U</dt>	<dd>Expressing the number by unicode format (upper case). E.g. <code>U+1AF0</code>.</dd>
 * 	<dt>c</dt>	<dd>Convert the char code (number) to the char.</dd>
 * 	<dt>p</dt>	<dd></dd>
 * 	<dt>q</dt>	<dd>If the argument is a number, convert it to the char with single quote.</dd>
 *  			<dd>If the argument is a string, return it with double quote.</dd>
 * 	<dt>s</dt>	<dd>Return the string</dd>
 * 	<dt>t</dt>	<dd>Convert the argument as a boolean.</dd>
 * 	<dt>v</dt>	<dd>Return the value in its default format.</dd>
 *  			<dd>If the format string is with hash (<code>%#v</code>), it will be formated as a json.</dd>
 * </dl>
 */

/**
 *  To format the string using the specified format string and arguments.
 *  
 * @param	{string}	formatedString A format string
 * @param	{...*}  	args           Arguments referenced by the format specifiers in the format string. 
 * @returns	{string}	The string after formated
 */
function sprintf(formatedString) {
	"use strict";
	/** 
	 * Get the formated error message for formating issue.
	 * @param   {string} [message=""]     the error message
	 * @param   {FormatKeyword} [format=""]            
	 * @param   {string} extraInformation 
	 * @returns {string} Error message
	 */
	function errorMessage(message, format, extraInformation){
		message = message || ""
		format = format || ""
		if(extraInformation){
			if(typeof extraInformation == "object"){
				extraInformation = ": " + extraInformation.constructor.name
			}else{
				extraInformation = ": " + extraInformation
			}
			
		}else{
			extraInformation = ""
		}
		return "%!" + format + "(" + message + extraInformation + ")"
	}
	
	var replaceReg = /((%([\[\]\d*.+\-# ]+|)[vT%tbcdoqxXUeEfFgGsptg])|%%|%)/g,
	    formatKeyWordsReg = /[vT%tbcdoqxXUeEfFgGsq]/
	
	// 浮點數的默認精確度
	var DEFAULT_PRECISION = 6
	
	/** format 參數 */
	var args = Array.prototype.slice.call(arguments, 1)
	args.splice(0, 0, null)
	/** 檢索中的參數的 index */
	var argIndex = 0
	
	var hasBracket = formatedString.search(/[\[\]]/g) >= 0
	
	formatedString = formatedString.replace(replaceReg, function(format, formatIndex, formatedStr){
		if(format == "%"){
			return errorMessage("No Variable")
		}
		
		/** @type FormatKeyword */
		var formatKeyWord = format.charAt(format.length - 1)	
		
		if(!formatKeyWord.match(formatKeyWordsReg)){
			return errorMessage("Wrong Format", formatKeyWord)
		}
		
		if(formatKeyWord == "%"){
			return "%"
		}
		
		var width = format.substr(1, format.length - 2)	
		
		var fmt = {
			minus: false,
			plus: false,
			sharp: false,
			space: false,
			zero: false
		}
		
		// get flags
		var flagString = ""
		if(width.search(/[\[\]1-9.]/g) >= 0){
			flagString = width.substr(0, width.search(/[\[\]1-9.]/g))
		}else{
			flagString = width
		}
		(flagString.match(/[\+\-# 0]/g) || []).forEach(function(flag){
			switch(flag){
				case "+":
					fmt.plus = true
					break
				case "-":
					fmt.minus = true
					break
				case "#":
					fmt.sharp = true
					break
				case " ":
					fmt.space = true
					break
				case "0":
					fmt.zero = true
					break
			}
		})
		width = width.replace(flagString, "")
		
		// searching for formats like %[2]*.4d
		while(width.indexOf("*") >= 0){
			var starIndex = width.indexOf("*"),
			    leftBracketIndex = width.indexOf("["),
			    rightBracketIndex = width.indexOf("]")
			
			if(leftBracketIndex > starIndex || rightBracketIndex > starIndex || rightBracketIndex + 1 != starIndex){
				return errorMessage("Missing Index", formatKeyWord)
			}
			
			var explicitArgIndex = width.substr(leftBracketIndex + 1, rightBracketIndex - leftBracketIndex - 1)
			if(isNaN(Number(explicitArgIndex)) || Number(explicitArgIndex) < 1 || Number(explicitArgIndex) != parseInt(explicitArgIndex)){
				return errorMessage("Bad Width", formatKeyWord)
			}
			
			if(explicitArgIndex >= args.length){
				return errorMessage("Bad Precision", formatKeyWord)
			}
			
			argIndex = explicitArgIndex
			
			if(isNaN(Number(args[argIndex])) || Number(args[argIndex]) < 1 || Number(args[argIndex]) != parseInt(args[argIndex])){
				return errorMessage("Bad Precision", formatKeyWord, args[argIndex])
			}
			
			// replace the width
			// e.g. width is "[2]*.[5]*[3]", and arguments are [11,22,33,44,55,66] 
			//      after first replacing, with will become "22.[5]*[3]"
			width = width.replace(
				width.substring(leftBracketIndex, starIndex + 1),
				args[argIndex]
			)
		}
		
		// get the argument
		if(width.match(/[\[\]]/g) && width.match(/[\[\]]/g).length == 2){
			var leftBracketIndex = width.indexOf("["),
			    rightBracketIndex = width.indexOf("]")
			
			if(leftBracketIndex > rightBracketIndex){
				return errorMessage("MISSING INDEX", formatKeyWord)
			}
			var explicitArgIndex = width.substr(leftBracketIndex + 1, rightBracketIndex - leftBracketIndex - 1)
			
			if(isNaN(explicitArgIndex) || explicitArgIndex >= args.length || Number(explicitArgIndex) != parseInt(explicitArgIndex)){
				return errorMessage("Bad Index", formatKeyWord, explicitArgIndex)
			}
			
			argIndex = Number(explicitArgIndex)
			
			// clean the width 
			// e.g. if width is "+23.5[2]", replace it to "+23.5"
			width = width.replace(
				width.substring(leftBracketIndex, explicitArgIndex + 1),
				""
			)
		}else{
			argIndex++
			if(argIndex >= args.length){
				return errorMessage("Bad Index", formatKeyWord)
			}
		}
		
		if(width.search(/[^\d\.]/g) >= 0){
			return errorMessage("Bad Width", formatKeyWord, width)
		}
		
		/** 要格式化的 Argument */
		var formatArgument = args[argIndex]
		
		if(formatArgument === undefined){
			return errorMessage("undefined")
		}
		if(formatArgument === null){
			return errorMessage("null")
		}
		
		var precision = DEFAULT_PRECISION
		if(width == ""){
			width = "1"
		}else if(width.includes(".")){
			precision = width.substr(width.indexOf(".") + 1)
			width = width.substr(0, width.indexOf("."))
		}
		precision = Number(precision)
		
		// get argument
		switch(formatKeyWord){
			case "%":
				break
			case "f":
			case "F":
				// float
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				try{
					// JS 要 +1 ，因為 JS的精確度算法和 golang不同
					// 例如 Math.PI.toPrecision(2)，JS會是 "3.1"； golang會是 "3.14"
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseFloat(formatArgument).toPrecision(precision + 1)
				}catch(error){
					return errorMessage("Bad Precision", formatArgument, precision)
				}
				
				break
			case "T":
				// type of value
				if(typeof formatArgument == "object"){
					// if argument is an Object, return the name of its' constructor
					if(formatArgument.constructor.name == ""){
						formatArgument = "class anonymous"
					}else{
						formatArgument = "class " + formatArgument.constructor.name	
					}
					
				}else{
					formatArgument = typeof formatArgument
				}
				break
			case "U":
				// Unicode format. E.g. U+12AB
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				// the hex of the Argument 
				var hexOfArg = parseInt(formatArgument).toString(16).toUpperCase()
				
				formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + "U+" + "0".repeat(4 - hexOfArg.length >= 0? 4 - hexOfArg.length: 0) + hexOfArg
				break
			case "b":
				// 2進制
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + Number(formatArgument).toString(2)
				
				break
			case "c":
				// 將 char code 轉為 char
				if(!isNaN(Number(formatArgument))){
					formatArgument = String.fromCharCode(Number(formatArgument))
				}else if(typeof formatArgument == "string"){
					formatArgument = formatArgument.charAt(0)
					if(formatArgument == ""){
						return errorMessage("Empty Character", formatKeyWord, formatArgument)
					}
				}else{
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				
				break
			case "d":
				// 10進制整數
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseInt(formatArgument)
				break
			case "o":
				// 8進制
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + Number(formatArgument).toString(8)
				
				break
			case "x":
			case "X":
				// 16進制
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + Number(formatArgument).toString(16)
				
				if(formatKeyWord == "X"){
					formatArgument = formatArgument.toUpperCase()
				}
				break
			case "e":
			case "E":
				// 轉為科學計數法表示的數字，例如：1.024e3
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				try{
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseFloat(formatArgument).toExponential(precision)
				}catch(error){
					return errorMessage("Bad Precision", formatArgument, precision)
				}
				
				if(formatKeyWord == "E"){
					formatArgument = formatArgument.toUpperCase()
				}
				break
			case "g":
			case "G":
				// 當數字 >= 1000000 ，等同 %e / %E
				// 反之等同 %d / %f
				if(isNaN(Number(formatArgument))){
					return errorMessage("Wrong Type", formatKeyWord, formatArgument)
				}
				if(Number(formatArgument) >= 1000000){
					//TODO
				}else if(Number(formatArgument) == parseInt(formatArgument)){
					// is int
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseInt(formatArgument)
				}else{
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + Number(formatArgument).toPrecision(precision)
				}
				
				break
			case "p":
				break
			case "q":
				// 若參數為數字，將其轉為 char 並加上單引號 ''
				// 若參數為Sting，將其轉為 char 並加上雙引號 ""
				switch(typeof formatArgument){
					case "number":
						// 強制將數字轉為正整數，再轉成 char
						formatArgument = "'" + String.fromCharCode(Math.floor(Math.abs(formatArgument))) + "'"
						break
					case "string":
						formatArgument = "\"" + formatArgument + "\""
						break
					default:
						return errorMessage("Wrong Type", formatKeyWord, formatArgument)
						break
				}
				break
				
			case "s":
				// print string
				formatArgument = formatArgument + ""
				break
			case "t":
				// print boolean
				formatArgument = Boolean(formatArgument)
				break
			case "v":
				// the value in a default format
				// 若是以 %#v ，則 print JSON
				if(fmt.sharp && typeof formatArgument == "object"){
					formatArgument = JSON.stringify(formatArgument)
				}else if(Number(formatArgument) == parseInt(formatArgument)){
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseInt(formatArgument)
				}else if(!isNaN(Number(formatArgument))){
					formatArgument = (Number(formatArgument) >= 0 && fmt.plus? "+": "") + parseFloat(formatArgument).toPrecision(precision + 1)
				}else{
					formatArgument = formatArgument + ""
				}
				break
				
		}
		// 要補的 char。
		// 舉例來說如果是 %0d 的話，就是 '0'；否則為 " "
		var fillChar = " "
		if(fmt.zero){
			fillChar = "0"
		}
		
		if(fmt.space){
			formatArgument = " " + formatArgument
		}
	
		var fillLength = parseInt(width) - (formatArgument + "").length 
		if(fillLength < 0){
			fillLength = 0
		}
		
		if(fmt.minus){
			formatArgument = formatArgument + "" + fillChar.repeat(fillLength)
		}else{
			formatArgument = fillChar.repeat(fillLength) + "" + formatArgument
		}
		return formatArgument
	})
	
	var unusedArguments = args.slice(argIndex + 1, args.length)
	if(!hasBracket && unusedArguments.length){
		var argsMessages = []
		unusedArguments.forEach(function(uarg){
			argsMessages.push((typeof uarg) + "=" + (typeof uarg == "object"? JSON.stringify(uarg): uarg ))
		})
		
		formatedString += " " + errorMessage("Unformated Arguments: " + argsMessages.join(", "))
	}
	return formatedString
}
