// services/productService.js
import { httpGet } from '../core/http.js';
import { CONFIG } from '../core/constants.js';
import { handleError } from '../utils/errorHandler.js';

class ProductService {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  async getProducts(forceRefresh = false) {
    if (!forceRefresh && this.isCacheValid()) {
      return this.cache;
    }

    try {
      this.cache = await httpGet(CONFIG.API_URL);
      this.cacheTime = Date.now();
      return this.cache;
    } catch (error) {
      handleError(error, 'Failed to load products. Please try again.');
      return [];
    }
  }

  isCacheValid() {
    return (
      this.cache &&
      this.cacheTime &&
      Date.now() - this.cacheTime < this.CACHE_DURATION
    );
  }

  getProductById(id) {
    if (!this.cache) return null;
    return this.cache.find((p) => String(p.id) === String(id));
  }

  clearCache() {
    this.cache = null;
    this.cacheTime = null;
  }
}

export const productService = new ProductService();
