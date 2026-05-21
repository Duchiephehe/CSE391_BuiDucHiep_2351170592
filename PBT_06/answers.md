# PHẦN A 

## Câu A1

### Vẽ layout cho 3 kích thước

HTML đã cho:
```html
<div class="container">
    <div class="row">
        <div class="col-12 col-md-6 col-lg-3">Box 1</div>
        <div class="col-12 col-md-6 col-lg-3">Box 2</div>
        <div class="col-12 col-md-6 col-lg-3">Box 3</div>
        <div class="col-12 col-md-6 col-lg-3">Box 4</div>
    </div>
</div>
```

| Kích thước | < 768px | 768px - 991px | ≥ 992px |
|-----------|---------|---------------|---------|
| **Số cột** | 12 | 12 | 12 |
| **Số box trên 1 hàng** | 1 | 2 | 4 |
| **Width mỗi box** | 100% (col-12) | 50% (col-md-6) | 25% (col-lg-3) |
| **Số hàng** | 4 hàng | 2 hàng | 1 hàng |

### Biểu diễn layout:

#### < 768px (Mobile - 4 hàng, 1 cột):
```
┌─────────────────┐
│     Box 1       │ (100% width)
├─────────────────┤
│     Box 2       │ (100% width)
├─────────────────┤
│     Box 3       │ (100% width)
├─────────────────┤
│     Box 4       │ (100% width)
└─────────────────┘
```

#### 768px - 991px (Tablet - 2 hàng, 2 cột):
```
┌──────────┬──────────┐
│  Box 1   │  Box 2   │ (50% width mỗi)
├──────────┼──────────┤
│  Box 3   │  Box 4   │ (50% width mỗi)
└──────────┴──────────┘
```

#### ≥ 992px (Desktop - 1 hàng, 4 cột):
```
┌──────┬──────┬──────┬──────┐
│Box 1 │Box 2 │Box 3 │Box 4 │ (25% width mỗi)
└──────┴──────┴──────┴──────┘
```

### Giải thích các class:

- **col-12**: Trên tất cả các kích thước, chiếm 12/12 cột (full width). Được áp dụng từ breakpoint xs (< 576px) trở lên.
- **col-md-6**: Từ breakpoint md (768px) trở lên, chiếm 6/12 cột (50% width). Trước 768px, sẽ inherit từ col-12.
- **col-lg-3**: Từ breakpoint lg (992px) trở lên, chiếm 3/12 cột (25% width).

### Câu hỏi thêm:

**1. col-md-6 nghĩa là gì?**
- `col-md-6` = "column medium 6"
- Nghĩa là: Từ breakpoint **md (768px)** trở lên, phần tử này chiếm **6 cột** trong grid 12 cột (= 50% width)
- Trước 768px, không có quy định từ col-md, nên nó sẽ apply class không có tiền tố (col-12) hoặc từ breakpoint nhỏ hơn

**2. Tại sao không cần viết col-sm-12?**
- Vì **col-12 được áp dụng từ xs (< 576px) trở lên** và **sẽ tiếp tục áp dụng ở các kích thước lớn hơn** nếu không bị ghi đè bởi các lớp CSS khác (col-sm-*, col-md-*, v.v.)
- Nếu chúng ta không viết col-md-*, col-sm-* nào khác, thì col-12 sẽ tiếp tục áp dụng ở các breakpoint tiếp theo
- Bootstrap grid system sử dụng **mobile-first approach**: bắt đầu từ mobile (smallest), sau đó override khi breakpoint lớn hơn
- Do đó, col-sm-12 là dư thừa  vì col-12 đã cover được từ xs

---

## Câu A2

### 1. Giải thích class `d-none d-md-block`

| Class | Thuộc tính CSS | Kích thước áp dụng |
|-------|----------------|-------------------|
| `d-none` | `display: none` | Tất cả kích thước (default) |
| `d-md-block` | `display: block` | Từ md (768px) trở lên |

**Khi nào hiển thị, khi nào ẩn:**
- **Ẩn (display: none)** khi **< 768px** (mobile, tablet nhỏ)
- **Hiển thị (display: block)** khi **≥ 768px** (tablet, desktop)

