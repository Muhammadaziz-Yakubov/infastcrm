import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('token');
    const studentToken = localStorage.getItem('studentToken');
    const studentData = localStorage.getItem('studentData');

    if (adminToken) {
      // Decode admin token to get user info
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role
        });
      } catch (e) {
        // If token decode fails, try to get user from API
        fetchUser();
        return;
      }
    }

    if (studentToken && studentData) {
      // Set student data from localStorage
      try {
        const studentInfo = JSON.parse(studentData);
        setStudent(studentInfo);
      } catch (e) {
        // If parsing fails, clear student data
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
      }
    }

    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Token not received from server' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Kirish amalga oshmadi' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const studentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    setStudent(null);
  };

  const studentLogin = (token, studentData) => {
    localStorage.setItem('studentToken', token);
    localStorage.setItem('studentData', JSON.stringify(studentData));
    setStudent(studentData);
  };

  return (
    <AuthContext.Provider value={{ user, student, login, studentLogin, logout, studentLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
