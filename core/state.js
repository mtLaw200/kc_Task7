export const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem('cart')) || [],
};

