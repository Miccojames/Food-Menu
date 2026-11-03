import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const TOKEN_KEY = 'bb_token';

export const tokenService = {
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Attach JWT to every request when present
api.interceptors.request.use((config) => {
  const token = tokenService.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to format errors + handle auth failures
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // Token expired/invalid — force logout everywhere
    if (status === 401) {
      tokenService.clear();
      localStorage.removeItem('bb_user');
      if (!window.location.hash.includes('/login')) {
        window.location.hash = '#/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
