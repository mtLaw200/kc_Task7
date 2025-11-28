// export let cart = JSON.parse(localStorage.getItem("cart")) || [];
import { state } from '../core/state.js';

// export function addToCart(productId) {
//   let matchingItem;

//   cart.forEach((item) => {
//     if (productId === item.productId) {
//       matchingItem = item;
//     }
//   });

//   if (matchingItem) {
//     matchingItem.quantity++;
//   } else {
//     cart.push({
//       productId: productId,
//       quantity: 1,
//     });
//   }

//   saveCartToStorage();
// }

// export function saveCartToStorage() {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// export function clearCartFromStorage() {
//   localStorage.removeItem("cart");
// }
export function updateCart(icons, totalCount) {
  let cartQty = getTotalCart();

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

// export function removeFromCart(id) {
//   const newCart = [];
//   cart.forEach((cartItem) => {
//     if (cartItem.productId !== id) {
//       newCart.push(cartItem);
//     }
//   });
//   cart = newCart;
//   saveCartToStorage();
// }

// export function getTotalCart() {
//   let qty = 0;
//   cart.forEach((cartItem) => {
//     qty += cartItem.quantity;
//   });

//   return qty;
// }
