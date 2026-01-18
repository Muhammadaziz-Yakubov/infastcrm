import axios from 'axios';

// Production: VITE_API_URL dan oladi, Development: /api (Vite proxy orqali)
// Agar VITE_API_URL bo'lmasa, backend URL dan foydalanamiz
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://infastcrm-0b2r.onrender.com');

console.log('🌐 API Base URL:', baseURL);
console.log('🌐 Environment:', import.meta.env.DEV ? 'development' : 'production');
console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests dynamically
api.interceptors.request.use(
  (config) => {
    // Check for both admin token and student token
    const adminToken = localStorage.getItem('token');
    const studentToken = localStorage.getItem('studentToken');

    if (adminToken && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log(`🔑 Admin token attached to ${config.method} ${config.url}`);
    } else if (studentToken && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${studentToken}`;
      console.log(`🔑 Student token attached to ${config.method} ${config.url}`);
    } else {
      console.log(`❌ No token available for ${config.method} ${config.url}`);
    }

    // Remove default Content-Type for FormData requests (let browser set it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📤 Sending FormData request:', config.url, 'Token:', adminToken ? 'admin' : studentToken ? 'student' : 'none');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isStudentArea = window.location.pathname.startsWith('/student');
      if (isStudentArea) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        window.location.href = '/student-login';
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

