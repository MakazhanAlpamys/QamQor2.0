import { Outlet, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaEdit, FaComments, FaUser } from 'react-icons/fa';
import '../../styles/Layout.css';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('/admin');
  
  useEffect(() => {
    // Get current path
    const path = window.location.pathname;
    setActiveTab(path);
  }, []);
  
  const handleNavClick = (path) => {
    setActiveTab(path);
  };
  
  return (
    <div className="layout-container">
      <div className="admin-header">
        <h1>QamQor Админ</h1>
      </div>
      
      <div className="content-container">
        <Outlet />
      </div>
      
      <nav className="bottom-nav">
        <NavLink
          to="/admin"
          className={`nav-item ${activeTab === '/admin' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin')}
          end
        >
          <FaEdit className="nav-icon" />
          <span>Контент</span>
        </NavLink>
        
        <NavLink
          to="/admin/feedback"
          className={`nav-item ${activeTab === '/admin/feedback' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin/feedback')}
        >
          <FaComments className="nav-icon" />
          <span>Кері байланыс</span>
        </NavLink>
        
        <NavLink
          to="/admin/profile"
          className={`nav-item ${activeTab === '/admin/profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin/profile')}
        >
          <FaUser className="nav-icon" />
          <span>Профиль</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminLayout; 