import axios from 'axios';

// URL base del backend. En producción se ajusta automáticamente mediante variables de entorno.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 segundos de límite para evitar peticiones colgadas eternamente
});

// ■■ INTERCEPTOR DE PETICIÓN (Request) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Agrega el token JWT en la cabecera de cada petición automáticamente si existe
API.interceptors.request.use(
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

// ■■ INTERCEPTOR DE RESPUESTA (Response) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// Captura errores globales, como tokens expirados, para limpiar el estado de la app
API.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa (2xx), la deja pasar normalmente
  (error) => {
    // Si el servidor responde con 401 (No autorizado) o 403 (Prohibido/Token inválido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('⚠️ Sesión inválida o expirada. Limpiando almacenamiento local...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Opcional: Podríamos forzar un redireccionamiento al login si es necesario
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;