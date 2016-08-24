# sprintf.js

sprintf.js is a javascript library used for formating string.
The idea is from `fmt.Sprintf` of GoLang.

## Usage

Note: This project is not a javascript model project. To use it please add the following code into your web page.

``` HTML
<script src="/path/of/sprintf.js"></script>
```

## 語法

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
	
	請參考格式指定碼的 `v` 
	
	
 - 	` ` (space)
	
	leave a space for elided sign in numbers (% d);
	put spaces between bytes printing strings or slices in hex (% x, % X)
	
	
 - 	`+`
	
	always print a sign for numeric values;
	guarantee ASCII-only output for %q (%+q)
	
 - 	`-`
	
	pad with spaces on the right rather than the left (left-justify the field)
	

### Format Specifier

sprintf 允許下列格式指定碼

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

	如果參數是數字，則將其視為 char code 轉為 char；
	若為字串，則取第一個字元。


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
		 

### 指定參數

通常來講，參數都是從第一個照順序取得，但可以用 `[]` 來指定輸出的參數，例如：

``` javascript
sprintf("%[2]d", 11, 22)
```

上例中， `[2]` 表示輸出的參數為第 2 個參數。

而輸出長度、浮點數的精確度亦可以參數來決定值，此時要加 * 號，即 `[]*` ，例如

``` javascript
sprintf("%[2]*.[4]*[3]f", 11, 12, 13.123, 14, 15)
```

等同於

``` javascript
sprintf("%12.14[3]f")
```

另外，若有指定參數（無論是使用 `[]` 指定輸出參數還是 `[]*` 指定長度或精確度）都會影響下一個輸出參數。
例如：

``` javascript
sprintf("%[2]d	%d", 100, 200, 300)
```

等同於

``` javascript
sprintf("%[2]d	%[3]d", 100, 200, 300)
```
	
而指定長度／精確度的話

``` javascript
sprintf("%[2]*d", 100, 200, 300)
```

等同於

``` javascript	
sprintf("%[2]*[3]d", 100, 200, 300)
```