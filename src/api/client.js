import axios from 'axios';

const apiClient = axios.create({
  // In production (Vercel), VITE_API_URL points to the Render backend.
  // In development, Vite proxies /api → localhost:5000 so baseURL stays '/api'.
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request: attach JWT ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('daadi-auth');
      if (raw) {
        const { state } = JSON.parse(raw);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch { /* corrupted storage — ignore */ }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response: normalise errors ───────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Unable to connect to the server. Please check your connection.'));
    }

    // 401 — clear auth state so the UI redirects to login
    if (error.response.status === 401) {
      try {
        // Clear only the auth key, preserve cart
        localStorage.removeItem('daadi-auth');
        // Also clear Zustand in-memory state via a custom event
        window.dispatchEvent(new Event('daadi-auth-expired'));
      } catch { /* ignore */ }
    }

    const message =
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.statusText ||
      'An unexpected error occurred.';

    return Promise.reject(new Error(message));
  }
);

export const productsApi = {
  getAll:        (params = {}) => apiClient.get('/products', { params }),
  getCategories: ()            => apiClient.get('/products/categories'),
  getBySlug:     (slug)        => apiClient.get(`/products/${slug}`),
  create:        (data)        => apiClient.post('/products', data),
  update:        (id, data)    => apiClient.put(`/products/${id}`, data),
  delete:        (id)          => apiClient.delete(`/products/${id}`),
  createCategory: (name)       => apiClient.post('/products/categories', { name }),
};

export const uploadApi = {
  /**
   * Upload a product image from the user's computer.
   * @param {File} file  — the File object from <input type="file">
   * @returns Promise<{ url, filename, size, mimetype }>
   */
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return apiClient.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const ordersApi = {
  place:        (data)        => apiClient.post('/orders', data),
  getById:      (id)          => apiClient.get(`/orders/${id}`),
  getAll:       (params = {}) => apiClient.get('/orders', { params }),
  updateStatus: (id, status)  => apiClient.patch(`/orders/${id}/status`, { status }),
  delete:       (id)          => apiClient.delete(`/orders/${id}`),
  getStats:     ()            => apiClient.get('/orders/stats/summary'),
};

export const authApi = {
  login:          (username, password)             => apiClient.post('/auth/login', { username, password }),
  changePassword: (currentPassword, newPassword)   => apiClient.post('/auth/change-password', { currentPassword, newPassword }),
};

export default apiClient;
