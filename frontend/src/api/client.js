import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Habilitar soporte de cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]:', error?.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
