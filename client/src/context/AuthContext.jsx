import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('token');
    const studentToken = localStorage.getItem('studentToken');
    const studentData = localStorage.getItem('studentData');

    const initializeAuth = async () => {
      try {
        // Handle admin authentication
        if (adminToken) {
          try {
            const payload = JSON.parse(atob(adminToken.split('.')[1]));
            setUser({
              id: payload.userId,
              email: payload.email,
              role: payload.role
            });
          } catch (e) {
            // Token is invalid, clear it
            localStorage.removeItem('token');
          }
        }

        // Handle student authentication
        if (studentToken && studentData) {
          try {
            const studentInfo = JSON.parse(studentData);
            setStudent(studentInfo);
          } catch (e) {
            // Clear corrupted data
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentData');
          }
        } else if (studentToken) {
          // Fetch student data from API only if not cached
          try {
            const response = await api.get('/student-auth/profile');
            setStudent(response.data);
            localStorage.setItem('studentData', JSON.stringify(response.data));
          } catch (error) {
            // Clear invalid token
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentData');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    // Initialize auth immediately
    initializeAuth();
=======
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
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
    setLoading(false);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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

<<<<<<< HEAD
  const studentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    setStudent(null);
  };

  const studentLogin = (token, studentData) => {
    try {
      // Clear any existing data first
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');

      // Save new data
      localStorage.setItem('studentToken', token);
      localStorage.setItem('studentData', JSON.stringify(studentData));

      // Update context state
      setStudent(studentData);
    } catch (error) {
      console.error('Error saving student data:', error);
      // Clear any corrupted data
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      setStudent(null);
    }
  };

  const contextValue = {
    user,
    student,
    login,
    studentLogin,
    logout,
    studentLogout,
    loading
  };


  return (
    <AuthContext.Provider value={contextValue}>
=======
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
<<<<<<< HEAD
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
=======
  return useContext(AuthContext);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
}
