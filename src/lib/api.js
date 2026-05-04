// Client-side API helpers
function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('byok_token') || '';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function req(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: authHeaders(),
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (email, password) =>
  fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  }).then((r) => r.json());

// Provider API keys
export const fetchKeys = () => req('GET', '/api/keys');
export const createKey = (data) => req('POST', '/api/keys', data);
export const updateKey = (data) => req('PUT', '/api/keys', data);
export const deleteKey = (id) => req('DELETE', `/api/keys?id=${id}`);

// Routing rules
export const fetchRules = () => req('GET', '/api/rules');
export const createRule = (data) => req('POST', '/api/rules', data);
export const updateRule = (data) => req('PUT', '/api/rules', data);
export const deleteRule = (id) => req('DELETE', `/api/rules?id=${id}`);

// Usage / analytics
export const fetchUsage = (days = 30, limit = 200) =>
  req('GET', `/api/usage?days=${days}&limit=${limit}`);

// Gateway keys
export const fetchGatewayKeys = () => req('GET', '/api/gateway-keys');
export const createGatewayKey = (data) => req('POST', '/api/gateway-keys', data);
export const revokeGatewayKey = (id) => req('DELETE', `/api/gateway-keys?id=${id}`);

// Providers list
export const fetchProviders = () => req('GET', '/api/providers');
