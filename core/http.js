// core/http.js
export async function httpGet(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('HTTP GET Error:', error);
    throw error;
  }
}
