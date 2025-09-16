import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// User Components
import UserLayout from './components/layouts/UserLayout';
import MainPage from './components/user/MainPage';
import ChatPage from './components/user/ChatPage';
import ProfilePage from './components/user/ProfilePage';

// Admin Components
import AdminLayout from './components/layouts/AdminLayout';
import ContentPage from './components/admin/ContentPage';
import FeedbackPage from './components/admin/FeedbackPage';
import AdminProfilePage from './components/admin/ProfilePage';

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected routes
const UserRoute = ({ children }) => {
  const { isAuthenticated, loading, error } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Жүктелуде...</div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>QamQor</h2>
        <p>Telegram Mini App арқылы кіру керек</p>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>
    );
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading, error } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Жүктелуде...</div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={
          <UserRoute>
            <UserLayout />
          </UserRoute>
        }>
          <Route index element={<MainPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<ContentPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        
        {/* Redirect to main page for any unknown path */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
