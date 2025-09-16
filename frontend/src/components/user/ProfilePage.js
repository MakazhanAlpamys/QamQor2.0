import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaTelegram, FaEdit, FaSave, FaTimes, FaUserTag } from 'react-icons/fa';
import '../../styles/ProfilePage.css';
// Импортируем логотипы
import logo from '../../img/logo.jpg';
import logo2 from '../../img/logo2.png';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);
  
  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name || '');
    setError('');
    setSuccess('');
  };
  
  const handleSave = async () => {
    if (!name.trim()) {
      setError('Атыңызды енгізіңіз');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await updateProfile({ name: name.trim() });
      setSuccess('Профиль сәтті жаңартылды');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Профиль жаңарту қатесі');
    } finally {
      setLoading(false);
    }
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
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <h1>Профиль</h1>
        <p className="profile-subtitle">Telegram арқылы кірген</p>
      </div>
      
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}
      
      <div className="profile-card">
        {isEditing ? (
          <div className="edit-section">
            <div className="form-group">
              <label htmlFor="name">Аты-жөні</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Аты-жөніңізді енгізіңіз"
              />
            </div>
            
            <div className="edit-buttons">
              <button 
                className="save-button" 
                onClick={handleSave}
                disabled={loading}
              >
                <FaSave />
                {loading ? 'Сақталуда...' : 'Сақтау'}
              </button>
              <button 
                className="cancel-button" 
                onClick={handleCancel}
                disabled={loading}
              >
                <FaTimes />
                Бас тарту
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <div className="info-header">
                <FaUser className="info-icon" />
                <span className="info-label">Аты-жөні:</span>
              </div>
              <div className="info-content">
                <span className="info-value">{user.name}</span>
                <button className="edit-button" onClick={handleEdit}>
                  <FaEdit />
                  Өзгерту
                </button>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-header">
                <FaTelegram className="info-icon" />
                <span className="info-label">Telegram аккаунты:</span>
              </div>
              <span className="info-value">@{user.username || 'Жоқ'}</span>
            </div>
            
            <div className="info-item">
              <div className="info-header">
                <FaUserTag className="info-icon" />
                <span className="info-label">Telegram ID:</span>
              </div>
              <span className="info-value">{user.telegram_id}</span>
            </div>
            
            <div className="info-item">
              <div className="info-header">
                <span className="info-label">Роль:</span>
              </div>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'admin' ? 'Администратор' : 'Пайдаланушы'}
              </span>
            </div>
            
            <div className="info-item">
              <div className="info-header">
                <span className="info-label">Тіркелген күні:</span>
              </div>
              <span className="info-value">
                {new Date(user.created_at).toLocaleDateString('kk-KZ')}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-info-card">
        <div className="info-card">
          <FaTelegram className="telegram-icon" />
          <div className="info-content">
            <h3>Telegram Mini App</h3>
            <p>Сіз Telegram арқылы кірдіңіз. Деректеріңіз қауіпсіз сақталуда.</p>
          </div>
        </div>
      </div>
      
      <div className="logos-container">
        <div className="logo-box">
          <img src={logo} alt="QamQor Logo" className="profile-logo" />
          <img src={logo2} alt="Assyl AI Logo" className="profile-logo" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;