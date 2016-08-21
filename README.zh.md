# sprintf.js

sprintf.js 是用於格式化字串的 javascript library
參考自 golang 的 `fmt.Sprintf`。

## 使用

此專案並非 javascript model 專案，要使用請直接在網頁加上
	
```javascript
<script src="/path/of/sprintf.js"></script>
```

## 語法

```javascript
sprintf(formatedString, …args)
```

本 function 類同於 golang 的 [`fmt.Sprintf`](https://golang.org/pkg/fmt/#Sprintf)、 C語言的 [`sprintf()`](https://www-s.acm.illinois.edu/webmonkeys/book/c_guide/2.12.html#printf)、Java的 [`String.format()`](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html)……等。

格式化字串的語法格式如下：

	%    +0           4          .           2                  f
	    flag     長度（width）        精確度（presision）     格式指定碼

其中，精確度僅會用於浮點數。

### flag
 - 	`0`
	
	當內容的長度比指定長度（width）短時，以 `0` 
	
 - 	`#`
	
	請參考格式指定碼的 `v` 
	
	
 - 	` `（空格）
	
	當不輸出正負號時，就輸出空白
	
	
 - 	`+`
	
	（數字）強制顯示正負號
	
 - 	`-`
	
	輸出內容靠左顯示
	

### 格式指定碼

sprintf 允許下列格式指定碼

#### 數字相關	

 - 	`b`

	轉換成2進位數字

 - 	`o`

	轉換成8進位數字

 - 	`d`

	轉換成整數

 - 	`x`

	轉換成16進位數字（以小寫顯示）

 - 	`X`

	轉換成16進位數字（以大寫顯示）

 - 	`e`

	將數字轉換成科學計數法格式（以小寫顯示）

 - 	`E`

	將數字轉換成科學計數法格式（以大寫顯示）

 - 	`f` / `F`

	轉換成浮點數

 - 	`g`

	轉換數字成特定格式，若數字很大，則等同於 `%e` ；否則等同於 `%f`

 - 	`G`

	轉換數字成特定格式，若數字很大，則等同於 `%E` ；否則等同於 `%F`

 - 	`T`

	輸出參數類型。若該參數是個 object ，則輸出其 constructor name 。

 - 	`U`

	將數字轉換成 unicode 格式。
	
	例如 `sprintf("%U", 6896)` 會輸出 `U+1AF0`。

 - 	`c`

	如果參數是數字，則將其視為 char code 轉為 char；
	若為字串，則取第一個字元。

 - 	`q`

	若參數是數字，將其視為 char code 轉為 char，再加上單引號（`''`），等同於 `sprintf("'%c'", arugment)`；
	若為字串，則取第一個字元，等同於 `sprintf("\"%c\"", argument)`

#### 字串相關

- 	`s`

	輸出字串。


#### 布林（布尔）值相關

- 	`t`

	輸出布林（布尔）值。

#### 其他

 - 	`v`

	以默認格式指定碼輸出參數。

	各類型的參數之默認格式指定碼如下：

	 - 	整數：`d`
	 - 	浮點數：`f`
	 - 	字串：`s`
	 - 	Object：Object 如果有 `#` flag（即 `%#v`），則以 JSON 格式輸出；若沒有則輸出其 `toString()` 的值

	例如：

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