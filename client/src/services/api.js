import axios from 'axios';

// In production the Express server serves both frontend & API on the same origin,
// so we use a relative /api path. In local dev, VITE_API_URL can override this.
const API_URL = import.meta.env.VITE_API_URL || '/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campussphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // localStorage.removeItem('campussphere_token');
    }
    return Promise.reject(error);
  }
);

export default api;
