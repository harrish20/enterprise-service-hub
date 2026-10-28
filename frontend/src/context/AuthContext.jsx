import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tarq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tarq_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, role = 'Admin') => {
    setLoading(true);
    try {
      const res = await api.login(email, role);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('tarq_user', JSON.stringify(res.user));
        localStorage.setItem('tarq_token', res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tarq_user');
    localStorage.removeItem('tarq_token');
  };

  const switchRole = async (newRole) => {
    return login(null, newRole);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

