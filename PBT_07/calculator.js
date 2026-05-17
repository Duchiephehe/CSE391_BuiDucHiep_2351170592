// calculator.js — Máy tính đơn giản

function calculate(num1, operator, num2) {
    // Kiểm tra input có phải số không
    if (typeof num1 !== 'number' || typeof num2 !== 'number' || isNaN(num1) || isNaN(num2)) {
        return "Lỗi: Input không phải số"
    }

    // Xử lý từng operator
    if (operator === "+") {
        return num1 + num2
    } else if (operator === "-") {
        return num1 - num2
    } else if (operator === "*") {
        return num1 * num2
    } else if (operator === "/") {
        // Kiểm tra chia cho 0
        if (num2 === 0) {
            return "Lỗi: Không thể chia cho 0"
        }
        return num1 / num2
    } else if (operator === "%") {
        if (num2 === 0) {
            return "Lỗi: Không thể chia cho 0"
        }
        return num1 % num2
    } else if (operator === "**") {
        return num1 ** num2
    } else {
        return "Lỗi: Operator '" + operator + "' không hợp lệ"
    }
}

// === TEST ===
console.log(calculate(10, "+", 5));     // 15
console.log(calculate(10, "-", 3));     // 7
console.log(calculate(10, "*", 4));     // 40
console.log(calculate(10, "/", 2));     // 5
console.log(calculate(10, "%", 3));     // 1
console.log(calculate(2, "**", 10));    // 1024
console.log(calculate(10, "/", 0));     // Lỗi: Không thể chia cho 0
console.log(calculate(10, "^", 5));     // Lỗi: Operator '^' không hợp lệ
console.log(calculate("abc", "+", 5)); // Lỗi: Input không phải số
