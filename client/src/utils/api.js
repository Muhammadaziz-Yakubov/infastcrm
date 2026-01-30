import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/' : 'https://infastcrm-0b2r.onrender.com/api/');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add token to requests dynamically
api.interceptors.request.use(
  (config) => {
    // Get tokens from localStorage
    const adminToken = localStorage.getItem('token');
    const studentToken = localStorage.getItem('studentToken');

    // Add appropriate token if not already present
    if (!config.headers?.Authorization) {
      // Check if we're on student portal (exact /student or /student/...)
      // BUT NOT /students (admin page)
      const pathname = window.location.pathname;
      const isStudentSite = pathname === '/student' ||
        (pathname.startsWith('/student/') && !pathname.startsWith('/students'));

      if (isStudentSite && studentToken) {
        config.headers.Authorization = `Bearer ${studentToken}`;
      } else if (adminToken) {
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

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      // Check if we're on student portal (exact /student or /student/...)
      // BUT NOT /students (admin page)
      const isStudentArea = pathname === '/student' ||
        (pathname.startsWith('/student/') && !pathname.startsWith('/students'));
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
