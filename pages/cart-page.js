import {
  getCartTotal,
  removeFromCart,
  loadCart,
  saveCart,
} from '../services/cartService.js';
import { state } from '../core/state.js';
import { renderFooter } from '../ui/footer.js';
import { getProducts } from '../services/productService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
const cartContainer = document.querySelector('.js-cart-container');

let Products = await getProducts();

async function loadPage() {
  let carts = loadCart();
  document.querySelector('.js-footer-container').innerHTML = renderFooter();
  const icons = document.querySelectorAll('.nav--cart-icon');
  icons.forEach((i) => {
    if (!i.classList.contains('d-none')) {
      i.classList.add('d-none');
    }
  });

  renderOrderSummary(carts);
  renderPaymentSummary(carts);

  document.querySelectorAll('.js-quantity-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { productId } = btn.dataset;
      carts.forEach((cartItem) => {
        if (String(cartItem.productId) === String(productId)) {
          if (btn.classList.contains('js-plus')) {
            cartItem.quantity += 1;
          } else {
            if (cartItem.quantity != 1) {
              cartItem.quantity -= 1;
            }
          }
        }
      });
      saveCart();
      loadPage();
    });
  });
  document.querySelectorAll('.js-delete-icon').forEach((icon) => {
    icon.addEventListener('click', () => {
      const { productId } = icon.dataset;
      removeFromCart(productId);
      loadPage();
    });
  });
}

await loadPage();

function renderOrderSummary(carts) {
  let cartSummaryHTML = '';

  carts.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    if (matchingProduct) {
      const { image, price, title, id } = matchingProduct;

      cartSummaryHTML += `<div class="cart-item-container">
                <div class="cart-item--image">
                  <img
                    src="${image}"
                    alt="${title} image"
                    class="rounded-2 img-fit"
                  />
                </div>
                <div class="cart-item--details">
                  <div
                    class="c-row d-flex justify-content-between align-items-center"
                  >
                    <p class="fw-bolder">${title}</p>
                    <div class="delete-icon fs-6 text-danger js-delete-icon" data-product-id='${id}'>
                      <i class="fa-solid fa-trash-can"></i>
                    </div>
                  </div>
                  <div
                    class="c-row d-flex justify-content-between align-items-center"
                  >
                    <p class="fw-bolder fs-5">${formatCurrency(price)}</p>
                    <div
                      class="quantity-control d-flex bg-body-tertiary px-3 rounded-pill py-2  d-flex justify-content-between"
                    >
                      <div class="decrease-btn me-2 icon-btn  js-minus js-quantity-btn" data-product-id="${id}">
                        <i class="fa-solid fa-minus"></i>
                      </div>
                      <div class="quantity-value fw-bold js-quantity-value js-value-id-${id}">${
        cartItem.quantity
      }</div>
                      <div class="increase-btn ms-2 icon-btn js-plus js-quantity-btn" data-product-id="${id}">
                        <i class="fa-solid fa-plus"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  `;
    }
  });

  cartContainer.innerHTML = cartSummaryHTML;
}

function renderPaymentSummary(carts) {
  let productTotal = 0;
  const DELIVERY_FEE = 15;
  const DISCOUNT_RATE = 0.1;

  carts.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productTotal += product.price * cartItem.quantity;
  });
  productTotal = productTotal.toFixed(2);
  const discountPercentage = (productTotal * DISCOUNT_RATE).toFixed(2);
  const deliveryFee = productTotal <= 0 ? 0 : DELIVERY_FEE;
  const grandTotal = (productTotal - discountPercentage + deliveryFee).toFixed(
    2
  );

  document.querySelector('.js-cart-summary').innerHTML = `
  <div class="c-row d-flex justify-content-between mb-3">
                  <p>Subtotal (${getCartTotal()})</p>
                  <p class="fw-bold"><span>${formatCurrency(
                    productTotal
                  )}</span></p>
                </div>
                <div class="c-row d-flex justify-content-between mb-3">
                  <p>Discount (-10%)</p>
                  <p class="fw-bold text-danger">-<span>${formatCurrency(
                    discountPercentage
                  )}</span></p>
                </div>
                <div class="c-row d-flex justify-content-between mb-3">
                  <p>Delivery Fee</p>
                  <p class="fw-bold"><span>${formatCurrency(
                    deliveryFee
                  )}</span></p>
                </div>
                <hr />
                <div class="c-row d-flex justify-content-between mb-3">
                  <p>Total</p>
                  <p class="fw-bolder fs-5"><span>${formatCurrency(
                    grandTotal
                  )}</span></p>
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
}

function getProduct(productId) {
  return Products.find((product) => String(product.id) === String(productId));
}
