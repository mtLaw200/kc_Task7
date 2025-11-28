import { getProducts } from './services/productService.js';
import { addToCart, updateCart } from './services/cartService.js';
import { renderProductCard } from './ui/productCard.js';
import { renderFooter } from './ui/footer.js';

async function loadPage() {
  const totalCart = document.querySelectorAll('.nav--cart-counter');
  const cartIcons = document.querySelectorAll('.cart-icon');
  updateCart(cartIcons, totalCart);

  try {
    const Products = await getProducts();
    const firstFourProducts = Products.slice(0, 4);

    // display first 4 products
    document.querySelector('.js-product-container').innerHTML =
      renderProductCard(firstFourProducts);

    // add event listerner to all cart buutons
    const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
    addToCartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const { productId } = button.dataset;
        const statusMessage = document.querySelector(
          `.js-added-status-${productId}`
        );
        addToCart(productId);
        updateCart(cartIcons, totalCart);
        setTimeout(() => {
          statusMessage.classList.toggle('d-none');
        }, 1000);
        statusMessage.classList.toggle('d-none');
      });
    });
  } catch (error) {
    console.log(error);
  }
}

await loadPage();

document.querySelector('.js-footer-container').innerHTML = renderFooter();
