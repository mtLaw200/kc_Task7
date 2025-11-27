const url = 'https://fakestoreapi.com/products';

export async function getProducts() {
  try {
    const res = await fetch(url);
    if (res.status >= 400) {
      throw res;
    } else {
      return await res.json();
    }
  } catch (er) {
    console.log('Unexpected error, Please try again Later.');
  }
}
