---
title: JS异步的另一种操作
date: 2022-03-31 16:33:00
categories: 未分类
---

直接上代码。

```js
const targetURL='https://jsdrp.ltdoge.top/gh/LtD0gE/MetingJS/source/custom.json';
fetch(targetURL)
	.then(resp => resp.json())
	.then(custom => SomeArrayObJect.unshift(custom));
```

这里使用Promise对象进行异步操作，它是ECMAScript 6引入的一个功能，旨在更优雅地进行异步操作，同时方便了代码编写和维护。

以及......

![](https://pic.imgdb.cn/item/62456a4f27f86abb2a49f4ed.jpg)

再送IE一程。如上图所示，IE完全不支持Promise，落后全世界整整七年（ECMAScript 6于2015年6月正式通过，成为国际标准）。图片截取自[MDN Web Docs - Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)。

也许有些小朋友要问了：“这种操作用回调函数不香吗，为啥还要搞Promise？”

![](https://pic.imgdb.cn/item/62456c1f27f86abb2a4d85e0.jpg)

那多步回调呢？

我们试试多层嵌套函数，带点小变量。

```js
Func_0(varA,Func_1(Func_2(varB,Func_4(varD,varE,Func_5(varF,Func_6(...)))),Func_3(varC),varD))
```

写在单行里复杂的要死，写成多行。

```js
Func_0(varA, 
    Func_1(
        Func_2(varB, 
            Func_4(varD, varE, 
                Func_5(varF, 
                    Func_6(varG)))), 
        Func_3(varC), varD))
```

好看了点，但是以后不好维护，变量名很长或者直接传入大段字符串的时候更难办。

如果用上Promise，会怎么样呢？

```js
//先把Func_x函数转为Promise对象：
function Func_x(varA,varB,...){
    return new Promise(function(resolve, reject){
        // some code
        // varA、varB在此使用
        resolve(varC); //执行完成调用resolve函数
        // reject(varD,...)
    })
}
// ...
Func_2(varA)
	.then(Func_1)
	.then(Func_0)
```

从上面代码的最后三行可以看出，用Promise进行异步操作在代码书写上是一种连续的结构，利于书写的同时也利于阅读。比函数嵌套那种“飞流直下三千尺”的现象好多了。

当一个Promise函数下方有then时，resolve() 会向then中的函数传递**仅一个**参数。如果下面不再有then，则返回一个Promise对象。除此之外，resolve() 还会将当前Promise的状态设置为fulfilled。

下面的代码是需要向Promise过程中传递外部参数，且需要向then中传递多个参数时的解决方案，应该是比较常见的情景。

```js
var f=4 //这是外部参数
function a(){
    return new Promise(function(resolve, reject){
        var a=1
        var b=2
        var pass={aa:a+b, bb:f} //键值对用于传递多个参数，也可用方括号数组代替
        resolve(pass)
    })
}
function b(recv){
    return new Promise(function(resolve, reject){
        var c=3
        var d=recv["aa"]
        var e=recv["bb"]
//        console.warn(recv)
//        console.warn(d)
//        console.warn(e)
        console.log(c+d+e)
        resolve()
    })
}

a() //a函数中的resolve(pass) 将pass传递给b函数
.then(b) //b函数下方没有then，resolve()返回b函数的Promise对象

//a+b+c+f = 1+2+3+4 = 10，控制台输出即为10
```

那Promise对象里的resolve() 和reject() 有啥区别呢

![](https://pic.imgdb.cn/item/6245818527f86abb2a775809.jpg)

```js
function calc(a,b){
    return new Promise(function(resolve, reject){
        if(b == 0) reject("Divided by zero!");
        resolve(a/b);
    })
}
function output(result){
    return new Promise(function(resolve, reject){
        console.log(result);
        resolve();
    })
}
calc(4,2)
.then(output)
.catch(err => console.error(err))
.finally(console.log("Completed!"))
//控制台输出：
// 2
// Completed!
calc(2,0)
.then(output)
.catch(err => console.error(err))
.finally(console.log("Completed!"))
//控制台输出：
// Divided by zero!        (报错)
// Completed!
```

从第二次Promise可以看出，reject() 的作用其实和throw差不多，就是抛出一个异常。但reject() 还会打断接下来的Promise过程，并将当前Promise过程的状态设置为rejected。既没有resolve() 也没有reject() 的Promise状态叫作pending，它是Promise创建时的初始状态。

而reject() 抛出的异常，会一直向后传递，直到被catch() 函数捕获。如果异常未捕获，JS解释器则会输出错误信息：

```text
Uncaught (in promise) 抛出的异常原因
```

不管这个Promise过程是fulfilled、relected还是pending，finally() 函数总是会在Promise过程结束时开始执行。异步操作完成时如果需要上报信息，可以写在finally里面，而不用then和catch各写一份。

如果我们需要多个异步任务并行，在它们全部完成后继续执行下一步操作，该怎么写呢？

我们可以用forEach配合Promise实现：

```js
var results=[]
var params=[1,2,3]
function aa(num){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log(num);
            resolve();
        },2000);
    })
}
let async=[]
params.forEach(function(param){
    async.push(aa(param))
})
Promise.all(async).then(function(){
    console.log("done")
})
```

执行以上代码，控制台在2秒后同时输出：

```text
1
2
3
done
```

对了，关于文章开头那段代码里的这个结构：

```js
(varA,varB) => {...}
```

这是ECMAScript 6引入的箭头函数。比如以下代码：

```js
func = (a,b) => {console.log(a+b)}
```

等效于：

```js
function func(a,b){
    console.log(a+b)
}
```

当只传递一个参数时，圆括号可以省略。

```js
func = a => {console.log(a)}
//等效于
function func(a){
    console.log(a)
}
```

不带花括号时，执行此函数会返回箭头后的值。

```js
func = (a,b) => a+b
//等效于
function func(a,b){
    return a+b
}
```

```js
func = (a,b) => func2(a,b)
//等效于
function func(a,b){
    return func2(a,b)
}
```

