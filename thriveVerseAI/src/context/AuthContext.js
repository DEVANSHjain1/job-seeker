import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    console.log('Checking authentication status...');
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No token found, clearing auth state');
        setUser(null);
        setLoading(false);
        return null;
      }

      // Set default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Making request to /api/auth/me');
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
      console.log('Auth check response:', response.data);
      
      if (response.data) {
        console.log('Setting user data');
        setUser(response.data);
        setLoading(false);
        return response.data;
      } else {
        console.log('No user data in response');
        throw new Error('No user data received');
      }
    } catch (error) {
      console.error('Auth check error:', error.response || error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    console.log('AuthProvider mounted, checking initial auth');
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 