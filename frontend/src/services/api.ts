import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Request Interceptor (attaches your token dynamically)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Catches 401 Unauthorized errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Wipe local tokens
      localStorage.removeItem('token');
      
      // 2. Clear any active toast message spam and show a distinct alert
      if (typeof window !== 'undefined') {
        // Force redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;