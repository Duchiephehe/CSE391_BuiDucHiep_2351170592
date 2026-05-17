// student_data.js — Xử lý dữ liệu sinh viên

const students = [
    { name: "An", math: 8, physics: 7, cs: 9, gender: "M" },
    { name: "Bình", math: 6, physics: 9, cs: 7, gender: "F" },
    { name: "Chi", math: 9, physics: 6, cs: 8, gender: "F" },
    { name: "Dũng", math: 5, physics: 5, cs: 6, gender: "M" },
    { name: "Em", math: 10, physics: 8, cs: 9, gender: "F" },
    { name: "Phong", math: 3, physics: 4, cs: 5, gender: "M" },
    { name: "Giang", math: 7, physics: 7, cs: 7, gender: "F" },
    { name: "Huy", math: 4, physics: 6, cs: 3, gender: "M" },
]

// 1. Tính điểm trung bình cho mỗi SV
function tinhTB(sv) {
    return sv.math * 0.4 + sv.physics * 0.3 + sv.cs * 0.3
}

// 2. Xếp loại theo điểm TB
function xepLoai(diemTB) {
    if (diemTB >= 8.0) {
        return "Giỏi"
    } else if (diemTB >= 6.5) {
        return "Khá"
    } else if (diemTB >= 5.0) {
        return "Trung bình"
    } else {
        return "Yếu"
    }
}

// 3. In bảng kết quả
console.log("=== BẢNG ĐIỂM SINH VIÊN ===")
console.log("| STT | Tên      | TB   | Xếp loại   |")
console.log("|-----|----------|------|------------|")

for (let i = 0; i < students.length; i++) {
    let tb = tinhTB(students[i])
    let loai = xepLoai(tb)
    let stt = (i + 1).toString().padStart(3)
    let ten = students[i].name.padEnd(8)
    let diemStr = tb.toFixed(1).padStart(4)
    let loaiStr = loai.padEnd(10)
    console.log(`| ${stt} | ${ten} | ${diemStr} | ${loaiStr} |`)
}

// 4. Đếm số SV mỗi xếp loại
let demGioi = 0
let demKha = 0
let demTB = 0
let demYeu = 0

for (let i = 0; i < students.length; i++) {
    let tb = tinhTB(students[i])
    let loai = xepLoai(tb)
    if (loai === "Giỏi") {
        demGioi++
    } else if (loai === "Khá") {
        demKha++
    } else if (loai === "Trung bình") {
        demTB++
    } else {
        demYeu++
    }
}

console.log("\n=== THỐNG KÊ XẾP LOẠI ===")
console.log("Giỏi:       " + demGioi + " SV")
console.log("Khá:        " + demKha + " SV")
console.log("Trung bình: " + demTB + " SV")
console.log("Yếu:        " + demYeu + " SV")

// 5. Tìm SV điểm TB cao nhất và thấp nhất
let svCaoNhat = students[0]
let svThapNhat = students[0]
let diemCaoNhat = tinhTB(students[0])
let diemThapNhat = tinhTB(students[0])

for (let i = 1; i < students.length; i++) {
    let tb = tinhTB(students[i])
    if (tb > diemCaoNhat) {
        diemCaoNhat = tb
        svCaoNhat = students[i]
    }
    if (tb < diemThapNhat) {
        diemThapNhat = tb
        svThapNhat = students[i]
    }
}

console.log("\n=== CAO NHẤT / THẤP NHẤT ===")
console.log("Cao nhất: " + svCaoNhat.name + " — TB: " + diemCaoNhat.toFixed(1))
console.log("Thấp nhất: " + svThapNhat.name + " — TB: " + diemThapNhat.toFixed(1))

// 6. Điểm TB toàn lớp cho từng môn
let tongMath = 0
let tongPhysics = 0
let tongCs = 0

for (let i = 0; i < students.length; i++) {
    tongMath += students[i].math
    tongPhysics += students[i].physics
    tongCs += students[i].cs
}

let soSV = students.length

console.log("\n=== ĐIỂM TB TỪNG MÔN ===")
console.log("Toán:      " + (tongMath / soSV).toFixed(2))
console.log("Vật lý:    " + (tongPhysics / soSV).toFixed(2))
console.log("Tin học:    " + (tongCs / soSV).toFixed(2))

// 7. Bonus: Điểm TB theo giới tính
let tongNam = 0
let demNam = 0
let tongNu = 0
let demNu = 0

for (let i = 0; i < students.length; i++) {
    let tb = tinhTB(students[i])
    if (students[i].gender === "M") {
        tongNam += tb
        demNam++
    } else {
        tongNu += tb
        demNu++
    }
}

console.log("\n=== ĐIỂM TB THEO GIỚI TÍNH ===")
console.log("Nam (M): " + (tongNam / demNam).toFixed(2) + " (" + demNam + " SV)")
console.log("Nữ (F):  " + (tongNu / demNu).toFixed(2) + " (" + demNu + " SV)")
