// --- Dữ liệu Gallery (9 ảnh) ---
const images = [
    { src: 'https://placehold.co/800x400/1abc9c/ffffff?text=Image+1', alt: 'Phong cảnh 1' },
    { src: 'https://placehold.co/800x400/2ecc71/ffffff?text=Image+2', alt: 'Phong cảnh 2' },
    { src: 'https://placehold.co/800x400/3498db/ffffff?text=Image+3', alt: 'Phong cảnh 3' },
    { src: 'https://placehold.co/800x400/9b59b6/ffffff?text=Image+4', alt: 'Phong cảnh 4' },
    { src: 'https://placehold.co/800x400/34495e/ffffff?text=Image+5', alt: 'Phong cảnh 5' },
    { src: 'https://placehold.co/800x400/f1c40f/ffffff?text=Image+6', alt: 'Phong cảnh 6' },
    { src: 'https://placehold.co/800x400/e67e22/ffffff?text=Image+7', alt: 'Phong cảnh 7' },
    { src: 'https://placehold.co/800x400/e74c3c/ffffff?text=Image+8', alt: 'Phong cảnh 8' },
    { src: 'https://placehold.co/800x400/95a5a6/ffffff?text=Image+9', alt: 'Phong cảnh 9' }
];

let currentIndex = 0;
let isPlaying = false;
let slideInterval = null;

// DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnailsGrid = document.getElementById('thumbnailsGrid');
const playBtn = document.getElementById('playBtn');
const paletteOverlay = document.getElementById('paletteOverlay');
const paletteInput = document.getElementById('paletteInput');
const paletteList = document.getElementById('paletteList');

// --- 1. Khởi tạo Gallery & Điều hướng ---

function initGallery() {
    images.forEach((img, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumbnail-wrapper';
        
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.className = 'thumbnail';
        thumb.dataset.index = index;
        
        // A11y: Thêm tabindex để focus được bằng phím Tab
        thumb.tabIndex = 0; 
        thumb.setAttribute('aria-label', `Xem ảnh số ${index + 1}`);
        
        // Sự kiện Click chuột
        thumb.addEventListener('click', () => goToImage(index));
        
        // Sự kiện Enter khi đang focus bằng phím Tab
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') goToImage(index);
        });

        const number = document.createElement('div');
        number.className = 'thumbnail-number';
        number.textContent = index + 1;

        wrapper.appendChild(thumb);
        wrapper.appendChild(number);
        thumbnailsGrid.appendChild(wrapper);
    });
    
    goToImage(0);
}

function goToImage(index) {
    // Xử lý vòng lặp nếu quá giới hạn
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    
    currentIndex = index;
    mainImage.src = images[currentIndex].src;
    mainImage.alt = images[currentIndex].alt;
    
    // Cập nhật viền cho thumbnail đang active
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        if (i === currentIndex) {
            thumb.classList.add('active');
            thumb.setAttribute('aria-current', 'true');
        } else {
            thumb.classList.remove('active');
            thumb.removeAttribute('aria-current');
        }
    });
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playBtn.textContent = '⏸ Pause';
        playBtn.setAttribute('aria-label', 'Tạm dừng Slideshow');
        slideInterval = setInterval(() => goToImage(currentIndex + 1), 2000);
        showToast('Đã bật Slideshow (2s/ảnh)');
    } else {
        playBtn.textContent = '▶ Play';
        playBtn.setAttribute('aria-label', 'Phát Slideshow');
        clearInterval(slideInterval);
        showToast('Đã tạm dừng Slideshow');
    }
}

// Lắng nghe nút bấm trên màn hình
document.getElementById('prevBtn').addEventListener('click', () => goToImage(currentIndex - 1));
document.getElementById('nextBtn').addEventListener('click', () => goToImage(currentIndex + 1));
playBtn.addEventListener('click', togglePlay);


// --- 2. Xử lý Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    // Nếu đang mở Command Palette thì vô hiệu hóa phím tắt của Gallery
    if (paletteOverlay.classList.contains('show')) return;
    
    // Tránh ăn phím nếu người dùng đang gõ text vào input/textarea nào đó
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
        case 'ArrowLeft':
            goToImage(currentIndex - 1);
            break;
        case 'ArrowRight':
            goToImage(currentIndex + 1);
            break;
        case ' ': // Phím Space
            e.preventDefault(); // Tránh bị cuộn trang xuống
            togglePlay();
            break;
        default:
            // Phím số 1 đến 9
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < images.length) {
                    goToImage(index);
                }
            }
            break;
    }
});