**Ứng dụng thực tế:** Ẩn các phần tử phức tạp trên mobile để tiết kiệm không gian, nhưng hiển thị trên tablet/desktop.

---

### 2. 5 Spacing Utilities (margin/padding) và giải thích

Bootstrap sử dụng thang điểm spacing: 0.25rem (4px), 0.5rem (8px), 0.75rem (12px), 1rem (16px), 1.5rem (24px), 3rem (48px), v.v.

| Utility | Giải thích | Ví dụ CSS |
|---------|-----------|----------|
| **mt-3** | **margin-top** với giá trị 3 (= 1rem = 16px) | `margin-top: 1rem` |
| **px-4** | **padding left & right** với giá trị 4 (= 1.5rem = 24px) | `padding-left: 1.5rem; padding-right: 1.5rem` |
| **mb-auto** | **margin-bottom** tự động (= auto), giúp push phần tử lên trên | `margin-bottom: auto` |
| **ms-2** | **margin-start (left trong LTR)** với giá trị 2 (= 0.5rem = 8px) | `margin-left: 0.5rem` (trong LTR) |
| **p-5** | **padding tất cả 4 phía** với giá trị 5 (= 3rem = 48px) | `padding: 3rem` |

**Giải thích ký hiệu:**
- **m** = margin, **p** = padding
- **t** = top, **b** = bottom, **s** = start (left), **e** = end (right), **x** = left + right, **y** = top + bottom
- **Số** = lộ độ (0, 1, 2, 3, 4, 5, auto) → mapping thành giá trị rem

**Ví dụ thêm:**
- `mt-5 mb-3 px-4` = margin-top 3rem, margin-bottom 1rem, padding-left/right 1.5rem
- `m-auto` = margin tất cả 4 phía = auto → center phần tử
- `ms-auto me-auto` = margin-left/right = auto → center theo chiều ngang

---

### 3. Sự khác nhau giữa `.container`, `.container-fluid`, `.container-md`

| Container | Max-width | Responsive | Sử dụng khi |
|-----------|-----------|-----------|-----------|
| **.container** | **Có** (sm, md, lg, xl, xxl) | **Responsive** | Muốn fixed-width ở mỗi breakpoint, margin-left/right tự động (center). Standard layout. |
| **.container-fluid** | **Không** (luôn 100%) | **Luôn full-width** | Muốn phần tử chiếm toàn bộ viewport width, không có margin. Hero section, banner. |
| **.container-md** | **Fluid đến md, sau đó fixed** | **Responsive** | Muốn full-width cho mobile (< 768px), nhưng fixed-width từ tablet (≥ 768px) trở lên. Hybrid approach. |

**Bảng chi tiết:**

```
Breakpoint < 576px    576px      768px      992px      1200px     1400px
─────────────────────────────────────────────────────────────────────
.container:      100%         540px      720px      960px      1140px   1320px
.container-fluid: 100%        100%       100%       100%       100%     100%
.container-md:    100%        100%       720px      960px      1140px   1320px
```

**Ví dụ sử dụng:**
```html
<!-- Fixed-width layout (center) -->
<div class="container">
    <div class="row">
        <div class="col-12">Content</div>
    </div>
</div>

<!-- Full-width layout -->
<div class="container-fluid" style="background: #f0f0f0">
    <div class="row">
        <div class="col-12">Full-width content</div>
    </div>
</div>

<!-- Hybrid: full-width on mobile, fixed from tablet -->
<div class="container-md">
    <div class="row">
        <div class="col-12">Content</div>
    </div>
</div>
```

**Khi nào dùng cái nào?**
- **.container** → Trang blog, trang tin, admin dashboard (layout chuẩn)
- **.container-fluid** → Hero section, banner lớn, gallery toàn màn hình
- **.container-md** → Landing page (mobile full-width, tablet fixed-width)

---

## Tóm tắt

**Grid System:**
- Bootstrap dùng grid 12 cột, breakpoint: xs, sm, md, lg, xl, xxl
- Mobile-first: bắt đầu từ xs, override ở breakpoint lớn hơn
- col-12 col-md-6 col-lg-3 → 1 box/hàng (mobile) → 2 boxes/hàng (tablet) → 4 boxes/hàng (desktop)

