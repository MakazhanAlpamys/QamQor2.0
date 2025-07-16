import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import '../../styles/AdminPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [tips, setTips] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [newTip, setNewTip] = useState('');
  const [editingQuote, setEditingQuote] = useState(null);
  const [editingTip, setEditingTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      
      const [quotesResponse, tipsResponse] = await Promise.all([
        axios.get(`${API_URL}/admin/content/quotes`),
        axios.get(`${API_URL}/admin/content/tips`)
      ]);
      
      setQuotes(quotesResponse.data);
      setTips(tipsResponse.data);
      setError('');
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Мазмұнды жүктеу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddQuote = async (e) => {
    e.preventDefault();
    
    if (!newQuote.trim()) {
      setError('Цитата мәтінін енгізіңіз');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/admin/content/quotes`, { text: newQuote });
      
      setQuotes([response.data, ...quotes]);
      setNewQuote('');
      setSuccess('Жаңа цитата сәтті қосылды');
      clearMessages();
    } catch (err) {
      console.error('Error adding quote:', err);
      setError('Цитата қосу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTip = async (e) => {
    e.preventDefault();
    
    if (!newTip.trim()) {
      setError('Кеңес мәтінін енгізіңіз');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/admin/content/tips`, { text: newTip });
      
      setTips([response.data, ...tips]);
      setNewTip('');
      setSuccess('Жаңа кеңес сәтті қосылды');
      clearMessages();
    } catch (err) {
      console.error('Error adding tip:', err);
      setError('Кеңес қосу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleQuoteStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/admin/content/quotes/${id}`, { active: !currentStatus });
      
      setQuotes(quotes.map(q => q.id === id ? response.data : q));
      setSuccess('Цитата статусы сәтті өзгертілді');
      clearMessages();
    } catch (err) {
      console.error('Error updating quote status:', err);
      setError('Цитата статусын өзгерту кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleTipStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/admin/content/tips/${id}`, { active: !currentStatus });
      
      setTips(tips.map(t => t.id === id ? response.data : t));
      setSuccess('Кеңес статусы сәтті өзгертілді');
      clearMessages();
    } catch (err) {
      console.error('Error updating tip status:', err);
      setError('Кеңес статусын өзгерту кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const startEditQuote = (quote) => {
    setEditingQuote({ id: quote.id, text: quote.text });
    setEditingTip(null);
  };
  
  const startEditTip = (tip) => {
    setEditingTip({ id: tip.id, text: tip.text });
    setEditingQuote(null);
  };
  
  const cancelEdit = () => {
    setEditingQuote(null);
    setEditingTip(null);
  };
  
  const handleSaveQuote = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/admin/content/quotes/${editingQuote.id}`, { text: editingQuote.text });
      
      setQuotes(quotes.map(q => q.id === editingQuote.id ? response.data : q));
      setEditingQuote(null);
      setSuccess('Цитата сәтті жаңартылды');
      clearMessages();
    } catch (err) {
      console.error('Error saving quote:', err);
      setError('Цитата сақтау кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveTip = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/admin/content/tips/${editingTip.id}`, { text: editingTip.text });
      
      setTips(tips.map(t => t.id === editingTip.id ? response.data : t));
      setEditingTip(null);
      setSuccess('Кеңес сәтті жаңартылды');
      clearMessages();
    } catch (err) {
      console.error('Error saving tip:', err);
      setError('Кеңес сақтау кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const clearMessages = () => {
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };
  
  if (loading && (quotes.length === 0 && tips.length === 0)) {
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
        <h1>Мазмұнды басқару</h1>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'quotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          Күн сөздері
        </div>
        <div 
          className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          Күн кеңестері
        </div>
      </div>
      
      <div className="content-container">
        {activeTab === 'quotes' ? (
          <>
            <form className="add-form" onSubmit={handleAddQuote}>
              <input
                type="text"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                placeholder="Жаңа цитата енгізіңіз..."
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!newQuote.trim() || loading}
              >
                <FaPlus /> Қосу
              </button>
            </form>
            
            <div className="items-list">
              {quotes.map(quote => (
                <div key={quote.id} className={`content-item ${!quote.active ? 'inactive' : ''}`}>
                  {editingQuote && editingQuote.id === quote.id ? (
                    <div className="edit-container">
                      <textarea
                        value={editingQuote.text}
                        onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                        rows="3"
                      />
                      <div className="edit-actions">
                        <button onClick={cancelEdit} className="cancel-button" disabled={loading}>
                          <FaTimes /> Бас тарту
                        </button>
                        <button onClick={handleSaveQuote} className="save-button" disabled={loading || !editingQuote.text.trim()}>
                          <FaCheck /> Сақтау
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-text">{quote.text}</div>
                      <div className="item-actions">
                        <button onClick={() => startEditQuote(quote)} title="Өңдеу">
                          <FaPencilAlt />
                        </button>
                        <button 
                          onClick={() => handleToggleQuoteStatus(quote.id, quote.active)} 
                          title={quote.active ? 'Жасыру' : 'Көрсету'}
                          className={quote.active ? 'status-active' : 'status-inactive'}
                        >
                          {quote.active ? <FaCheck /> : <FaTimes />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {quotes.length === 0 && !loading && (
                <div className="no-items">Цитаталар жоқ</div>
              )}
            </div>
          </>
        ) : (
          <>
            <form className="add-form" onSubmit={handleAddTip}>
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Жаңа кеңес енгізіңіз..."
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!newTip.trim() || loading}
              >
                <FaPlus /> Қосу
              </button>
            </form>
            
            <div className="items-list">
              {tips.map(tip => (
                <div key={tip.id} className={`content-item ${!tip.active ? 'inactive' : ''}`}>
                  {editingTip && editingTip.id === tip.id ? (
                    <div className="edit-container">
                      <textarea
                        value={editingTip.text}
                        onChange={(e) => setEditingTip({ ...editingTip, text: e.target.value })}
                        rows="3"
                      />
                      <div className="edit-actions">
                        <button onClick={cancelEdit} className="cancel-button" disabled={loading}>
                          <FaTimes /> Бас тарту
                        </button>
                        <button onClick={handleSaveTip} className="save-button" disabled={loading || !editingTip.text.trim()}>
                          <FaCheck /> Сақтау
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-text">{tip.text}</div>
                      <div className="item-actions">
                        <button onClick={() => startEditTip(tip)} title="Өңдеу">
                          <FaPencilAlt />
                        </button>
                        <button 
                          onClick={() => handleToggleTipStatus(tip.id, tip.active)} 
                          title={tip.active ? 'Жасыру' : 'Көрсету'}
                          className={tip.active ? 'status-active' : 'status-inactive'}
                        >
                          {tip.active ? <FaCheck /> : <FaTimes />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {tips.length === 0 && !loading && (
                <div className="no-items">Кеңестер жоқ</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentPage; 