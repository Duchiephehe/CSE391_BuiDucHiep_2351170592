// 1. pipe() — Nối chuỗi functions: chạy lần lượt từ trái sang phải
function pipe(...fns) {
    return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

const process = pipe(
    x => x * 2,
    x => x + 10,
    x => x.toString(),
    x => "Ket qua: " + x
);
console.log(process(5));


// 2. memoize() — Cache kết quả đã tính
function memoize(fn) {
    const cache = {};
    return (...args) => {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

const expensiveCalc = memoize((n) => {
    console.log("Dang tinh...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});
console.log(expensiveCalc(1000000));
console.log(expensiveCalc(1000000));


// 3. debounce() — Chờ user ngừng thao tác mới thực hiện
function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);

search("i");
search("ip");
search("iph");
search("ipho");
search("iphon");
search("iphone");
setTimeout(() => console.log("Chi 'iphone' duoc in ra sau 500ms"), 600);


// 4. retry() — Thử lại nếu lỗi
async function retry(fn, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await fn();
            return result;
        } catch (err) {
            console.log(`Lan thu ${attempt} that bai: ${err.message}`);
            if (attempt === maxAttempts) {
                throw new Error(`That bai sau ${maxAttempts} lan thu: ${err.message}`);
            }
        }
    }
}

let callCount = 0;
const unreliableAPI = () => {
    callCount++;
    if (callCount < 3) {
        return Promise.reject(new Error("Server loi"));
    }
    return Promise.resolve({ data: "Thanh cong!" });
};

retry(unreliableAPI, 5).then(res => console.log("Ket qua:", res));