**Utilities:**
- d-none d-md-block → ẩn trên mobile, hiển thị từ tablet trở lên
- Spacing: mt-3, px-4, mb-auto → margin/padding tại các phía và giá trị cụ thể

**Container:**
- .container → fixed-width responsive, center
- .container-fluid → luôn full-width
- .container-md → hybrid (full-width mobile, fixed từ tablet)

---

# PHẦN C

## Câu C1 
### 1. Quy trình đổi màu `$primary` từ xanh mặc định sang `#E63946`

**Công cụ cần có:**
- **Node.js** và **npm** (để chạy Sass compiler)
- **Sass** (dart-sass): `npm install -g sass` hoặc cài qua dự án

**Các bước thực hiện:**

**Bước 1:** Cài đặt Bootstrap source (SCSS) qua npm:
```bash
npm install bootstrap
```

**Bước 2:** Tạo file SCSS tùy biến, ví dụ `custom.scss`:
```scss
// 1. Override biến TRƯỚC khi import Bootstrap
$primary: #E63946;

// 2. Import toàn bộ Bootstrap
@import "../node_modules/bootstrap/scss/bootstrap";
```

**Bước 3:** Compile file SCSS thành CSS:
```bash
sass custom.scss custom.css
```

**Bước 4:** Dùng `custom.css` thay vì CDN Bootstrap trong HTML:
```html
<link rel="stylesheet" href="custom.css">
```

**Lý do phải khai báo biến TRƯỚC `@import`:**
- Bootstrap SCSS sử dụng cơ chế `!default` — biến chỉ nhận giá trị mặc định **nếu chưa được khai báo trước đó**.
- Khi ta đặt `$primary: #E63946` trước dòng `@import`, Bootstrap sẽ thấy biến đã có giá trị và bỏ qua giá trị mặc định của nó.

---

### 2. Tại sao KHÔNG nên override trực tiếp `.btn-primary { background: red; }`?

**Cách override trực tiếp (KHÔNG nên):**
```css
.btn-primary {
    background: red;
}
```

**Vấn đề của cách này:**

| Vấn đề | Giải thích |
|--------|-----------|
| **Không nhất quán** | Chỉ đổi được `.btn-primary`, nhưng các thành phần khác dùng `$primary` (link, badge, alert, border...) vẫn giữ màu xanh cũ |
| **Cascade conflict** | Phải thêm `!important` hoặc tăng specificity nếu Bootstrap override lại, dễ gây xung đột CSS |
| **Không maintainable** | Khi Bootstrap cập nhật phiên bản mới, phải tìm lại và sửa tất cả chỗ đã override thủ công |
| **Thiếu đồng bộ** | Các trạng thái như `:hover`, `:active`, `:focus` của button được tính toán từ `$primary` (làm tối/sáng hơn) — override thủ công phá vỡ logic này |
| **Không tận dụng SASS** | Bỏ qua toàn bộ hệ thống biến và hàm màu sắc mạnh mẽ mà Bootstrap cung cấp |

**Dùng SASS variables (NÊN làm):**
```scss
$primary: #E63946;
@import "bootstrap/scss/bootstrap";
```
→ Chỉ 1 dòng thay đổi, toàn bộ hệ sinh thái Bootstrap (buttons, links, alerts, borders, focus rings...) tự động dùng màu mới.

---

## Câu C2

### Viết CSS thuần: Navbar responsive + Product Card

