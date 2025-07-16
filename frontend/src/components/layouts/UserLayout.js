import { Outlet, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHome, FaComments, FaUser } from 'react-icons/fa';
import '../../styles/Layout.css';

const UserLayout = () => {
  const [activeTab, setActiveTab] = useState('/');
  
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
      <div className="content-container">
        <Outlet />
      </div>
      
      <nav className="bottom-nav">
        <NavLink
          to="/"
          className={`nav-item ${activeTab === '/' ? 'active' : ''}`}
          onClick={() => handleNavClick('/')}
        >
          <FaHome className="nav-icon" />
          <span>Басты бет</span>
        </NavLink>
        
        <NavLink
          to="/chat"
          className={`nav-item ${activeTab === '/chat' ? 'active' : ''}`}
          onClick={() => handleNavClick('/chat')}
        >
          <FaComments className="nav-icon" />
          <span>Чат</span>
        </NavLink>
        
        <NavLink
          to="/profile"
          className={`nav-item ${activeTab === '/profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('/profile')}
        >
          <FaUser className="nav-icon" />
          <span>Профиль</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default UserLayout; 