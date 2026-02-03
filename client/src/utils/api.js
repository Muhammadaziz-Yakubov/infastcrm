import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/' : 'https://infastcrm-0b2r.onrender.com/api/');
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 503 errors (maintenance mode)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 503) {
      const isMaintenance = error.response.data?.maintenance;

      if (isMaintenance) {
        // Show maintenance message
        const message = error.response.data?.message || 'Texnik ishlar olib borilmoqda';

        // Store maintenance state
        localStorage.setItem('maintenance_mode', 'true');
        localStorage.setItem('maintenance_message', message);

        // Redirect to maintenance page or show message
        if (!window.location.pathname.includes('/maintenance') && !window.location.pathname.includes('/login')) {
          window.location.href = '/maintenance';
        }
      }
    }

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
      }    }
    return Promise.reject(error);
  }
);

export default api;
<<<<<<< HEAD
=======

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
