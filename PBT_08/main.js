const miniArray = {
    map(arr, fn) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },
    
    filter(arr, fn) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },
    
    reduce(arr, fn, initialValue) {
        // Nếu không có initialValue, gán phần tử đầu tiên làm giá trị khởi tạo
        let acc = initialValue !== undefined ? initialValue : arr[0];
        // Nếu có initialValue thì lặp từ index 0, nếu không thì lặp từ index 1
        let startIndex = initialValue !== undefined ? 0 : 1;
        
        for (let i = startIndex; i < arr.length; i++) {
            acc = fn(acc, arr[i], i, arr);
        }
        return acc;
    }
};

// Test
console.log(miniArray.map([1,2,3], x => x * 2));           // Output: [2, 4, 6]
console.log(miniArray.filter([1,2,3,4], x => x > 2));      // Output: [3, 4]
console.log(miniArray.reduce([1,2,3,4], (a,b) => a+b, 0)); // Output: 10

