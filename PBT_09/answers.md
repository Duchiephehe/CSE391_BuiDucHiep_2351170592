
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

---

## PHẦN C 

### Câu C1 

7 lỗi trong đoạn code được cung cấp:

1. **Sai tên sự kiện `click` ở nút Decrement**: 
   - Mã gốc: `addEventListener("onclick", function() {`
   - Lỗi: Trong `addEventListener` ta dùng tên sự kiện `"click"`, không dùng `"onclick"`.
   - Sửa thành: `addEventListener("click", function() {`

2. **Gán sai giá trị cho hằng số (DOM element) khi reset**:
   - Mã gốc: `countDisplay = count;`
   - Lỗi: `countDisplay` là biến `const` lưu đối tượng DOM, không thể gán lại bằng một số. Ngoài ra, để hiển thị ra màn hình ta cần gán nội dung text.
   - Sửa thành: `countDisplay.textContent = count;` (hoặc `innerHTML`).

3. **Thiếu dấu ngoặc đơn khi gọi hàm `remove` ở phần clearHistory**:
   - Mã gốc: `item.remove;`
   - Lỗi: `remove` là một hàm (phương thức của element), không phải thuộc tính, nên cần có cặp ngoặc đơn để gọi.
   - Sửa thành: `item.remove();`

4. **Chưa ép kiểu dữ liệu khi lấy từ localStorage**:
   - Mã gốc: `count = localStorage.getItem("count");`
   - Lỗi: `localStorage.getItem` luôn trả về một chuỗi (String). Khi gán vào biến `count` thì `count` trở thành chuỗi thay vì số nguyên, điều này sẽ gây ra lỗi nối chuỗi nếu sau đó thực hiện phép toán cộng (`+`).
   - Sửa thành: `count = parseInt(localStorage.getItem("count")) || 0;` (thêm `|| 0` để đề phòng trường hợp trả về `null` trong lần chạy đầu).

5. **Lỗi gán `historyList.innerHTML = null;` khi reset**:
   - Mã gốc: `historyList.innerHTML = null;`
   - Lỗi: Thuộc tính `innerHTML` mong đợi một chuỗi. Nếu truyền `null`, trình duyệt có thể tự động chuyển thành chuỗi `"null"`, làm giao diện hiển thị chữ "null" thay vì rỗng.
   - Sửa thành: `historyList.innerHTML = "";`

6. **Không khôi phục lịch sử (history) từ localStorage khi load trang**:
   - Mã gốc: Trong event `load`, chỉ lấy `count` mà quên lấy `history`.
   - Lỗi: Mặc dù đã lưu `history` ở event `beforeunload`, nhưng không hề load lại nó, làm mất lịch sử hiển thị trên giao diện sau khi tải lại trang (F5).
   - Cách khắc phục: Cần thêm `historyList.innerHTML = localStorage.getItem("history") || "";` vào trong `window.addEventListener("load", ...)`.

7. **Lỗi mất event listener của các thẻ `li` sau khi load từ localStorage bằng `innerHTML`**:
   - Lỗi logic: Khi lưu lịch sử vào `localStorage` và ghi đè vào DOM bằng `innerHTML`, các thẻ `<li>` mới sinh ra sẽ hoàn toàn mất đi sự kiện `click` (hàm `deleteHistory(this)`) đã gắn trước đó. `innerHTML` chỉ parse chuỗi thành cấu trúc HTML, không bảo tồn các event listener được gắn bằng JavaScript.
   - Sửa: Cách tốt nhất là áp dụng **Event Delegation**: thay vì gán sự kiện click lên từng thẻ `li`, ta bắt sự kiện click trên phần tử cha (`historyList`).

---

### Câu C2 

**1. Tại sao bind event lên 1000 elements riêng lẻ là BAD PRACTICE? Event Delegation giải quyết thế nào?**

- **BAD PRACTICE vì:**
  - **Tốn bộ nhớ (Memory):** Tạo 1000 hàm Event Listener riêng lẻ để lưu trữ vào bộ nhớ cho 1000 phần tử sẽ tiêu tốn tài nguyên trình duyệt.
  - **Giảm hiệu suất khởi tạo:** Trình duyệt phải mất nhiều thời gian để chạy lặp và thực hiện việc gắn sự kiện (`addEventListener`) cho hàng ngàn đối tượng.
  - **Rủi ro rò rỉ bộ nhớ (Memory Leak) và khó bảo trì:** Nếu giao diện thay đổi động (các element liên tục bị tạo mới rồi xóa đi), ta phải gắn lại sự kiện cho các element mới và cẩn thận gỡ (`removeEventListener`) ở các element cũ bị xóa. Điều này làm code phức tạp và rất dễ gây rò rỉ bộ nhớ.

- **Event Delegation giải quyết bằng cách:**
  - Dựa vào cơ chế **Event Bubbling** (sự kiện khi xảy ra trên thẻ con sẽ nổi bọt lên các thẻ cha bao bọc nó).
  - Thay vì gắn hàng ngàn sự kiện lên các phần tử con, ta chỉ gắn **duy nhất 1 sự kiện** lên phần tử cha chứa chúng. Khi sự kiện nổi bọt lên cha, ta sử dụng `event.target` để kiểm tra chính xác xem phần tử con nào thực sự được click và xử lý hành động tương ứng. Cách này giải quyết vấn đề hiệu năng, bộ nhớ và tự động hoạt động với cả những phần tử con được thêm vào sau đó mà không cần gắn thêm sự kiện mới.

**2. Refactor mã dùng DocumentFragment để chỉ gây 1 lần reflow:**

**Mã tối ưu:**
```javascript
// Tạo một DocumentFragment, đây là một DOM node ảo nằm trong bộ nhớ
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    // Thêm div vào fragment thay vì body
    fragment.appendChild(div);   
}

// Cuối cùng, thêm toàn bộ nội dung của fragment vào body
document.body.appendChild(fragment); // ← Chỉ gây 1 lần reflow!
```

**Giải thích tại sao nhanh hơn:**
- Trình duyệt cần tính toán lại bố cục vị trí, kích thước (reflow) và vẽ lại trên màn hình (repaint) mỗi khi cây DOM thực bị thay đổi. Ở code cũ, việc lặp 1000 lần và gọi trực tiếp `document.body.appendChild(div)` sẽ ép trình duyệt phải reflow/repaint 1000 lần, gây giật lag.
- `DocumentFragment` giống như một cái thùng chứa ảo (không phải một phần của cây DOM thật hiển thị trên trang). Việc tạo hàng loạt phần tử và ném vào `fragment` không hề tác động đến DOM thực nên trình duyệt **không kích hoạt reflow hay repaint** trong vòng lặp.
- Chỉ tại dòng lệnh cuối cùng khi gán `fragment` vào `body`, trình duyệt mới đưa tất cả phần tử bên trong thùng chứa đó dán lên DOM thực cùng một lúc. Nhờ vậy, quá trình reflow và repaint **chỉ xảy ra duy nhất 1 lần**, giúp cải thiện hiệu suất render lên mức tối đa.
