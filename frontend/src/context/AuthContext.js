import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in or try Telegram auth
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // First check for existing token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/profile`);
          setUser(response.data);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      // Try Telegram Web App authentication
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        
        // Expand the app to full height
        tg.expand();
        
        if (tg.initDataUnsafe?.user) {
          try {
            await loginWithTelegram(tg.initDataUnsafe);
          } catch (err) {
            console.error('Telegram auth failed:', err);
            setError('Telegram арқылы кіру сәтсіз аяқталды');
          }
        } else {
          setError('Telegram деректері табылмады');
        }
      } else {
        // For development - create a mock user
        console.warn('Telegram WebApp not available, using demo mode');
        await createDemoUser();
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Login with Telegram
  const loginWithTelegram = async (initData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/telegram`, { initData });
      const { token, user } = response.data;
      
      // Save token and set headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Telegram арқылы кіру кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Create demo user for development
  const createDemoUser = async () => {
    try {
      const demoInitData = {
        user: {
          id: 123456789,
          first_name: 'Demo',
          last_name: 'User',
          username: 'demo_user'
        }
      };
      
      await loginWithTelegram(demoInitData);
    } catch (err) {
      console.error('Demo user creation failed:', err);
      setError('Demo режиміндегі қателік');
    }
  };
  
  // Logout user (only clears local data, Telegram session remains)
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
    loginWithTelegram,
    createDemoUser,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 