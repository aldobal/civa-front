import axios from 'axios';
import { environment } from '../../environment/enviroment';

// Crear instancia de axios con configuración base
export const httpClient = axios.create({
  baseURL: environment.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar automáticamente el token a las peticiones
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error (token expirado, no autorizado, etc.)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar storage y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('userRoles');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);