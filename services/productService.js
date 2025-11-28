import { httpGet } from '../core/http.js';
const API_URL = 'https://fakestoreapi.com/products';

export async function getProducts() {
  return await httpGet(API_URL);
}