**CSS thuần — Navbar responsive:**
```css
/* === NAVBAR === */
nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background-color: #1a1a2e;
    position: sticky;
    top: 0;
    z-index: 100;
}
.nav-brand { color: #fff; font-size: 1.25rem; font-weight: 700; text-decoration: none; }
.nav-menu { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
.nav-menu a { color: #ccc; text-decoration: none; transition: color 0.2s; }
.nav-menu a:hover { color: #fff; }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
.hamburger span { display: block; width: 25px; height: 2px; background: #fff; }

@media (max-width: 768px) {
    .hamburger { display: flex; }
    .nav-menu {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 56px; left: 0; right: 0;
        background: #1a1a2e;
        padding: 1rem 1.5rem;
        gap: 1rem;
    }
    .nav-menu.open { display: flex; }
}

/* === PRODUCT CARD === */
.card-container { display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 2rem; }
.product-card {
    flex: 1 1 calc(25% - 1.5rem);
    min-width: 200px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
.product-card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1rem; }
.card-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.card-price { color: #E63946; font-weight: 700; margin-bottom: 1rem; }
.btn-buy {
    display: block; width: 100%; padding: 0.5rem;
    background: #E63946; color: #fff; border: none;
    border-radius: 4px; cursor: pointer; text-align: center;
}
.btn-buy:hover { background: #c1121f; }

@media (max-width: 768px) {
    .product-card { flex: 1 1 100%; }
}
```
**Tổng CSS thuần: ~55 dòng**

---

**Bootstrap version — Navbar responsive + Product Card:**
```html
<!-- NAVBAR -->
<nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">MyShop</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Trang chủ</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Sản phẩm</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Liên hệ</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- PRODUCT CARD -->
<div class="container my-4">
  <div class="row g-3">
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img src="product.jpg" class="card-img-top" alt="Sản phẩm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">Tên sản phẩm</h5>
          <p class="text-danger fw-bold">250.000đ</p>
          <button class="btn btn-danger mt-auto w-100">Mua ngay</button>
        </div>
      </div>
    </div>
  </div>
</div>
```
**CSS Bootstrap cần viết thêm: ~0 dòng** (toàn bộ dùng utility classes)

---

### Bảng so sánh

| Tiêu chí | CSS thuần | Bootstrap 5 |
|---------|-----------|-------------|
| **Số dòng CSS** | ~55 dòng | ~0 dòng (dùng utility class) |
| **Thời gian phát triển** | Chậm hơn (~2-3 giờ) | Nhanh hơn (~30 phút) |
| **Khả năng tùy biến** | Cao — kiểm soát hoàn toàn | Trung bình — cần SASS để customize sâu |
| **File size** | Nhỏ (chỉ CSS cần dùng) | Lớn hơn (~200KB nếu dùng CDN đầy đủ) |
| **Nhất quán UI** | Phụ thuộc dev | Đảm bảo nhất quán hệ thống |
| **Responsive** | Phải tự viết media query | Tích hợp sẵn, chỉ thêm class |
| **Học / Onboard** | Cần biết CSS chuyên sâu | Dễ học, docs phong phú |
| **Browser compat** | Tự xử lý prefix | Bootstrap đã xử lý sẵn |

---

### Khi nào NÊN dùng Bootstrap?

- **Dự án cần phát triển nhanh**: MVP, prototype, hackathon
- **Team có nhiều trình độ khác nhau**: Bootstrap chuẩn hóa cách viết
- **Trang admin/dashboard nội bộ**: không cần design riêng
- **Landing page đơn giản, không cần brand đặc trưng**
- **Người mới học frontend**: Bootstrap giúp hiểu responsive nhanh

### Khi nào KHÔNG NÊN dùng Bootstrap?

- **Brand design đặc thù**: khi khách hàng yêu cầu UI hoàn toàn riêng biệt
- **Tối ưu performance**: trang cần load cực nhanh, bundle size nhỏ
- **Dự án dùng framework CSS khác**: Tailwind, Chakra UI, Material UI...
- **Khi chỉ cần 1-2 component**: load cả thư viện là lãng phí
- **Dự án cần SEO cao**: file CSS lớn ảnh hưởng Core Web Vitals

---

## Tóm tắt Phần C

**Tùy biến Bootstrap:**
- Dùng SASS variables (`$primary: #E63946`) TRƯỚC `@import bootstrap` để override màu sắc toàn hệ thống
- Không override CSS trực tiếp vì thiếu nhất quán, khó maintain, và phá vỡ hệ thống màu tự động

**CSS thuần vs Bootstrap:**
- Bootstrap tiết kiệm ~55 dòng CSS cho navbar + card, phát triển nhanh gấp 3-6 lần
- CSS thuần cho phép kiểm soát tuyệt đối, phù hợp design đặc thù và tối ưu performance
- Lựa chọn phụ thuộc vào: deadline, yêu cầu design, team size, và performance target
