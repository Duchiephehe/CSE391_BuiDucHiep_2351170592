// Khởi tạo các DOM Elements
const form = document.getElementById('registerForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');

const successModal = document.getElementById('successModal');
const modalInfo = document.getElementById('modalInfo');
const closeModalBtn = document.getElementById('closeModalBtn');

// State object lưu trạng thái hợp lệ của từng input
const isValid = {
    username: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
};

// Hàm Helper: Cập nhật giao diện (Màu viền, Icon ✅/❌ và Text báo lỗi)
function updateUI(field, isFieldValid, errorMsg = '') {
    const icon = document.getElementById(`${field.id}Icon`);
    const errorEl = document.getElementById(`${field.id}Error`);

    if (isFieldValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        icon.textContent = '✅';
        if (errorEl) errorEl.textContent = '';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        icon.textContent = '❌';
        if (errorEl) errorEl.textContent = errorMsg;
    }

    // Lưu trạng thái và kiểm tra tổng thể
    isValid[field.id] = isFieldValid;
    checkFormValidity();
}

// Kiểm tra toàn bộ form, nếu tất cả "true" thì bật (enable) nút Submit
function checkFormValidity() {
    const allValid = Object.values(isValid).every(val => val === true);
    submitBtn.disabled = !allValid;
}

// ----------------------------------------
// 1. Validate Tên (Realtime, 2-50 ký tự)
// ----------------------------------------
username.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length >= 2 && val.length <= 50) {
        updateUI(username, true);
    } else {
        updateUI(username, false, 'Tên phải dài từ 2 đến 50 ký tự');
    }
});

// ----------------------------------------
// 2. Validate Email (Realtime)
// ----------------------------------------
email.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    // Biểu thức Regex cơ bản cho Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(val)) {
        updateUI(email, true);
    } else {
        updateUI(email, false, 'Email không hợp lệ (Ví dụ: abc@domain.com)');
    }
});

// ----------------------------------------
// 3. Validate & Format Số điện thoại (0901-234-567)
// ----------------------------------------
phone.addEventListener('input', (e) => {
    // Chỉ giữ lại các chữ số (loại bỏ toàn bộ ký tự chữ cái/đặc biệt)
    let val = e.target.value.replace(/\D/g, '');
    
    // Thuật toán tự động chèn dấu gạch nối "-"
    let formatted = val;
    if (val.length > 4) {
        formatted = val.substring(0, 4) + '-' + val.substring(4);
    }
    if (val.length > 7) {
        // Cắt khúc đầu và giữa rồi ghép thêm phần đuôi
        formatted = val.substring(0, 4) + '-' + val.substring(4, 7) + '-' + val.substring(7, 10);
    }
    
    // Cập nhật ngay lập tức text vào ô input
    e.target.value = formatted;

    // Validate hợp lệ khi có đủ 10 chữ số
    if (val.length === 10) {
        updateUI(phone, true);
    } else {
        updateUI(phone, false, 'Số điện thoại phải đủ 10 chữ số');
    }
});

// ----------------------------------------
// 4. Validate Mật khẩu (Đo sức mạnh)
// ----------------------------------------
password.addEventListener('input', (e) => {
    const val = e.target.value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0; // 0: rỗng, 1: yếu, 2: TB, 3: mạnh

    // Check sự tồn tại của các loại ký tự bằng Regex
    const hasNumbers = /[0-9]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const hasLetters = hasLower || hasUpper;

    // Xử lý phân cấp sức mạnh mật khẩu
    if (val.length >= 8) {
        if (hasLower && hasUpper && hasNumbers && hasSpecial) {
            strength = 3; // Mạnh: 8+ chars, hoa, thường, số, đặc biệt
        } else if (hasLetters && hasNumbers) {
            strength = 2; // Trung bình: 8+ chars, có chữ và số
        } else {
            strength = 1; // Yếu: >=8 chars nhưng chỉ thuần chữ hoặc thuần số
        }
    } else if (val.length > 0) {
        strength = 1; // Yếu: < 8 ký tự
    }

    // Render Progress Bar tương ứng
    if (strength === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        updateUI(password, false, 'Mật khẩu không được để trống');
    } else if (strength === 1) {
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = '#e74c3c'; // Đỏ
        strengthText.textContent = 'Yếu';
        strengthText.style.color = '#e74c3c';
        updateUI(password, false, 'Mật khẩu yếu: Phải ≥ 8 ký tự, gồm cả chữ và số');
    } else if (strength === 2) {
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = '#f1c40f'; // Vàng
        strengthText.textContent = 'Trung bình';
        strengthText.style.color = '#f1c40f';
        updateUI(password, true); // Hợp lệ ở mức TB
    } else if (strength === 3) {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#2ecc71'; // Xanh lá
        strengthText.textContent = 'Mạnh';
        strengthText.style.color = '#2ecc71';
        updateUI(password, true); // Hợp lệ ở mức Mạnh
    }

    // Tự động kiểm tra lại Confirm Password nếu người dùng thay đổi Password chính
    if (confirmPassword.value.length > 0) {
        confirmPassword.dispatchEvent(new Event('input'));
    }
});

// ----------------------------------------
// 5. Xác nhận lại Mật khẩu (Khớp)
// ----------------------------------------
confirmPassword.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val === '') {
        updateUI(confirmPassword, false, 'Vui lòng nhập lại mật khẩu');
    } else if (val !== password.value) {
        updateUI(confirmPassword, false, 'Mật khẩu không khớp');
    } else {
        updateUI(confirmPassword, true);
    }
});

// ----------------------------------------
// 6. Xử lý Nút Submit và Modal
// ----------------------------------------
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang

    // Đổ dữ liệu vào DOM của Modal
    modalInfo.innerHTML = `
        <p><strong>Họ và tên:</strong> ${username.value}</p>
        <p><strong>Email:</strong> ${email.value}</p>
        <p><strong>Số điện thoại:</strong> ${phone.value}</p>
    `;

    // Hiển thị Modal bằng CSS Class
    successModal.classList.add('show');
});

// Bấm nút Đóng Modal
closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
    
    // Reset toàn bộ Form bằng hàm có sẵn của thẻ form
    form.reset();
    
    // Xóa sạch các trạng thái lỗi/hợp lệ trên UI
    const inputs = [username, email, phone, password, confirmPassword];
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        document.getElementById(`${input.id}Icon`).textContent = '';
        const errorEl = document.getElementById(`${input.id}Error`);
        if (errorEl) errorEl.textContent = '';
        isValid[input.id] = false; // Reset lại State logic
    });
    
    // Reset thanh sức mạnh mật khẩu
    document.getElementById('strengthBar').style.width = '0%';
    document.getElementById('strengthText').textContent = '';
    
    // Khóa lại nút Submit
    checkFormValidity();
});
