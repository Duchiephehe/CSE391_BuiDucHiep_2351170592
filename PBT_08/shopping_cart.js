function createCart() {
    let items = [];
    let discountPercent = 0;
    let discountFlat = 0;

    return {
        addItem(product, quantity = 1) {
            const existing = items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                items.push({ ...product, quantity });
            }
        },

        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },

        updateQuantity(productId, newQuantity) {
            const item = items.find(item => item.id === productId);
            if (item) {
                if (newQuantity <= 0) {
                    this.removeItem(productId);
                } else {
                    item.quantity = newQuantity;
                }
            }
        },

        getTotal() {
            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const afterPercent = subtotal - subtotal * (discountPercent / 100);
            const finalTotal = afterPercent - discountFlat;
            return Math.max(finalTotal, 0);
        },

        applyDiscount(code) {
            const codes = {
                "SALE10": { percent: 10, flat: 0 },
                "SALE20": { percent: 20, flat: 0 },
                "FREESHIP": { percent: 0, flat: 30000 }
            };
            const discount = codes[code];
            if (discount) {
                discountPercent = discount.percent;
                discountFlat = discount.flat;
                console.log(`Da ap dung ma "${code}" thanh cong!`);
            } else {
                console.log(`Ma "${code}" khong hop le!`);
            }
        },

        printCart() {
            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const total = this.getTotal();

            console.log("+-------------------------------------------------+");
            console.log("| #  | San pham        | SL | Don gia      | Tong         |");
            console.log("+-------------------------------------------------+");
            items.forEach((item, index) => {
                const lineTotal = item.price * item.quantity;
                console.log(
                    `| ${index + 1}  | ${item.name.padEnd(15)} | ${String(item.quantity).padStart(2)} | ${item.price.toLocaleString("vi-VN").padStart(12)} | ${lineTotal.toLocaleString("vi-VN").padStart(12)} |`
                );
            });
            console.log("+-------------------------------------------------+");
            if (discountPercent > 0 || discountFlat > 0) {
                console.log(`| Tam tinh:                  ${subtotal.toLocaleString("vi-VN").padStart(14)}d |`);
                if (discountPercent > 0) {
                    console.log(`| Giam gia (${discountPercent}%):             -${(subtotal * discountPercent / 100).toLocaleString("vi-VN").padStart(13)}d |`);
                }
                if (discountFlat > 0) {
                    console.log(`| Giam gia:                 -${discountFlat.toLocaleString("vi-VN").padStart(13)}d |`);
                }
            }
            console.log(`| Tong cong:                 ${total.toLocaleString("vi-VN").padStart(14)}d |`);
            console.log("+-------------------------------------------------+");
        },

        getItemCount() {
            return items.reduce((count, item) => count + item.quantity, 0);
        },

        clearCart() {
            items = [];
            discountPercent = 0;
            discountFlat = 0;
        }
    };
}

const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);

console.log("=== GIO HANG BAN DAU ===");
cart.printCart();

cart.applyDiscount("SALE10");
console.log("\n=== SAU KHI AP DUNG SALE10 ===");
cart.printCart();

console.log("\nSo SP:", cart.getItemCount());
cart.removeItem(3);
console.log("Sau xoa AirPods:", cart.getItemCount());
