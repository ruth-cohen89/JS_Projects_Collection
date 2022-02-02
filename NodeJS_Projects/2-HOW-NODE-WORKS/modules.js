// console.log(arguments)
// console.log('yay')
// console.log(require('module').wrapper)

//module.exports
const C = require("./test-module-1")
const calc1=new C();
console.log(calc1.add(2,5))

//Exports
const calc2=require('./test-module-2');
//destructing the object 
const {add, multiply}=require('./test-module-2');
console.log(calc2.add(2,2));

//chaching and IIFE
//the module is loaded once and the code inside is executed inside 
//so each require is the execution of the code from cash, of module.exports
//but the first line in the module was executed only once
require('./test-module-3')();
require('./test-module-3')();
