// hoa_don.js — Tính hóa đơn nhà hàng

// Danh sách món ăn
const danhSachMon = [
    { ten: "Phở bò", gia: 65000, soLuong: 2 },
    { ten: "Trà đá", gia: 5000, soLuong: 3 },
    { ten: "Bún chả", gia: 55000, soLuong: 1 },
    { ten: "Cơm tấm", gia: 45000, soLuong: 2 },
    { ten: "Nước cam", gia: 25000, soLuong: 2 }
]

// Có muốn tip không
const coTip = true

// Hàm format tiền
function formatTien(so) {
    return so.toLocaleString('vi-VN') + "đ"
}

// Hàm format tên món cho gọn (rút ngắn giá thành dạng k)
function formatGiaK(gia) {
    if (gia >= 1000) {
        return (gia / 1000) + "k"
    }
    return gia + "đ"
}

// Tính tổng tiền
function tinhTong(danhSach) {
    let tong = 0
    for (let i = 0; i < danhSach.length; i++) {
        tong += danhSach[i].gia * danhSach[i].soLuong
    }
    return tong
}

// Tính phần trăm giảm giá theo tổng
function tinhPhanTramGiam(tong) {
    if (tong > 1000000) {
        return 15
    } else if (tong > 500000) {
        return 10
    }
    return 0
}

// Kiểm tra có phải thứ 4 không (Wednesday, getDay() = 3)
function laThuTu() {
    const today = new Date()
    return today.getDay() === 3
}

// === TÍNH TOÁN ===
const tongTien = tinhTong(danhSachMon)
let phanTramGiam = tinhPhanTramGiam(tongTien)

// Thứ 4 giảm thêm 5%
if (laThuTu()) {
    phanTramGiam += 5
}

const tienGiam = tongTien * phanTramGiam / 100
const sauGiam = tongTien - tienGiam
const vat = sauGiam * 8 / 100
const tip = coTip ? sauGiam * 5 / 100 : 0
const thanhToan = sauGiam + vat + tip

// === IN HÓA ĐƠN ===
console.log("╔══════════════════════════════════════╗")
console.log("║        HÓA ĐƠN NHÀ HÀNG            ║")
console.log("╠══════════════════════════════════════╣")

for (let i = 0; i < danhSachMon.length; i++) {
    const mon = danhSachMon[i]
    const thanhTienMon = mon.gia * mon.soLuong
    const stt = i + 1
    const dong = `║ ${stt}. ${mon.ten.padEnd(12)} x${mon.soLuong}    @${formatGiaK(mon.gia).padEnd(5)} = ${formatGiaK(thanhTienMon).padEnd(6)}║`
    console.log(dong)
}

console.log("╠══════════════════════════════════════╣")
console.log(`║ Tổng cộng:           ${formatTien(tongTien).padStart(12)}  ║`)
console.log(`║ Giảm giá (${phanTramGiam}%):        ${formatTien(tienGiam).padStart(12)}  ║`)
console.log(`║ VAT (8%):            ${formatTien(vat).padStart(12)}  ║`)

if (coTip) {
    console.log(`║ Tip (5%):            ${formatTien(tip).padStart(12)}  ║`)
}

console.log("╠══════════════════════════════════════╣")
console.log(`║ THANH TOÁN:          ${formatTien(thanhToan).padStart(12)}  ║`)
console.log("╚══════════════════════════════════════╝")

if (laThuTu()) {
    console.log("\n🎉 Hôm nay thứ 4 — được giảm thêm 5%!")
}
