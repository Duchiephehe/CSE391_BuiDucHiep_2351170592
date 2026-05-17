// var_let_const.js — Kiểm tra output các đoạn code

// Đoạn 1: var hoisting
console.log("=== Đoạn 1 ===");
console.log(x); // undefined (var hoisting)
var x = 5;

// Đoạn 2: let không cho dùng trước khai báo
console.log("\n=== Đoạn 2 ===");
try {
    console.log(y); // ReferenceError
    let y = 10;
} catch (e) {
    console.log("Lỗi:", e.message);
}

// Đoạn 3: const không cho gán lại
console.log("\n=== Đoạn 3 ===");
try {
    const z = 15;
    z = 20; // TypeError
    console.log(z);
} catch (e) {
    console.log("Lỗi:", e.message);
}

// Đoạn 4: const cho phép thay đổi nội dung mảng
console.log("\n=== Đoạn 4 ===");
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]

// Đoạn 5: let block scope
console.log("\n=== Đoạn 5 ===");
let a = 1;
{
    let a = 2;
    console.log("Trong block:", a); // 2
}
console.log("Ngoài block:", a); // 1


// console.log(typeof null);              // ???
// console.log(typeof undefined);         // ???
// console.log(typeof NaN);              // ???
// console.log("5" + 3);                 // ???
// console.log("5" - 3);                 // ???
// console.log("5" * "3");              // ???
// console.log(true + true);            // ???
// console.log([] + []);                // ???
// console.log([] + {});                // ???
// console.log({} + []);                // ???

// console.log(5 == "5");                // ???
// console.log(5 === "5");               // ???
// console.log(null == undefined);       // ???
// console.log(null === undefined);      // ???
// console.log(NaN == NaN);             // ???
// console.log(0 == false);             // ???
// console.log(0 === false);            // ???
// console.log("" == false);            // ???

if ("0") console.log("A");           // In hay không?
if ("") console.log("B");            // In hay không?
if ([]) console.log("C");            // In hay không?
if ({}) console.log("D");            // In hay không?
if (null) console.log("E");          // In hay không?
if (0) console.log("F");             // In hay không?
if (-1) console.log("G");            // In hay không?
if (" ") console.log("H");           // In hay không? (space)