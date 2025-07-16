import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import '../../styles/ChatPage.css';
// Импортируем логотипы
import logo from '../../img/logo.jpg';
import logo2 from '../../img/logo2.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Сәлеметсіз бе! Мен QamQor қаржылық көмекшісімін. Қаржы саласына қатысты сұрақтарыңызды қоюға болады.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/chat`, { message: newMessage });
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Сұрағыңызға жауап беру кезінде қате орын алды');
      
      // Add error message to chat
      if (err.response?.data?.message) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: `Қате: ${err.response.data.message}`,
            sender: 'error',
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-logo-container">
          <img src={logo} alt="QamQor Logo" className="chat-logo" />
          <h1>QamQor Чат</h1>
          <img src={logo2} alt="Assyl AI Logo" className="chat-logo" />
        </div>
        <p>Қаржы саласына қатысты сұрақ қойыңыз</p>
      </div>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot-message">
              <div className="message-content loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <div className="error-message">{error}</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Хабарламаңызды енгізіңіз..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className={loading ? 'sending' : ''}
            disabled={loading || !newMessage.trim()}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage; 