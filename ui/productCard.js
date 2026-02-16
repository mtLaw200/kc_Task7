// ui/productCard.js
import { convertToTens } from '../utils/rating.js';
import { formatCurrency } from '../utils/formatters.js';

export class ProductCard {
  static render(product) {
    const {
      image,
      id,
      price,
      title,
      rating: { rate, count },
    } = product;

    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 overflow-hidden" data-product-id="${id}">
          <div class="img-container p-3">
            <img
              src="${image}"
              class="img-fit"
              loading="lazy"
              alt="${title}"
            />
          </div>
          <div class="card-body bg-body-tertiary">
            <p class="product-name fw-bolder">${title}</p>
            <div class="product-rating-details mb-2 d-flex align-items-center">
              <div class="rating-icon-container">
                <img
                  src="./assets/ratings/rating-${convertToTens(rate)}.png"
                  alt="${rate} stars"
                  class="img-fit"
                  loading="lazy"
                />
              </div>
              <div class="product-count ms-2 small mt-1 fw-semibold">${count}</div>
            </div>
            <h4 class="product price fw-bolder mb-1">${formatCurrency(
              price
            )}</h4>
            <div class="product-added-status text-center my-1 fw-bold centered d-none" data-status="${id}">
              <i class="fa-solid fa-circle-check me-2 fs-2"></i>
              Added
            </div>
            <button
              class="btn bg-black text-white w-100 rounded-pill fw-bold mt-2 js-add-to-cart"
              data-product-id="${id}"
              aria-label="Add ${title} to cart"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static renderList(products) {
    return products.map((product) => this.render(product)).join('');
  }
}
