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
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token and get current user info
          // Assuming /api/auth/me is a protected route that returns user info
          const response = await api.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
