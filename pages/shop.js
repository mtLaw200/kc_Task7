// pages/shop.js
import { productService } from '../services/productService.js';
import { CartService } from '../services/cartService.js';
import { renderFooter } from '../ui/footer.js';
import { ProductCard } from '../ui/productCard.js';

async function loadPage() {
  const totalCart = document.querySelectorAll('.nav--cart-counter');
  const cartIcons = document.querySelectorAll('.cart-icon');

  CartService.updateCartUI(cartIcons, totalCart);

  try {
    const products = await productService.getProducts();
    document.querySelector('.js-product-container').innerHTML =
      ProductCard.renderList(products);

    // Add to cart functionality using event delegation
    document.addEventListener('click', handleAddToCart);
  } catch (error) {
    console.error('Failed to load products:', error);
    document.querySelector('.js-product-container').innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger">Failed to load products. Please refresh the page.</p>
      </div>
    `;
  }
}

function handleAddToCart(e) {
  if (e.target.matches('.js-add-to-cart')) {
    const { productId } = e.target.dataset;
    const statusMessage = document.querySelector(
      `[data-status="${productId}"]`
    );

    CartService.addToCart(productId);

    // Update cart UI
    const totalCart = document.querySelectorAll('.nav--cart-counter');
    const cartIcons = document.querySelectorAll('.cart-icon');
    CartService.updateCartUI(cartIcons, totalCart);

    // Show "Added" message
    if (statusMessage) {
      statusMessage.classList.remove('d-none');
      setTimeout(() => {
        statusMessage.classList.add('d-none');
      }, 1000);
    }
  }
}

// Listen for cart changes
window.addEventListener('cartChanged', () => {
  const totalCart = document.querySelectorAll('.nav--cart-counter');
  const cartIcons = document.querySelectorAll('.cart-icon');
  CartService.updateCartUI(cartIcons, totalCart);
});

// Initialize page
await loadPage();

// Render footer
document.querySelector('.js-footer-container').innerHTML = renderFooter();
