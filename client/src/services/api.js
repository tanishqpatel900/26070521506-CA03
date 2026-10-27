import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flowfinance_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on auth pages, clear stale token
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register')) {
        localStorage.removeItem('flowfinance_token');
        localStorage.removeItem('flowfinance_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
