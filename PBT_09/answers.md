
## PHẦN A

### Câu A1

**1. DOM Tree (sơ đồ cây):**

```
document
 └── html
      └── body
           └── div#app
                ├── header
                │    ├── h1 ("Todo App")
                │    └── nav
                │         ├── a.active ("All")
                │         ├── a ("Active")
                │         └── a ("Completed")
                └── main
                     ├── form#todoForm
                     │    ├── input#todoInput
                     │    └── button ("Add")
                     └── ul#todoList
                          ├── li.todo-item ("Learn HTML")
                          └── li.todo-item.completed ("Learn CSS")
```

**2. querySelector cho từng yêu cầu:**

```javascript
// Chọn thẻ <h1>
document.querySelector("h1");

// Chọn input trong form
document.querySelector("#todoForm input");

// Chọn tất cả .todo-item
document.querySelectorAll(".todo-item");

// Chọn link đang active
document.querySelector("a.active");

// Chọn <li> đầu tiên trong #todoList
document.querySelector("#todoList li:first-child");

// Chọn tất cả <a> bên trong <nav>
document.querySelectorAll("nav a");
```

---

### Câu A2

**Sự khác nhau giữa innerHTML và textContent:**

| Tiêu chí | `innerHTML` | `textContent` |
|----------|-------------|---------------|
| Trả về gì | Chuỗi HTML (bao gồm cả thẻ HTML bên trong) | Chỉ trả về nội dung text thuần, bỏ hết thẻ HTML |
| Khi gán giá trị | Trình duyệt parse chuỗi thành HTML thật, render thẻ | Trình duyệt coi toàn bộ chuỗi là text thuần, không parse |
| Hiệu năng | Chậm hơn (phải parse HTML) | Nhanh hơn |
| Bảo mật | Có nguy cơ XSS | An toàn |

**Khi nào dùng:**
- `innerHTML`: Khi cần chèn cấu trúc HTML động (ví dụ: render danh sách `<li>`, tạo card sản phẩm từ dữ liệu). Chỉ dùng khi dữ liệu do chính mình kiểm soát.
- `textContent`: Khi chỉ cần hiển thị nội dung text thuần (ví dụ: cập nhật tên user, hiển thị số liệu). Luôn ưu tiên dùng khi hiển thị dữ liệu từ người dùng nhập vào.

**Câu hỏi bảo mật — Lỗ hổng XSS qua innerHTML:**

Khi gán `innerHTML` bằng dữ liệu từ user, trình duyệt sẽ parse chuỗi đó thành HTML thật. Nếu user cố tình nhập mã độc, trình duyệt sẽ thực thi nó.

```javascript
// User nhập vào ô search: <img src=x onerror="alert('Hacked!')">
const userInput = document.querySelector("#search").value;

// NGUY HIỂM: Trình duyệt parse thành thẻ <img>, gặp lỗi src=x 
// → chạy onerror → alert('Hacked!') → attacker có thể đánh cắp cookie, chuyển hướng trang...
document.querySelector("#result").innerHTML = userInput;

// CÁCH SỬA: Dùng textContent thay vì innerHTML
document.querySelector("#result").textContent = userInput;
// Lúc này trình duyệt hiển thị nguyên chuỗi "<img src=x onerror=...>" dưới dạng text
// không parse thành thẻ HTML, hoàn toàn an toàn
```

---

### Câu A3

**Khi click vào button (chưa uncomment stopPropagation):**

```
BUTTON
INNER
OUTER
```

Giải thích: Theo cơ chế **Event Bubbling** (sủi bọt), khi click vào `#btn`, sự kiện click sẽ lan truyền từ phần tử con ra phần tử cha theo thứ tự:
1. `#btn` (button) → in "BUTTON"
2. `#inner` (div cha trực tiếp) → in "INNER"
3. `#outer` (div ông) → in "OUTER"

Sự kiện giống như bong bóng nổi lên từ đáy nước lên mặt nước, đi từ phần tử sâu nhất ra ngoài.

**Nếu uncomment `e.stopPropagation()`:**

```
BUTTON
```

Giải thích: `stopPropagation()` ngăn sự kiện tiếp tục lan truyền lên các phần tử cha. Sự kiện dừng lại ngay tại `#btn`, không chạy tiếp lên `#inner` và `#outer` nữa. Chỉ có "BUTTON" được in ra.
