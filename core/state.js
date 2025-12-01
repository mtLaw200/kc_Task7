// core/state.js
import { CONFIG } from './constants.js';

class AppState {
  constructor() {
    this.products = [];
    this.cart = this.loadCart();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

export const state = new AppState();
