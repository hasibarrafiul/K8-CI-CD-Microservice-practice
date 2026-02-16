import axios from 'axios';

// Instance for Auth Service (No token needed to login)
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
});

// Instance for User Service (Always attaches JWT)
export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});