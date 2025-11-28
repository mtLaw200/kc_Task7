import { state } from '../core/state.js';

export function addToCart(productId) {
  const item = state.cart.find((p) => p.productId === productId);
  item ? item.quantity++ : state.cart.push({ productId, quantity: 1 });
  saveCart();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  saveCart();
}

export function saveCart() {
  localStorage.setItem('shop-now-cart', JSON.stringify(state.cart));
}

export function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function clearCart() {
  state.cart = [];
  localStorage.removeItem('shop-now-cart');
}

export function updateCart(icons, totalCount) {
  loadCart();
  let cartQty = getCartTotal();

  icons.forEach((icon) => {
    icon.addEventListener('click', () => {
      open('../add-to-cart-page.html', '_self');
    });
  });

  if (cartQty != 0) {
    totalCount.forEach((count) => {
      count.classList.remove('d-none');
      count.innerHTML = cartQty;
    });
  }
}
export function loadCart() {
  const cartData = localStorage.getItem('shop-now-cart');
  state.cart = cartData ? JSON.parse(cartData) : [];
}
