// pages/cart.js
import { CartService } from '../services/cartService.js';
import { state } from '../core/state.js';
import { renderFooter } from '../ui/footer.js';
import { productService } from '../services/productService.js';
import { formatCurrency } from '../utils/formatters.js';
import { CONFIG } from '../core/constants.js';

const cartContainer = document.querySelector('.js-cart-container');

async function loadPage() {
  // Wait for products to load
  await productService.getProducts();

  const carts = state.cart;

  // Render footer
  document.querySelector('.js-footer-container').innerHTML = renderFooter();

  // Hide cart icons on cart page
  const icons = document.querySelectorAll('.nav--cart-icon');
  icons.forEach((i) => {
    if (!i.classList.contains('d-none')) {
      i.classList.add('d-none');
    }
  });

  renderOrderSummary(carts);
  renderPaymentSummary(carts);
}

function renderOrderSummary(carts) {
  if (carts.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fa-solid fa-cart-shopping fs-1 mb-3"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <a href="./shop-page.html" class="btn bg-black text-white rounded-pill fw-bold mt-3">
          Start Shopping
        </a>
      </div>
    `;
    return;
  }

  let cartSummaryHTML = '';

  carts.forEach((cartItem) => {
    const matchingProduct = productService.getProductById(cartItem.productId);

    if (matchingProduct) {
      const { image, price, title, id } = matchingProduct;

      cartSummaryHTML += `<div class="cart-item-container">
        <div class="cart-item--image">
          <img
            src="${image}"
            alt="${title}"
            loading="lazy"
            class="rounded-2 img-fit"
          />
        </div>
        <div class="cart-item--details">
          <div class="c-row d-flex justify-content-between align-items-center">
            <p class="fw-bolder">${title}</p>
            <div class="delete-icon fs-6 text-danger js-delete-icon" data-product-id='${id}'>
              <i class="fa-solid fa-trash-can"></i>
            </div>
          </div>
          <div class="c-row d-flex justify-content-between align-items-center">
            <p class="fw-bolder fs-5">${formatCurrency(price)}</p>
            <div class="quantity-control d-flex bg-body-tertiary px-3 rounded-pill py-2">
              <div class="decrease-btn me-2 icon-btn js-minus js-quantity-btn" data-product-id="${id}">
                <i class="fa-solid fa-minus"></i>
              </div>
              <div class="quantity-value fw-bold">${cartItem.quantity}</div>
              <div class="increase-btn ms-2 icon-btn js-plus js-quantity-btn" data-product-id="${id}">
                <i class="fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }
  });

  cartContainer.innerHTML = cartSummaryHTML;
}

function renderPaymentSummary(carts) {
  const { DELIVERY_FEE, DISCOUNT_RATE } = CONFIG;

  let productTotal = carts.reduce((sum, cartItem) => {
    const product = productService.getProductById(cartItem.productId);
    return sum + (product?.price || 0) * cartItem.quantity;
  }, 0);

  const discountAmount = (productTotal * DISCOUNT_RATE).toFixed(2);
  const deliveryFee = productTotal <= 0 ? 0 : DELIVERY_FEE;
  const grandTotal = (productTotal - discountAmount + deliveryFee).toFixed(2);

  const summaryHTML =
    carts.length === 0
      ? ''
      : `
    <div class="c-row d-flex justify-content-between mb-3">
      <p>Subtotal (${CartService.getTotal()} items)</p>
      <p class="fw-bold">${formatCurrency(productTotal)}</p>
    </div>
    <div class="c-row d-flex justify-content-between mb-3">
      <p>Discount (-${DISCOUNT_RATE * 100}%)</p>
      <p class="fw-bold text-danger">-${formatCurrency(discountAmount)}</p>
    </div>
    <div class="c-row d-flex justify-content-between mb-3">
      <p>Delivery Fee</p>
      <p class="fw-bold">${formatCurrency(deliveryFee)}</p>
    </div>
    <hr />
    <div class="c-row d-flex justify-content-between mb-3">
      <p>Total</p>
      <p class="fw-bolder fs-5">${formatCurrency(grandTotal)}</p>
    </div>
    <div class="row">
      <div class="col-12 mt-1 d-grid">
        <a
          href="./check-out-page.html"
          class="btn bg-black text-white rounded-pill fw-bold"
        >
          Go to Checkout
          <i class="fa-solid fa-arrow-right ms-1"></i>
        </a>
      </div>
    </div>`;

  document.querySelector('.js-cart-summary').innerHTML = summaryHTML;
}

// Event delegation for cart interactions
document.addEventListener('click', (e) => {
  // Quantity buttons
  if (e.target.closest('.js-quantity-btn')) {
    const btn = e.target.closest('.js-quantity-btn');
    const { productId } = btn.dataset;
    const cartItem = state.cart.find(
      (item) => String(item.productId) === String(productId)
    );

    if (cartItem) {
      const newQty = btn.classList.contains('js-plus')
        ? cartItem.quantity + 1
        : cartItem.quantity - 1;
      CartService.updateQuantity(productId, newQty);
      loadPage();
    }
  }

  // Delete buttons
  if (e.target.closest('.js-delete-icon')) {
    const icon = e.target.closest('.js-delete-icon');
    const { productId } = icon.dataset;
    CartService.removeFromCart(productId);
    loadPage();
  }
});

// Listen for cart changes
window.addEventListener('cartChanged', () => {
  loadPage();
});

// Initialize page
await loadPage();
