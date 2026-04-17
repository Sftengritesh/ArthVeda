import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://arthveda-1.onrender.com',
});

// Request interceptor to attach standard JWT token
api.interceptors.request.use(
  (config) => {
    let user = null;
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        user = JSON.parse(stored);
      } else if (stored === 'undefined') {
        localStorage.removeItem('user');
      }
    } catch (e) {
      localStorage.removeItem('user');
    }

    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor to handle token refresh if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic catch-all for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;