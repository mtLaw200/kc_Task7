import { Products } from "./data/product.js";
import { addToCart, updateCart } from "./data/cart.js";
import { productHTML } from "./utils/productHtml.js";

function loadPage() {
  const totalCart = document.querySelectorAll(".nav--cart-counter");
  const cartIcons = document.querySelectorAll(".cart-icon");

  updateCart(cartIcons, totalCart);
  const newArray = [];

  for (let i = 0; i <= 4; i++) {
    newArray.push(Products[i]);
  }

  document.querySelector(".js-product-container").innerHTML =
    productHTML(newArray);

  const addToCartButtons = document.querySelectorAll(".js-add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const statusMessage = document.querySelector(
        `.js-added-status-${productId}`
      );
      addToCart(productId);
      setTimeout(() => {
        statusMessage.classList.toggle("d-none");
      }, 1000);
      statusMessage.classList.toggle("d-none");
    });
  });
}

loadPage();
