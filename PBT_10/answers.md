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

---

## PHẦN C — PHÂN TÍCH (20 điểm)

### Câu C1 (10đ) — Error Handling Strategy

Khi xây dựng một ứng dụng E-Commerce, chiến lược xử lý lỗi (Error Handling) cực kỳ quan trọng để đảm bảo trải nghiệm người dùng (UX) và độ ổn định của hệ thống:

**1. Network errors (Mất mạng giữa chừng)**
- **Xử lý:** Đây là lỗi làm cho `fetch()` trả về một Promise bị rejected (văng thẳng vào `catch`). Cần bắt lỗi này trong khối catch để thông báo cho người dùng kiểm tra lại kết nối internet (ví dụ bằng Toast Notification "Không có kết nối mạng"). Có thể kết hợp lưu trạng thái các request chưa gửi được vào `localStorage` hoặc Service Worker để đồng bộ lại sau khi có mạng.

**2. API errors (Server trả 4xx, 5xx)**
- **Xử lý:** Bản thân `fetch()` **không reject** các mã HTTP lỗi (chỉ reject khi lỗi mạng), nên ta phải tự kiểm tra bằng `response.ok` hoặc `response.status` ngay sau khi nhận kết quả.
  - **Lỗi 404 (Not Found):** Thông báo cho người dùng "Dữ liệu hoặc trang bạn tìm không tồn tại" hoặc redirect về trang lỗi.
  - **Lỗi 500 (Internal Server Error):** Thông báo "Hệ thống đang gặp sự cố, vui lòng thử lại sau". Cần tự động gửi log chi tiết về hệ thống giám sát (Sentry, Datadog) cho developer.
  - **Lỗi 429 (Too Many Requests):** Thông báo "Bạn thao tác quá nhanh, vui lòng chờ ít phút". Thường server có gửi kèm header `Retry-After`, ta có thể đọc header này để khóa nút bấm hoặc tự động retry sau đúng ngần ấy giây.

**3. Timeout (API chậm > 10 giây)**
- **Giải thích:** `fetch()` mặc định không có timeout (hoặc thời gian treo của trình duyệt rất lâu, có thể lên tới 1-2 phút). Cần chủ động ngắt kết nối (abort) nếu server phản hồi quá lâu để không làm treo giao diện/loading mãi mãi. Cơ chế chuẩn trong JS là sử dụng `AbortController`.
- **Code mẫu `fetchWithTimeout`:**
```javascript
async function fetchWithTimeout(url, ms = 10000, options = {}) {
    // Tạo một AbortController để quản lý việc hủy request
    const controller = new AbortController();
    
    // Tạo timeout để tự động gọi hàm hủy (abort) sau khoảng thời gian ms
    const timeoutId = setTimeout(() => controller.abort(), ms);

    try {
        // Truyền signal của controller vào config của fetch
        const response = await fetch(url, { ...options, signal: controller.signal });
        
        // Nhớ xóa timeout nếu request thành công trước khi hết giờ
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // Khi controller.abort() được gọi, fetch sẽ ném ra lỗi có tên là 'AbortError'
        if (error.name === 'AbortError') {
            throw new Error(`Request Timeout: Không nhận được phản hồi sau ${ms}ms`);
        }
        throw error; // Các lỗi khác (network, syntax) thì ném ra như bình thường
    }
}
```

