var number = 1;
var a = [1, 2, 3, 4, 5];
var b = { one: 1, "two": "two", three: [3] };
var c;
var d = null;
var string = "I love programming!";

console.log(typeof a);
console.log(`the variable ${a} is of type ${typeof a}`);

console.log(typeof b.one);
console.log(`the variable ${b} is of type ${typeof b.one}`);

console.log(typeof c);
console.log(`the variable ${c} is of type ${typeof c}`);

console.log(typeof d);
console.log(`the variable ${d} is of type ${typeof d}`);

console.log(typeof d);
console.log(`the variable ${b[`one`]} is of type ${typeof b.one}`);

console.log(typeof string);
console.log(`the variable ${string} is of type ${typeof string}`);