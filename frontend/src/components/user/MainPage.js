import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/MainPage.css';
// Импортируем логотипы
import logo from '../../img/logo.jpg';
import logo2 from '../../img/logo2.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MainPage = () => {
  const [quote, setQuote] = useState('');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', message: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Fetch quote and tip in parallel
        const [quoteResponse, tipResponse] = await Promise.all([
          axios.get(`${API_URL}/main/quote`),
          axios.get(`${API_URL}/main/tip`)
        ]);
        
        setQuote(quoteResponse.data.text);
        setTip(tipResponse.data.text);
        setError('');
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Мазмұнды жүктеу кезінде қате орын алды');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);
  
  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackForm.name || !feedbackForm.message) {
      setFeedbackError('Барлық өрістерді толтырыңыз');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/feedback`, feedbackForm);
      setFeedbackSubmitted(true);
      setFeedbackError('');
      
      // Reset form after successful submission
      setFeedbackForm({ name: '', message: '' });
      
      // Reset submission status after 3 seconds
      setTimeout(() => {
        setFeedbackSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbackError('Кері байланысты жіберу кезінде қате орын алды');
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Жүктелуде...</p>
      </div>
    );
  }
  
  return (
    <div className="main-page">
      <div className="page-header">
        <div className="logo-container">
          <img src={logo} alt="QamQor Logo" className="main-logo" />
          <h1>QamQor</h1>
          <img src={logo2} alt="Assyl AI Logo" className="main-logo" />
        </div>
        <p>Сіздің қаржылық көмекшіңіз</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="content-section">
        <div className="quote-card">
          <h2>Күн сөзі</h2>
          <blockquote>{quote || 'Цитата жүктелмеді'}</blockquote>
        </div>
        
        <div className="tip-card">
          <h2>Күн кеңесі</h2>
          <p>{tip || 'Кеңес жүктелмеді'}</p>
        </div>
        
        <div className="safety-card">
          <h2>Қаржылық қауіпсіздік</h2>
          <ul className="safety-list">
            <li>Банк қызметкерлері ешқашан сіздің құпия сөзіңізді сұрамайды.</li>
            <li>Күмәнді сілтемелерге ешқашан шертпеңіз.</li>
            <li>Телефон арқылы банктік деректерді ешқашан айтпаңыз.</li>
            <li>3D Secure қызметін әрқашан қосып қойыңыз.</li>
          </ul>
        </div>
        
        <Link to="/chat" className="chat-button">
          <span>Бастау QamQor чатымен</span>
          <FaArrowRight />
        </Link>
        
        <div className="feedback-section">
          <h2>Кері байланыс</h2>
          {feedbackSubmitted ? (
            <div className="feedback-success">
              Кері байланысыңыз үшін рахмет!
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              {feedbackError && (
                <div className="feedback-error">{feedbackError}</div>
              )}
              
              <div className="form-group">
                <label htmlFor="name">Аты-жөні</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={feedbackForm.name}
                  onChange={handleFeedbackChange}
                  placeholder="Аты-жөніңізді енгізіңіз"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Хабарлама</label>
                <textarea
                  id="message"
                  name="message"
                  value={feedbackForm.message}
                  onChange={handleFeedbackChange}
                  placeholder="Хабарламаңызды енгізіңіз"
                  rows="4"
                ></textarea>
              </div>
              
              <button type="submit" className="feedback-button">
                Жіберу
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage; 