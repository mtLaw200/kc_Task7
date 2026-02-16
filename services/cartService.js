// services/cartService.js
import { state } from '../core/state.js';
import { CONFIG } from '../core/constants.js';

export class CartService {
  static addToCart(productId, quantity = 1) {
    const item = state.cart.find(
      (p) => String(p.productId) === String(productId)
    );

    if (item) {
      item.quantity += quantity;
    } else {
      state.cart.push({ productId: String(productId), quantity });
    }

    state.saveCart();
    this.notifyCartChange();
  }

  static updateQuantity(productId, quantity) {
    const item = state.cart.find(
      (p) => String(p.productId) === String(productId)
    );
    if (item) {
      // Don't allow quantity to go below 1
      item.quantity = Math.max(1, quantity);
      state.saveCart();
      this.notifyCartChange();
    }
  }

  static removeFromCart(productId) {
    state.cart = state.cart.filter(
      (item) => String(item.productId) !== String(productId)
    );
    state.saveCart();
    this.notifyCartChange();
  }

  static clearCart() {
    state.cart = [];
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    this.notifyCartChange();
  }

  static getTotal() {
    return state.getCartTotal();
  }

  static notifyCartChange() {
    window.dispatchEvent(
      new CustomEvent('cartChanged', {
        detail: { total: this.getTotal() },
      })
    );
  }

  static updateCartUI(icons, totalCountElements) {
    const cartQty = this.getTotal();

    if (cartQty !== 0) {
      totalCountElements.forEach((count) => {
        count.classList.remove('d-none');
        count.textContent = cartQty;
      });
    } else {
      totalCountElements.forEach((count) => {
        count.classList.add('d-none');
      });
    }
  }
}
