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
