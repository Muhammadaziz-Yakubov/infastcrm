import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/' : 'https://infastcrm-0b2r.onrender.com/api/');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests dynamically
api.interceptors.request.use(
  (config) => {
    // Get tokens from localStorage
    const adminToken = localStorage.getItem('token');
    const studentToken = localStorage.getItem('studentToken');

    // Add appropriate token if not already present
    if (!config.headers?.Authorization) {
      const isStudentSite = window.location.pathname.startsWith('/student');

      if (isStudentSite && studentToken) {
        config.headers.Authorization = `Bearer ${studentToken}`;
      } else if (!isStudentSite && adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }

    // Remove default Content-Type for FormData requests
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
