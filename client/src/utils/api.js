import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - check if we're on an admin route
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      localStorage.removeItem('authToken');
      // Only redirect if not already on a login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = isAdminRoute ? '/admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


