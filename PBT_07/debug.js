// debug.js — Code đã sửa tất cả lỗi

function tinhGiaGiamGia(giaBan, phanTramGiam) {
    // Sửa lỗi 4: validate giaBan
    if (typeof giaBan !== 'number' || giaBan < 0) {
        return "Giá bán không hợp lệ"
    }

    if (phanTramGiam < 0 || phanTramGiam > 100) {
        // Sửa lỗi 5: return -1 thay vì string
        return -1
    }

    // Sửa lỗi 3: dùng const thay var
    const giamGia = giaBan * phanTramGiam / 100
    let giaSauGiam = giaBan - giamGia

    // Sửa lỗi 2: dùng === thay vì =
    if (giaSauGiam === 0) {
        console.log("Sản phẩm miễn phí!")
    }

    return giaSauGiam
}

// Sửa lỗi 1: truyền number thay vì string
const gia = tinhGiaGiamGia(100000, 20)
console.log("Giá sau giảm: " + gia + "đ")

const gia2 = tinhGiaGiamGia(50000, 110)
console.log("Giá: " + gia2) // -1 (không hợp lệ)

// Sửa lỗi 6: dùng let thay var trong vòng lặp
for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i)
    }, 1000)
}
