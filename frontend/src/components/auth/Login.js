import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email мен құпия сөз қажет');
      return;
    }
    
    try {
      setLoading(true);
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Кіру кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">QamQor - Кіру</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
            />
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="password">Құпия сөз</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Құпия сөзіңізді енгізіңіз"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Жүктелуде...' : 'Кіру'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Тіркелмегенсіз бе? <Link to="/register" className="auth-link">Тіркелу</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 