export async function httpGet(url) {
  try {
    const res = await fetch(url);
    if (res.status >= 400) {
      throw res;
    } else {
      return await res.json();
    }
  } catch (error) {
    console.log('Unexpected error, Please try again Later.');
  }
}
