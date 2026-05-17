// fizzbuzz.js — FizzBuzz Classic + Custom

// === VERSION 1: Classic FizzBuzz ===
console.log("=== CLASSIC FIZZBUZZ (1-100) ===")

for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log(i + ": FizzBuzz")
    } else if (i % 3 === 0) {
        console.log(i + ": Fizz")
    } else if (i % 5 === 0) {
        console.log(i + ": Buzz")
    } else {
        console.log(i)
    }
}

// === VERSION 2: Custom FizzBuzz ===
console.log("\n=== CUSTOM FIZZBUZZ ===")

function customFizzBuzz(n, rules) {
    for (let i = 1; i <= n; i++) {
        let result = ""

        // Duyệt qua từng rule, nối word nếu chia hết
        for (let j = 0; j < rules.length; j++) {
            if (i % rules[j].divisor === 0) {
                result += rules[j].word
            }
        }

        // Nếu không khớp rule nào thì in số
        if (result === "") {
            console.log(i)
        } else {
            console.log(i + ": " + result)
        }
    }
}

// Test với 3 rules
console.log("\n--- Test: Fizz(3) + Buzz(5) + Jazz(7) ---")
customFizzBuzz(35, [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
])
