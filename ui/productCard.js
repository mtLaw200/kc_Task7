import { convertToTens } from '../utils/rating.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export function renderProductCard(p) {
  let html = '';
  p.forEach((product) => {
    const {
      image,
      id,
      price,
      title,
      rating: { rate, count },
    } = product;

    html += `
    <div class="col-12 col-sm-6 col-lg-3">
            <div class="card h-100 overflow-hidden">
              <div class="img-container p-3">
                <img
                src="${image}"
                class="img-fit"
                alt="product-${title}"
              />
              </div>
              <div class="card-body bg-body-tertiary">
                <p class="product-name fw-bolder">${title}</p>
                <div
                  class="product-rating-details mb-2 d-flex align-items-center"
                >
                <div class="rating-icon-container">
                  <img
                    src="./assets/ratings/rating-${convertToTens(rate)}.png"
                    alt="rating-${rate}"
                    class="img-fit"
                  />
                </div>
                  <div class="product-count ms-2 small mt-1 fw-semibold">${count}</div>
                </div>
                <h4 class="product price fw-bolder mb-1">${formatCurrency(
                  price
                )}</h4>
                <div class="product-added-status text-center my-1 fw-bold centered js-added-status-${id} d-none">
                  <i class="fa-solid fa-circle-check me-2 fs-2"></i>
                  Added
                </div>
                <button
                  class="btn bg-black text-white w-100 rounded-pill fw-bold mt-2 js-add-to-cart" data-product-id="${id}"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
    `;
  });

  return html;
}
