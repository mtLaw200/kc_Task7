import { getProducts } from '../data/product.js';
import { addToCart, updateCart } from '../data/cart.js';
import { productHTML } from '../utils/productHtml.js';
import { getFooterHTML } from '../utils/footer.js';

async function loadPage() {
  const totalCart = document.querySelectorAll('.nav--cart-counter');
  const cartIcons = document.querySelectorAll('.cart-icon');

  updateCart(cartIcons, totalCart);
  try {
    let Products = await getProducts();
    document.querySelector('.js-product-container').innerHTML =
      productHTML(Products);

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

loadPage();
document.querySelector('.js-footer-container').innerHTML = getFooterHTML();
