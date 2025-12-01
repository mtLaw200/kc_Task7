// utils/formatters.js
import { CONFIG } from '../core/constants.js';

export function formatCurrency(amount) {
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: CONFIG.CURRENCY,
  }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(CONFIG.LOCALE);
}
