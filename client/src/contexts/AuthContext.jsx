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
          // Try to verify as regular user first
          try {
            const response = await api.get('/auth/me');
            setUser(response.data);
          } catch (userError) {
            // If regular user check fails, try admin endpoint
            try {
              const adminResponse = await api.get('/admin/me');
              setUser(adminResponse.data);
            } catch (adminError) {
              // Both failed, token is invalid
              throw adminError;
            }
          }
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
