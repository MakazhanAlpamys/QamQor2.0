import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

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
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Жүктелуде...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Жүктелуде...</div>;
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : 
          (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
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
        
        {/* Redirect to login for any unknown path */}
        <Route path="*" element={<Navigate to="/login" />} />
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
