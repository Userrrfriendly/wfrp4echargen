
export async function fetchProducts() {
  const response = await fetch('/data/careers.json');
  return response.json();
}

 