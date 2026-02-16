// pages/check.js
import { productService } from '../services/productService.js';
import { CartService } from '../services/cartService.js';
import { renderFooter } from '../ui/footer.js';
import { state } from '../core/state.js';
import { formatCurrency } from '../utils/formatters.js';
import { CONFIG } from '../core/constants.js';

class CheckoutPage {
  constructor() {
    this.products = [];
    this.init();
  }

  async init() {
    this.products = await productService.getProducts();
    this.renderPage();
    this.attachEventListeners();
  }

  renderPage() {
    document.querySelector('.js-footer-container').innerHTML = renderFooter();
    this.renderOrderSummary();
  }

  renderOrderSummary() {
    if (state.cart.length === 0) {
      document.querySelector('.js-preview-container').innerHTML = `
        <div class="col-12 text-center py-4">
          <p class="text-muted">Your cart is empty</p>
          <a href="./shop-page.html" class="btn btn-sm bg-black text-white rounded-pill">
            Start Shopping
          </a>
        </div>
      `;
      return;
    }

    const summaryHTML = state.cart
      .map((cartItem) => {
        const product = productService.getProductById(cartItem.productId);
        if (!product) return '';
        return this.renderOrderItem(product, cartItem);
      })
      .join('');

    document.querySelector('.js-preview-container').innerHTML = summaryHTML;
  }

  renderOrderItem(product, cartItem) {
    const total = (product.price * cartItem.quantity).toFixed(2);

    return `
      <div class="col-12">
        <div class="cart-item-container">
          <div class="cart-item--image border bg-white p-2">
            <img
              src="${product.image}"
              alt="${product.title}"
              loading="lazy"
              class="rounded-2 img-fit"
            />
          </div>
          <div class="cart-item--details pe-3">
            <div class="c-row d-flex justify-content-between align-items-center">
              <p class="fw-bolder">${product.title}</p>
            </div>
            <div class="cart-item-qty">
              <p class="lead">${cartItem.quantity}x</p>
            </div>
            <div class="c-row d-flex justify-content-between align-items-center">
              <p class="fw-bolder fs-4">${formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const placeOrderBtn = document.querySelector('.js-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => this.handlePlaceOrder(e));
    }
  }

  handlePlaceOrder(e) {
    e.preventDefault();

    if (state.cart.length === 0) {
      this.showAlert('Your cart is empty!', 'warning');
      return;
    }

    if (!this.validateForm()) {
      this.showAlert('Please fill in all required fields correctly.', 'danger');
      return;
    }

    const orderDetails = this.generateOrderDetails();
    this.showSuccessAlert(orderDetails);
    CartService.clearCart();

    // Redirect after delay
    setTimeout(() => {
      window.location.href = './index.html';
    }, 3000);
  }

  validateForm() {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'address',
      'city',
      'zipCode',
      'state',
      'country',
      'cardNum',
      'cardExp',
      'CVV',
    ];

    let isValid = true;

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        isValid = false;
        if (field) {
          field.classList.add('is-invalid');
        }
      } else {
        if (field) {
          field.classList.remove('is-invalid');
        }
      }
    });

    // Email validation
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.classList.add('is-invalid');
        isValid = false;
      }
    }

    // Terms checkbox validation
    const checkbox = document.getElementById('checkbox');
    if (checkbox && !checkbox.checked) {
      isValid = false;
      this.showAlert('Please agree to the terms and conditions.', 'warning');
    }

    return isValid;
  }

  generateOrderDetails() {
    return {
      orderNumber: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      orderDate: new Date().toLocaleDateString(),
      items: state.cart.length,
      total: this.calculateTotal(),
    };
  }

  calculateTotal() {
    const { DELIVERY_FEE, DISCOUNT_RATE } = CONFIG;

    let subtotal = state.cart.reduce((sum, item) => {
      const product = productService.getProductById(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const discount = subtotal * DISCOUNT_RATE;
    const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;

    return (subtotal - discount + deliveryFee).toFixed(2);
  }

  showSuccessAlert(details) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <h4 class="alert-heading">
          <i class="fa-solid fa-circle-check me-2"></i>
          Order Placed Successfully!
        </h4>
        <p>Thank you for shopping with us! Your order has been placed successfully.</p>
        <hr>
        <h5>Order Details:</h5>
        <p class="mb-1"><strong>Order Number:</strong> ${
          details.orderNumber
        }</p>
        <p class="mb-1"><strong>Order Date:</strong> ${details.orderDate}</p>
        <p class="mb-1"><strong>Total Items:</strong> ${details.items}</p>
        <p class="mb-3"><strong>Total Amount:</strong> ${formatCurrency(
          details.total
        )}</p>
        <p class="mb-0">We'll send you an email with your order confirmation and shipping details soon.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertPlaceholder.innerHTML = '';
    alertPlaceholder.appendChild(wrapper);

    // Scroll to alert
    alertPlaceholder.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  showAlert(message, type = 'info') {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertPlaceholder.innerHTML = '';
    alertPlaceholder.appendChild(wrapper);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      wrapper.querySelector('.alert').classList.remove('show');
      setTimeout(() => wrapper.remove(), 150);
    }, 3000);
  }
}

// Initialize checkout page
new CheckoutPage();
