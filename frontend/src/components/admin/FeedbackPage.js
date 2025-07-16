import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import '../../styles/AdminPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FeedbackPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async (search = '') => {
    try {
      setLoading(true);
      
      const endpoint = search 
        ? `${API_URL}/admin/messages?search=${encodeURIComponent(search)}` 
        : `${API_URL}/admin/messages`;
      
      const response = await axios.get(endpoint);
      
      setMessages(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Хабарламаларды жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchMessages(searchTerm);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('kk-KZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading && messages.length === 0) {
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
        <h1>Кері байланыс</h1>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Аты немесе хабарлама мәтіні бойынша іздеу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </div>
      </form>
      
      <div className="feedback-list">
        {messages.length > 0 ? (
          messages.map(message => (
            <div key={message.id} className="feedback-item">
              <div className="feedback-header">
                <div className="feedback-name">{message.name}</div>
                <div className="feedback-date">{formatDate(message.created_at)}</div>
              </div>
              <div className="feedback-message">{message.message}</div>
            </div>
          ))
        ) : (
          <div className="no-items">
            {searchTerm ? 'Іздеу нәтижесінде хабарламалар табылмады' : 'Кері байланыс хабарламалары жоқ'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage; 