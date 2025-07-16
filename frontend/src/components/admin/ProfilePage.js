import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/AdminPage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('kk-KZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Жүктелуде...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-page">
      <div className="page-title">
        <h1>Админ профилі</h1>
      </div>
      
      <div className="admin-card">
        <div className="admin-profile-header">
          <div className="admin-avatar">
            <FaUser />
          </div>
          <h2>Әкімші</h2>
        </div>
        
        <div className="admin-info">
          <div className="info-item">
            <span className="info-label">Аты-жөні:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Рөлі:</span>
            <span className="info-value admin-role">Админ</span>
          </div>
          <div className="info-item">
            <span className="info-label">Тіркелген күні:</span>
            <span className="info-value">{formatDate(user.created_at)}</span>
          </div>
        </div>
      </div>
      
      <button 
        className="admin-logout-button"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Жүйеден шығу</span>
      </button>
    </div>
  );
};

export default ProfilePage; 