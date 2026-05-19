// =======================================================
// FARMZSAFE — API Helper
// All backend calls go through here.
// Change BASE_URL to your deployed backend URL.
// =======================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('farmzsafe_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Auth ────────────────────────────────────────────────
export const authAPI = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Farms ───────────────────────────────────────────────
export const farmsAPI = {
  getAll: () => request('/farms'),
  getById: (id) => request(`/farms/${id}`),
  create: (data) => request('/farms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/farms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/farms/${id}`, { method: 'DELETE' }),
};

// ── Vaccines ────────────────────────────────────────────
export const vaccinesAPI = {
  getAll: () => request('/vaccines'),
  create: (data) => request('/vaccines', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/vaccines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/vaccines/${id}`, { method: 'DELETE' }),
};

// ── Reports ─────────────────────────────────────────────
export const reportsAPI = {
  getSummary: () => request('/reports/summary'),
};
