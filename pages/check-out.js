import { Products, getProducts } from '../data/product.js';
import { cart, clearCartFromStorage } from '../data/cart.js';
import { getFooterHTML } from '../utils/footer.js';

const previewContainer = document.querySelector('.js-preview-container');
document.querySelector('.js-footer-container').innerHTML = getFooterHTML();
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close js-btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);
};

const alertTrigger = document.getElementById('liveAlertBtn');
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    appendAlert(
      `Order Placed Successfully! Thank you for shopping with
                        us! Your order has been placed successfully.
                        <h3>Order Details:</h3>
                        <p>Order Number: <strong>${generateOrderNumber()}</strong></p>
                        <p>Order Date: ${getTodaysDate()}</p>
                        <p>
                          We'll send you an email with your order confirmation
                          and shipping details soon.
                        </p>`,
      'success'
    );
    document.querySelector('.js-btn-close').addEventListener('click', () => {
      location.reload();
    });
  });
}

let Products = getProducts();
renderOrderSummary();

function renderOrderSummary() {
  let summaryHTML = '';
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProductId(productId);

    const { image, price, title } = matchingProduct;

    const total = ((price * 100 * cartItem.quantity) / 100).toFixed(2);

    summaryHTML += `<div class="col-12 ">
                  <div class="cart-item-container">
                    <div class="cart-item--image border bg-white p-2">
                      <img
                        src="${image}"
                        alt="${title} image"
                        loading="lazy"
                        class="rounded-2 img-fit"
                      />
                    </div>
                    <div class="cart-item--details pe-3">
                      <div
                        class="c-row d-flex justify-content-between align-items-center"
                      >
                        <p class="fw-bolder ">${title}</p>
                      </div>
                      <div class="cart-item-qty">
                        <p class="lead">${cartItem.quantity}x</p>
                      </div>
                      <div
                        class="c-row d-flex justify-content-between align-items-center"
                      >
                        <p class="fw-bolder fs-4">${new Intl.NumberFormat(
                          'en-NG',
                          {
                            style: 'currency',
                            currency: 'NGN',
                          }
                        ).format(total)}</p>
                      </div>
                    </div>
                  </div>
                </div>`;
  });

  previewContainer.innerHTML = summaryHTML;
  document.querySelector('.js-place-order').addEventListener('click', (e) => {
    e.preventDefault();
    clearCartFromStorage();
    renderOrderSummary();
  });
}

function getProductId(productId) {
  let matchingProduct;
  Products.forEach((product) => {
    if (product.id == productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

function generateOrderNumber() {
  const orderNumber = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
  return orderNumber;
}

function getTodaysDate() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString();
  return formattedDate;
}
