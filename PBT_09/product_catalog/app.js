// Dữ liệu mẫu (ít nhất 12 sản phẩm, 4 danh mục)
const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 28990000, category: "phone", image: "https://placehold.co/200x200/e0e0e0/555?text=iPhone", rating: 4.8, inStock: true },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 31990000, category: "phone", image: "https://placehold.co/200x200/e0e0e0/555?text=Galaxy+S24", rating: 4.7, inStock: true },
    { id: 3, name: "Xiaomi 14 Pro", price: 19990000, category: "phone", image: "https://placehold.co/200x200/e0e0e0/555?text=Xiaomi+14", rating: 4.5, inStock: false },
    { id: 4, name: "MacBook Air M3", price: 27990000, category: "laptop", image: "https://placehold.co/200x200/e0e0e0/555?text=MacBook+Air", rating: 4.9, inStock: true },
    { id: 5, name: "Dell XPS 15", price: 35000000, category: "laptop", image: "https://placehold.co/200x200/e0e0e0/555?text=Dell+XPS", rating: 4.6, inStock: true },
    { id: 6, name: "ThinkPad X1 Carbon", price: 32000000, category: "laptop", image: "https://placehold.co/200x200/e0e0e0/555?text=ThinkPad", rating: 4.8, inStock: true },
    { id: 7, name: "iPad Pro M4", price: 28990000, category: "tablet", image: "https://placehold.co/200x200/e0e0e0/555?text=iPad+Pro", rating: 4.9, inStock: true },
    { id: 8, name: "Galaxy Tab S9", price: 19990000, category: "tablet", image: "https://placehold.co/200x200/e0e0e0/555?text=Tab+S9", rating: 4.6, inStock: true },
    { id: 9, name: "Xiaomi Pad 6", price: 8990000, category: "tablet", image: "https://placehold.co/200x200/e0e0e0/555?text=Xiaomi+Pad", rating: 4.4, inStock: true },
    { id: 10, name: "AirPods Pro 2", price: 5990000, category: "accessory", image: "https://placehold.co/200x200/e0e0e0/555?text=AirPods", rating: 4.8, inStock: true },
    { id: 11, name: "Apple Watch S9", price: 10990000, category: "accessory", image: "https://placehold.co/200x200/e0e0e0/555?text=Apple+Watch", rating: 4.7, inStock: true },
    { id: 12, name: "Chuột Logitech MX Master 3S", price: 2500000, category: "accessory", image: "https://placehold.co/200x200/e0e0e0/555?text=MX+Master", rating: 4.9, inStock: false }
];

// State quản lý ứng dụng
let currentProducts = [...products];
let cartCount = 0;

// Truy xuất DOM Elements
const catalogContainer = document.getElementById('catalogContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const sortSelect = document.getElementById('sortSelect');
const cartBadge = document.getElementById('cartBadge');
const darkModeToggle = document.getElementById('darkModeToggle');

// Helper: Định dạng tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// 1. Render Products
function renderProducts(productsToRender) {
    catalogContainer.innerHTML = ''; // Xóa rỗng nội dung cũ

    if (productsToRender.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Không tìm thấy sản phẩm nào phù hợp.';
        catalogContainer.appendChild(emptyMsg);
        return;
    }

    // Tạo các phần tử DOM hoàn toàn bằng JS (createElement)
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id; // Lưu id vào thẻ để sau này click dễ lấy

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.className = 'product-image';

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.name;

        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = formatCurrency(product.price);

        const rating = document.createElement('div');
        rating.className = 'product-rating';
        rating.textContent = `⭐ ${product.rating}`;

        const actionDiv = document.createElement('div');
        actionDiv.className = 'product-actions';
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary add-to-cart-btn';
        addBtn.textContent = product.inStock ? 'Thêm vào giỏ' : 'Hết hàng';
        addBtn.disabled = !product.inStock;
        
        if (!product.inStock) {
            addBtn.style.backgroundColor = '#ccc';
            addBtn.style.cursor = 'not-allowed';
        }

        actionDiv.appendChild(addBtn);

        // Nối các phần tử con vào card
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(rating);
        card.appendChild(actionDiv);

        // Nối card vào container chính
        catalogContainer.appendChild(card);
    });
}

