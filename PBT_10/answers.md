# PHẦN A — KIỂM TRA ĐỌC HIỂU (15 điểm)

## Câu A1 (5đ) — Sync vs Async

### 1. Dự đoán thứ tự output:
Thứ tự output sẽ là:
```
1 - Start
4 - End
3 - Promise
6 - Promise 2
2 - Timeout 0ms
7 - Nested timeout
5 - Timeout 100ms
```

### 2. Giải thích:
- **Event Loop**: Là cơ chế giám sát Call Stack và các Queue. Nó giúp JavaScript chạy các tác vụ bất đồng bộ (non-blocking) mặc dù là ngôn ngữ đơn luồng. Khi Call Stack rỗng, Event Loop sẽ ưu tiên đẩy các tác vụ từ Microtask Queue vào Call Stack trước, khi Microtask Queue rỗng hoàn toàn, nó mới lấy tác vụ từ Macrotask Queue.
- **Microtask Queue**: Chứa các callback của Promise (như `.then()`, `.catch()`). Có độ ưu tiên cao hơn Macrotask Queue. Ở ví dụ trên, các callback của `Promise.resolve().then(...)` sẽ được đưa vào đây và thực thi ngay sau khi các code đồng bộ chạy xong.
- **Macrotask Queue (Task Queue)**: Chứa các callback của `setTimeout`, `setInterval`, sự kiện DOM, v.v. Các callback của `setTimeout` ở trên sẽ vào hàng đợi này và chỉ chạy khi code đồng bộ và Microtask Queue đã xử lý xong. (Lưu ý: `setTimeout 0ms` khai báo trong callback của Promise 2 sẽ chạy sau `setTimeout 0ms` khai báo ở đầu vì nó được đẩy vào Queue muộn hơn).

---

## Câu A2 (5đ) — Fetch API

### Giải thích từng dòng code:
- **`await fetch(...)` — fetch trả về gì? Tại sao cần await?**
  - `fetch` trả về một **Promise** đại diện cho đối tượng Response của yêu cầu HTTP.
  - Cần `await` vì đây là tác vụ mạng bất đồng bộ. `await` giúp tạm dừng hàm `async` cho đến khi Promise resolve (có dữ liệu trả về từ server), làm cho luồng code dễ đọc như code đồng bộ.
- **`response.ok` — Khi nào false? Liệt kê 3 status codes tương ứng:**
  - `response.ok` là `false` khi HTTP Status Code báo lỗi (tức là không nằm trong khoảng `200-299`).
  - 3 status codes ví dụ: `404` (Not Found), `500` (Internal Server Error), `403` (Forbidden).
- **`response.json()` — Tại sao cần await lần nữa?**
  - Phương thức `json()` cũng trả về một **Promise** vì nó cần đọc luồng dữ liệu (stream) từ response body và phân tích cú pháp (parse) thành object JavaScript một cách bất đồng bộ. Do đó cần thêm `await` để chờ quá trình parse hoàn tất.
- **`try...catch` — Catch những lỗi gì?**
  - Khối `catch` sẽ bắt được:
    1. **Network error**: Lỗi mạng (rớt mạng, sai URL, CORS, máy chủ không phản hồi) khiến Promise của `fetch` bị Reject.
    2. **Lỗi HTTP tự ném (Throw Error)**: Nhờ có câu lệnh `if (!response.ok) { throw new Error(...) }`, khối catch sẽ bắt được các lỗi do HTTP request không thành công.
    3. **JSON parse error**: Nếu chuỗi trả về không phải là JSON hợp lệ, `response.json()` sẽ bị reject và rơi vào catch.

---

## Câu A3 (5đ) — Promise States

### 1. Sơ đồ 3 trạng thái của Promise:
```text
           Pending (Đang chờ)
          /                  \
 (resolve)                    (reject)
    /                            \
Fulfilled (Thành công)       Rejected (Thất bại)
```
*Lưu ý: Khi đã chuyển sang Fulfilled hoặc Rejected, trạng thái của Promise sẽ chốt lại (settled) và không thể thay đổi được nữa.*

### 2. Callback Hell là gì?
- **Callback Hell** là tình trạng lồng ghép quá nhiều hàm callback vào bên trong nhau để xử lý các tác vụ bất đồng bộ tuần tự. Việc này tạo ra một cấu trúc code hình "kim tự tháp" lùi dần vào trong (Pyramid of Doom), khiến code cực kỳ khó đọc, khó bảo trì, và khó xử lý lỗi.

### 3. Ví dụ 4 cấp callback hell:
```javascript
// Ví dụ về Callback Hell 4 cấp
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                console.log(d);
            });
        });
    });
});
```

### 4. Refactor thành async/await:
```javascript
// Refactor lại gọn gàng hơn với async/await
async function fetchAllData() {
    try {
        const a = await getData();
        const b = await getMoreData(a);
        const c = await getMoreData(b);
        const d = await getMoreData(c);
        
        console.log(d);
    } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
    }
}
```
