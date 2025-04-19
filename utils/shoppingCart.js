const config = require('../config');

class ShoppingCart {
    constructor() {
        this.carts = new Map();
    }

    getCart(userId) {
        if (!this.carts.has(userId)) {
            this.carts.set(userId, []);
        }
        return this.carts.get(userId);
    }

    addItem(userId, productName) {
        const cart = this.getCart(userId);
        const product = config.products[productName];
        
        if (!product) {
            return false;
        }

        cart.push({
            name: productName,
            price: product.price,
            description: product.description
        });

        return true;
    }

    removeItem(userId, index) {
        const cart = this.getCart(userId);
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            return true;
        }
        return false;
    }

    clearCart(userId) {
        this.carts.set(userId, []);
    }

    getTotal(userId) {
        const cart = this.getCart(userId);
        return cart.reduce((total, item) => total + item.price, 0);
    }

    formatCart(userId) {
        const cart = this.getCart(userId);
        if (cart.length === 0) {
            return "🛒 عربة التسوق فارغة";
        }

        let output = "🛒 محتويات عربة التسوق:\n\n";
        cart.forEach((item, index) => {
            output += `${index + 1}. ${item.name} - ${item.price}$\n`;
        });
        output += `\n💰 المجموع: ${this.getTotal(userId)}$`;
        return output;
    }
}

module.exports = new ShoppingCart();
