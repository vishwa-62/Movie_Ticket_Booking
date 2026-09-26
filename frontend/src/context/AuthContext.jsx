import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cinepass_user');
    const storedToken = localStorage.getItem('cinepass_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('cinepass_user');
        localStorage.removeItem('cinepass_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem('cinepass_token', token);
        localStorage.setItem('cinepass_user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token, user: newUser } = res.data;
        localStorage.setItem('cinepass_token', token);
        localStorage.setItem('cinepass_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('cinepass_token');
    localStorage.removeItem('cinepass_user');
    setUser(null);
  };

  const updateUserProfile = (updatedData) => {
    const newObj = { ...user, ...updatedData };
    setUser(newObj);
    localStorage.setItem('cinepass_user', JSON.stringify(newObj));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