// 2. Filter by category
function filterByCategory(category) {
    // Để giữ tính đúng đắn khi vừa search vừa filter, ta cần gọi searchProducts 
    // vì searchProducts sẽ gộp chung cả logic search và filter.
    // Lưu lại category đang active qua DOM class
    searchProducts(searchInput.value, true);
}

// 3. Search realtime
function searchProducts(keyword, doRender = true) {
    const lowerKeyword = keyword.toLowerCase().trim();
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    
    // Bước 1: Lọc theo category
    let filtered = products;
    if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    // Bước 2: Lọc theo keyword
    if (lowerKeyword) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(lowerKeyword));
    }
    
    currentProducts = filtered;
    
    // Bước 3: Giữ nguyên trạng thái sắp xếp hiện tại
    sortProducts(sortSelect.value, false); 
    
    if (doRender) renderProducts(currentProducts);
}

// 4. Sort
function sortProducts(sortType, doRender = true) {
    switch (sortType) {
        case 'price-asc':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating-desc':
            currentProducts.sort((a, b) => b.rating - a.rating);
            break;
        default: // Mặc định
            currentProducts.sort((a, b) => a.id - b.id);
            break;
    }
    if (doRender) renderProducts(currentProducts);
}

// 5. Create Modal (DOM Manipulation)
function createModal(product) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const content = document.createElement('div');
    content.className = 'modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'modal-body';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'modal-info';

    const title = document.createElement('h2');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.innerHTML = `<strong>Giá:</strong> <span style="color: var(--primary-color); font-size: 18px;">${formatCurrency(product.price)}</span>`;

    const rating = document.createElement('p');
    rating.innerHTML = `<strong>Đánh giá:</strong> ⭐ ${product.rating}/5`;

    const category = document.createElement('p');
    category.innerHTML = `<strong>Danh mục:</strong> ${product.category.toUpperCase()}`;

    const stock = document.createElement('p');
    stock.className = 'stock-status ' + (product.inStock ? 'in-stock' : 'out-of-stock');
    stock.textContent = product.inStock ? '✓ Còn hàng' : '✗ Hết hàng';

    // Ráp các thành phần
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(rating);
    infoDiv.appendChild(category);
    infoDiv.appendChild(stock);

    bodyDiv.appendChild(img);
    bodyDiv.appendChild(infoDiv);

    content.appendChild(closeBtn);
    content.appendChild(bodyDiv);
    overlay.appendChild(content);

    // Bấm ra ngoài vùng tối (overlay) thì đóng modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    document.body.appendChild(overlay);
}

// 6. Add to cart badge
function updateCartBadge() {
    cartCount++;
    cartBadge.textContent = cartCount;
    // Hiệu ứng pop nhỏ
    cartBadge.style.transition = 'transform 0.2s';
    cartBadge.style.transform = 'scale(1.5)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 200);
}

// 7. Dark Mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// ========================
// GẮN EVENT LISTENERS
// ========================

// Click lọc Category
categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        filterByCategory(e.target.dataset.category);
    }
});

// Gõ phím tìm kiếm (thực thi realtime)
searchInput.addEventListener('input', (e) => {
    searchProducts(e.target.value);
});

// Thay đổi tiêu chí sắp xếp
sortSelect.addEventListener('change', (e) => {
    sortProducts(e.target.value);
});

// Click đổi Dark Mode
darkModeToggle.addEventListener('click', toggleDarkMode);

// Bắt sự kiện Click trên vùng Grid (Event Delegation)
catalogContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return; // Nếu click ra ngoài thẻ (vùng trống) thì bỏ qua

    const productId = parseInt(card.dataset.id);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Nếu bấm đúng nút Thêm vào giỏ
    if (e.target.classList.contains('add-to-cart-btn')) {
        updateCartBadge();
    } 
    // Nếu bấm vào ảnh, tên, giá (vùng khác nút Thêm) -> Mở modal chi tiết
    else {
        createModal(product);
    }
});

// Lần đầu tải trang -> Render tất cả
renderProducts(currentProducts);
