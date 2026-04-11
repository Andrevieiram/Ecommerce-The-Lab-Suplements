import axios, { type AxiosInstance } from 'axios';

/**
 * Criamos a instância do Axios com a tipagem AxiosInstance.
 * Isso garante que o TypeScript reconheça os métodos .get, .post, etc.
 */
const api: AxiosInstance = axios.create({
  // Buscamos a URL do .env ou usamos o localhost como fallback
  baseURL: import.meta.env.VITE_API_URL || 'https://ecommerce-the-lab-suplements-backend-e9xr.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR (Opcional, mas recomendado):
 * Este bloco adiciona automaticamente o token de todos os requests 
 * se ele existir no localStorage, poupando você de escrever 
 * headers: { Authorization: ... } em todos os componentes.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
