import { getProducts } from '../services/productService.js';
import { addToCart, updateCart } from '../services/cartService.js';
import { renderFooter } from '../ui/footer.js';
import { renderProductCard } from '../ui/productCard.js';

async function loadPage() {
  const totalCart = document.querySelectorAll('.nav--cart-counter');
  const cartIcons = document.querySelectorAll('.cart-icon');

  updateCart(cartIcons, totalCart);
  try {
    const Products = await getProducts();
    document.querySelector('.js-product-container').innerHTML =
      renderProductCard(Products);

    // add to cart functionality
    document.addEventListener('click', (e) => {
      if (e.target.matches('.js-add-to-cart')) {
        const { productId } = e.target.dataset;
        const statusMessage = document.querySelector(
          `.js-added-status-${productId}`
        );
        addToCart(productId);
        updateCart(cartIcons, totalCart);
        setTimeout(() => {
          statusMessage.classList.toggle('d-none');
        }, 1000);
        statusMessage.classList.toggle('d-none');
      }
    });
  } catch (error) {
    console.log(error);
  }
}

await loadPage();

document.querySelector('.js-footer-container').innerHTML = renderFooter();
