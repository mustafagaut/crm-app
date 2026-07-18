
import axios from 'axios';
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor (attaches your token dynamically)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
// While one refresh call is in flight, any other requests that fail with 401
// are queued and replayed once the new access token is ready, instead of
// each firing its own competing refresh call.
let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];
 
const processQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
};
 
const clearSessionAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
 
// Response Interceptor: on a 401, try to silently refresh the access token
// (using the refresh token) and retry the original request once. Only if
// the refresh itself fails do we clear storage and send the user to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const url: string = originalRequest?.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/refresh');
 
    // Not a 401, or it's a login/signup/refresh call, or we already retried
    // this exact request once — don't attempt another refresh.
    if (error.response?.status !== 401 || isAuthEndpoint || !originalRequest || originalRequest._retry) {
      if (error.response?.status === 401 && !isAuthEndpoint) {
        // A retried request still came back 401 — the refresh token itself
        // is no longer valid. Nothing left to do but log the user out.
        clearSessionAndRedirect();
      }
      return Promise.reject(error);
    }
 
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }
 
    if (isRefreshing) {
      // A refresh is already in flight — wait for it, then replay this request.
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }
 
    originalRequest._retry = true;
    isRefreshing = true;
 
    try {
      const refreshRes = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
      const newToken = refreshRes.data?.data?.token;
      const newRefreshToken = refreshRes.data?.data?.refreshToken;
 
      if (!newToken) {
        throw new Error('Refresh endpoint did not return a new access token');
      }
 
      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
 
      processQueue(null, newToken);
 
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
 
export default api;