**4. Retry logic (Thử lại 3 lần nếu lỗi network)**
- **Giải thích:** Mạng internet đặc biệt là 3G/4G di động rất hay chập chờn, hoặc server bị tải nặng dẫn đến ngắt kết nối tạm thời. Tự động thử gửi lại (retry) request từ 2-3 lần là giải pháp cải thiện UX rất tuyệt vời (cần áp dụng Exponential Backoff để tránh dồn dập).
- **Code mẫu `fetchWithRetry`:**
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Thường chỉ nên retry nếu gặp lỗi từ phía máy chủ (5xx)
                // Lỗi 4xx (Bad Request, Unauthorized) thì do user, có gửi lại 100 lần cũng vô dụng
                if (response.status >= 500 && response.status <= 599) {
                    throw new Error(`Server Error: ${response.status}`);
                }
                return await response.json();
            }
            return await response.json();
        } catch (error) {
            retries++;
            console.warn(`[Lần ${retries}/${maxRetries}] Mạng lỗi hoặc server không phản hồi. Đang thử lại...`);
            
            // Nếu hết số lần retry vẫn lỗi, thì quăng lỗi ra ngoài
            if (retries >= maxRetries) {
                throw new Error("Mất kết nối mạng. Đã thử lại tối đa số lần nhưng vẫn thất bại.");
            }
            // Tạo delay giữa các lần retry (tùy chọn nhưng nên có: 1s -> 2s -> 3s)
            await new Promise(res => setTimeout(res, 1000 * retries));
        }
    }
}
```

---

### Câu C2 (10đ) — Promise.all vs Promise.allSettled vs Promise.race vs Promise.any

**Bảng so sánh:**

| Method | Khi nào resolve? | Khi nào reject? | Use case |
|--------|------------------|-----------------|----------|
| **`.all()`** | Khi **TẤT CẢ** các promise thành công (trả về mảng kết quả theo đúng thứ tự mảng gốc). | Ngay khi **CÓ 1** promise bất kỳ thất bại (ngay lập tức). | Tải các khối dữ liệu thiết yếu mà nếu thiếu một phần thì không thể/không nên hiển thị trang (VD: Lấy Thông tin User + Phân quyền). |
| **`.allSettled()`** | Khi **TẤT CẢ** các promise đã "chốt" xong (settled - dù là thành công hay thất bại). | **KHÔNG BAO GIỜ** bị reject ngay lập tức do một promise con chết. Luôn resolve. | Chạy nhiều tác vụ hoàn toàn độc lập với nhau. Thất bại của khối UI này không được làm hỏng toàn bộ trang (VD: Tải comment và tải sản phẩm liên quan). |
| **`.race()`** | Ngay khi **CÓ 1** promise ĐẦU TIÊN thành công. | Ngay khi **CÓ 1** promise ĐẦU TIÊN thất bại. | Lấy kết quả từ đường chạy nhanh nhất, hoặc tạo chức năng **Timeout cho API** (cuộc đua giữa fetch và setTimeout). |
| **`.any()`** | Ngay khi **CÓ 1** promise ĐẦU TIÊN thành công (bỏ qua những cái chết). | Khi **TẤT CẢ** promise đều thất bại (ném ra `AggregateError`). | Tải cùng 1 dữ liệu từ nhiều cụm máy chủ (mirrors), chỉ cần máy nào phản hồi nhanh và thành công đầu tiên là lấy, kệ máy chủ hỏng. |

**Ví dụ Code cho từng tình huống (Scenario thực tế):**

**1. `Promise.all()` - Dữ liệu tiên quyết (Màn hình Checkout):**
Phải có đủ cả thông tin Giỏ hàng và Mã giảm giá mới được phép cho thanh toán. Nếu 1 cái sập, cấm thanh toán luôn.
```javascript
async function checkout() {
    try {
        const [cartData, discountData] = await Promise.all([
            fetch('/api/cart/123').then(res => res.json()),
            fetch('/api/discounts').then(res => res.json())
        ]);
        renderCheckoutForm(cartData, discountData);
    } catch (err) {
        // Rất nhạy cảm. Chỉ cần lỗi API mã giảm giá, cả quá trình thanh toán bị hủy
        showErrorAlert("Hệ thống đang bảo trì, không thể tải giỏ hàng lúc này.");
    }
}
```

**2. `Promise.allSettled()` - Tải Dashboard độc lập:**
Trang Dashboard admin thường lấy doanh thu tháng, số user mới, danh sách bài viết. Chẳng may API bài viết sập, thì doanh thu vẫn phải được vẽ lên màn hình.
```javascript
async function loadDashboard() {
    const results = await Promise.allSettled([
        fetch('/api/stats/revenue'),
        fetch('/api/stats/users'),
        fetch('/api/posts/latest')
    ]);

    // results trả về mảng object [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}]
    if (results[0].status === "fulfilled") renderRevenueWidget(results[0].value);
    else showWidgetError('revenue');

    if (results[1].status === "fulfilled") renderUserWidget(results[1].value);
    else showWidgetError('users');
    
    // ...
}
```

**3. `Promise.race()` - Kỹ thuật Timeout (dùng thay AbortController):**
Trường hợp ta muốn nếu fetch dữ liệu nặng quá 5 giây thì tự báo lỗi bỏ qua, dù sau đó fetch vẫn chạy xong ở background đi nữa thì ta không cần nhận kết quả nữa.
```javascript
async function fetchWithRaceTimeout(url, ms = 5000) {
    const apiPromise = fetch(url).then(r => r.json());
    // Tạo 1 promise mà chắc chắn sẽ bị reject sau `ms` mili-giây
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout quá 5 giây!")), ms)
    );

    try {
        // Cuộc đua giữa việc tải xong và đếm ngược thời gian. Cái nào tới trước tính cái đó.
        const response = await Promise.race([apiPromise, timeoutPromise]);
        console.log("Tuyệt vời, lấy dữ liệu kịp thời gian:", response);
    } catch (err) {
        console.error(err.message); // In ra "Timeout quá 5 giây!" nếu mạng chậm hơn 5 giây
    }
}
```

**4. `Promise.any()` - Lấy file từ Server phụ (Mirror Download):**
Có 3 đường link CDN chứa cùng 1 bức ảnh. Trình duyệt tải đồng thời cả 3, server nào phản hồi nhanh và Không lỗi đầu tiên sẽ được lấy để dùng.
```javascript
async function downloadFastestMirror() {
    try {
        const imageResponse = await Promise.any([
            fetch('https://server-vn.com/assets/banner.jpg'),
            fetch('https://server-sg.com/assets/banner.jpg'),
            fetch('https://server-us.com/assets/banner.jpg')
        ]);
        
        console.log("Đã tải xong ảnh từ:", imageResponse.url);
        document.querySelector('img').src = imageResponse.url;
    } catch (err) {
        // err lúc này là một AggregateError (Tập hợp lỗi)
        console.error("Cả 3 server dự phòng đều đã chết mạng!");
        console.error(err.errors);
    }
}
```
