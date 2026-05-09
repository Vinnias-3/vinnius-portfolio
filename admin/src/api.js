const API = 'https://vinnias.pythonanywhere.com';

export function getHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function fetchAdmin(url, token, options = {}) {
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: getHeaders(token)
  });
  return res.json();
}

export default API;
