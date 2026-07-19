import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const publicPaths = ['/', '/admin-login-page', '/auth/callback'];
      const isPublic = publicPaths.some(p => window.location.pathname === p || window.location.pathname.startsWith('/auth'));
      if (!isPublic && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
