// guess.js — Mini Game Đoán Số

// Random số từ 1-100
let soBI = Math.floor(Math.random() * 100) + 1
let soLanDoan = 0
let maxLan = 7
let daDoan = [] // lưu các số đã đoán

alert("🎮 GAME ĐOÁN SỐ\nMáy đã chọn 1 số từ 1-100.\nBạn có " + maxLan + " lần đoán. Chúc may mắn!")

while (soLanDoan < maxLan) {
    let conLai = maxLan - soLanDoan
    let input = prompt("Lần " + (soLanDoan + 1) + "/" + maxLan + " — Nhập số (1-100):\n(Còn " + conLai + " lượt)")

    // User bấm Cancel → thoát
    if (input === null) {
        alert("Bạn đã thoát game. Đáp án là: " + soBI)
        break
    }

    // Chuyển thành số
    let so = Number(input)

    // Validate: phải là số từ 1-100
    if (isNaN(so) || so < 1 || so > 100 || so !== Math.floor(so)) {
        alert("⚠️ Vui lòng nhập số nguyên từ 1 đến 100!")
        continue // không tính lượt
    }

    // Kiểm tra đã đoán số này chưa
    let daDoanRoi = false
    for (let i = 0; i < daDoan.length; i++) {
        if (daDoan[i] === so) {
            daDoanRoi = true
            break
        }
    }

    if (daDoanRoi) {
        alert("⚠️ Bạn đã đoán số " + so + " rồi! Thử số khác.")
        continue // không tính lượt
    }

    // Lưu số đã đoán
    daDoan.push(so)
    soLanDoan++

    // So sánh
    if (so === soBI) {
        alert("🎉 Đúng rồi! Đáp án là " + soBI + "!\nBạn đoán đúng sau " + soLanDoan + " lần!")
        break
    } else if (so < soBI) {
        if (soLanDoan < maxLan) {
            alert("📈 Cao hơn! (Bạn đoán: " + so + ")")
        }
    } else {
        if (soLanDoan < maxLan) {
            alert("📉 Thấp hơn! (Bạn đoán: " + so + ")")
        }
    }

    // Hết lượt
    if (soLanDoan >= maxLan && so !== soBI) {
        alert(" Hết lượt rồi! Đáp án là: " + soBI + "\nBạn đã đoán " + soLanDoan + " lần.")
    }
}
