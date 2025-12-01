// utils/rating.js
export function convertToTens(num) {
  const rating = Math.round(num * 10);

  if (rating <= 0) return '0';
  if (rating <= 5) return '05';
  if (rating <= 10) return '10';
  if (rating <= 15) return '15';
  if (rating <= 20) return '20';
  if (rating <= 25) return '25';
  if (rating <= 30) return '30';
  if (rating <= 35) return '35';
  if (rating <= 40) return '40';
  if (rating <= 45) return '45';
  return '50';
}
