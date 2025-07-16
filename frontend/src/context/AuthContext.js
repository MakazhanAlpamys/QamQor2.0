import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set token in axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user data
          const response = await axios.get(`${API_URL}/profile`);
          setUser(response.data);
        } catch (err) {
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      // Save token and set headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Тіркелу кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Save token and set headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Кіру кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/profile`, userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Профильді жаңарту кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 