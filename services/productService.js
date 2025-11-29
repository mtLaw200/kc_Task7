import { httpGet } from '../core/http.js';
const API_URL = 'https://fakestoreapi.com/products';

let cachedProducts = null;

export async function getProducts() {
  if (cachedProducts) return cachedProducts;
  cachedProducts = await httpGet(API_URL);
  return cachedProducts;
}