// --- 3. Command Palette (Giống VS Code) ---
const commands = [
    { id: 'toggle-theme', name: 'Đổi giao diện (Dark/Light)', action: () => document.body.classList.toggle('dark-theme') },
    { id: 'play-slideshow', name: 'Bật/Tắt Slideshow', action: togglePlay },
    { id: 'next-img', name: 'Chuyển sang ảnh tiếp theo', action: () => goToImage(currentIndex + 1) },
    { id: 'prev-img', name: 'Quay lại ảnh trước đó', action: () => goToImage(currentIndex - 1) },
    { id: 'jump-first', name: 'Nhảy về ảnh đầu tiên', action: () => goToImage(0) },
    { id: 'jump-last', name: 'Nhảy đến ảnh cuối cùng', action: () => goToImage(images.length - 1) },
    { id: 'show-hello', name: 'Hiển thị lời chào', action: () => showToast('Xin chào, chúc bạn code vui vẻ!') }
];

let selectedCommandIndex = 0;
let filteredCommands = [];

function openPalette() {
    paletteOverlay.classList.add('show');
    paletteInput.value = '';
    renderCommands('');
    paletteInput.focus();
}

function closePalette() {
    paletteOverlay.classList.remove('show');
    mainImage.focus(); // A11y: Trả lại focus cho ảnh chính sau khi đóng
}

function executeCommand(command) {
    closePalette();
    if (command && command.action) {
        command.action();
        showToast(`Đã thực thi: ${command.name}`);
    }
}

function renderCommands(keyword) {
    const lowerKeyword = keyword.toLowerCase().trim();
    filteredCommands = commands.filter(c => c.name.toLowerCase().includes(lowerKeyword));
    
    paletteList.innerHTML = '';
    selectedCommandIndex = 0;

    if (filteredCommands.length === 0) {
        const li = document.createElement('li');
        li.className = 'palette-item';
        li.textContent = 'Không tìm thấy lệnh nào...';
        paletteList.appendChild(li);
        return;
    }

    filteredCommands.forEach((cmd, index) => {
        const li = document.createElement('li');
        li.className = 'palette-item';
        if (index === selectedCommandIndex) li.classList.add('selected');
        li.textContent = cmd.name;
        
        // A11y
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', index === selectedCommandIndex);
        
        // Cập nhật thanh highlight khi rê chuột
        li.addEventListener('mouseenter', () => {
            selectedCommandIndex = index;
            updateCommandSelection();
        });

        // Chọn lệnh khi click
        li.addEventListener('click', () => executeCommand(cmd));

        paletteList.appendChild(li);
    });
}

// Cập nhật trạng thái item đang được focus trong danh sách
function updateCommandSelection() {
    const items = paletteList.querySelectorAll('.palette-item');
    items.forEach((item, index) => {
        if (index === selectedCommandIndex) {
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
            // Cuộn danh sách đi theo phần tử đang chọn
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        }
    });
}

// Lắng nghe tổ hợp phím Ctrl + K (hoặc Cmd + K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteOverlay.classList.contains('show')) {
            closePalette();
        } else {
            openPalette();
        }
    }
    
    // Nút Escape
    if (e.key === 'Escape' && paletteOverlay.classList.contains('show')) {
        closePalette();
    }
});

// Điều hướng lên/xuống/enter trong Command Palette
paletteInput.addEventListener('keydown', (e) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex + 1) % filteredCommands.length;
        updateCommandSelection();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Cộng thêm độ dài để tránh số âm
        selectedCommandIndex = (selectedCommandIndex - 1 + filteredCommands.length) % filteredCommands.length;
        updateCommandSelection();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(filteredCommands[selectedCommandIndex]);
    }
});

// Lọc lệnh realtime
paletteInput.addEventListener('input', (e) => {
    renderCommands(e.target.value);
});

// Click vùng ngoài để đóng Modal
paletteOverlay.addEventListener('click', (e) => {
    if (e.target === paletteOverlay) {
        closePalette();
    }
});


// --- 4. Toast Notification (Tiện ích thông báo) ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // Tự động tắt sau 2.5s
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Chạy ứng dụng
initGallery();
