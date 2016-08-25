# sprintf.js 
[![Apache 2.0 License](https://img.shields.io/badge/listence-apache%202.0-%23CB2533.svg)](http://www.apache.org/licenses/LICENSE-2.0)

sprintf.js is a javascript library used for formating string.
The idea is from `fmt.Sprintf` of GoLang.

The Chinese Documention please read [README.zh.md](README.zh.md).

JSDoc can be found in [http://shiyou0130011.github.io/sprintf.js/doc/](http://shiyou0130011.github.io/sprintf.js/doc/).

## Usage

Note: This project is not a javascript model project. To use it please add the following code into your web page.

``` HTML
<script src="/path/of/sprintf.js"></script>
```

## Printing

``` javascript
sprintf(formatedString, …args)
```

This function is similar as [`fmt.Sprintf` of GoLang](https://golang.org/pkg/fmt/#Sprintf), [`sprintf()` of C language](https://www-s.acm.illinois.edu/webmonkeys/book/c_guide/2.12.html#printf), [`String.format()` of Java](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html)... etc.


The formating rule is: 

	%    +0        4     .       2                f
	    flag     width       presision     format specifier


### flags

 - 	`0`
	
	pad with leading zeros rather than spaces;
	for numbers, this moves the padding after the sign
	
 - 	`#`
	
	Please see `v` in “Format Specifier”.
	
	
 - 	` ` (space)
	
	leave a space for elided sign in numbers (% d);
	put spaces between bytes printing strings or slices in hex (% x, % X)
	
	
 - 	`+`
	
	always print a sign for numeric values;
	guarantee ASCII-only output for %q (%+q)
	
 - 	`-`
	
	pad with spaces on the right rather than the left (left-justify the field)
	

### Format Specifier

`sprintf()` allows following format specifiers: 

#### For Numbers	

 - 	`b`

	Convert the number to binery number.

 - 	`o`

	Convert the number to octal numeral.

 - 	`d`

	Convert the number to decimal integer.

 - 	`x`

	Convert the number to hexadecimal number (lower case).

 - 	`X`

	Convert the number to hexadecimal number (upper case).

 - 	`e`

	Expressing the number by scientific notation (lower case).

 - 	`E`

	Expressing the number by scientific notation (upper case).

 - 	`f` / `F`

	Convert the number to a float number.


 - 	`g`

	Convert the number. If it is a large exponents, it is same as `%e`. Otherwise `%f`.

 - 	`G`

	Convert the number. If it is a large exponents, it is same as `%E`. Otherwise `%f`.

 - 	`U`

	Expressing the number by unicode format (upper case).
	For example: 
	
	``` javascript
	sprintf("%U", 6896)	// return "U+1AF0"
	```

 - 	`c`

	If the argument is a number, it will be seen as a char code and be converted to the char;
	If it is a string, it will return the first char of the string.
	
	For example: 
	
	``` javascript
	sprintf("%c", 65)	// return "A"
	sprintf("%c", "ABC")	// return "A"
	```

#### For String

- 	`s`

	Expressing the argument as a string

- 	`q`

	If the argument is a number, a single-quoted character literal safely escaped (same as `sprintf("'%c'", arugment)`).
	Otherwise, if it is a string, return a double-quoted string safely escaped (same as `sprintf("\"%c\"", argument)`).
	
	For example: 
	
	``` javascript
	sprintf("%q", 100)	// return "'d'"
	sprintf("%q", "d")	// return "\"d\""
	```
	
#### For Boolean

- 	`t`

	Expressing a boolean.

#### Others

 - 	`T`

	Return the type of the argument. If the argument is an object, it will return the name of its constructor.
	
	For example: 
	
	``` javascript
	sprintf("%T", 123)	// return "number"
	sprintf("%T", 123.4)	// return "number"
	sprintf("%T", "123")	// return "string"
	sprintf("%T", true)	// return "boolean"
	sprintf("%T", {a: 123})	// return "Object"
	sprintf("%T", [1, 23])	// return "Array"		
	```

 - 	`v`

	Return the argument in default format

	The default format is:

	 - 	decimal integer: `d`
	 - 	float: `f`
	 - 	string: `s`
	 - 	Object: 
	 
	 	- If it is with `#` flag (`%#v`), convert the argument in JSON format
		- Otherwise, return the value of the argument’s `toString()`.

	For example: 

	``` javascript
	sprintf("%v", 123)             // return "123"
	sprintf("%v", 123.456)         // return "123.4000"
	sprintf("%v", "Test")          // return "Test"
	sprintf("%v", {a:123, b:456})  // return "[object Object]"
	sprintf("%v", {
		a:123, 
		b:456,
		toString: function(){
			return "[MyObject]"
		}
	})                             // return "[MyObject]"
	sprintf("%#v", {a:123, b:456}) // return "{"a":123,"b":456}"
	```
		 

### Explicit argument indexes

The default behavior is for each formatting verb to format successive arguments passed in the call. However, the notation `[]` immediately before the verb indicates that the nth one-indexed argument is to be formatted instead. For example: 

``` javascript
sprintf("%[2]d", 11, 22)	// return "22"
```

The notation before a '*' (`[]*`) for a width or precision selects the argument index holding the value.
For instance: 

``` javascript
sprintf("%[2]*.[4]*[3]f", 11, 12, 13.123, 14, 15)
```

It is the same as

``` javascript
sprintf("%12.14[3]f")
```

Also, after processing a bracketed expression [n], subsequent verbs will use arguments n+1, n+2, etc. unless otherwise directed.
For example: 

``` javascript
sprintf("%[2]d	%d", 100, 200, 300)
```

It is the same as following code: 

``` javascript
sprintf("%[2]d	%[3]d", 100, 200, 300)
```
	
For setting width or precision: 

``` javascript
sprintf("%[2]*d", 100, 200, 300)
```

It is the same as following code: 

``` javascript	
sprintf("%[2]*[3]d", 100, 200, 300)
```