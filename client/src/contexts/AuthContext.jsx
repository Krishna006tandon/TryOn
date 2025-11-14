import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          // Verify token and get current user info
          const response = await api.get('/api/admin/me');
          setUser(response.data);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('adminToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/admin/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('adminToken', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
