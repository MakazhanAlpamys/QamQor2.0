import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  
  const validatePassword = () => {
    if (password.length < 8) {
      return 'Құпия сөз кемінде 8 таңбадан тұруы керек';
    }
    
    // Check for at least one digit
    if (!/\d/.test(password)) {
      return 'Құпия сөзде кемінде бір сан болуы керек';
    }
    
    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return 'Құпия сөзде кемінде бір әріп болуы керек';
    }
    
    // Check passwords match
    if (password !== confirmPassword) {
      return 'Құпия сөздер сәйкес емес';
    }
    
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError('Барлық өрістер толтырылуы керек');
      return;
    }
    
    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    try {
      setLoading(true);
      await register({ name, email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Тіркелу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">QamQor - Тіркелу</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Аты-жөні</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleChange}
              placeholder="Аты-жөніңізді енгізіңіз"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Құпия сөзіңізді енгізіңіз"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <small className="password-hint">
              Құпия сөз кемінде 8 таңбадан тұруы керек, кемінде бір сан және бір әріп болуы керек
            </small>
          </div>
          
          <div className="form-group password-group">
            <label htmlFor="confirmPassword">Құпия сөзді растау</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Құпия сөзді қайталаңыз"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Жүктелуде...' : 'Тіркелу'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Тіркелгіңіз бар ма? <Link to="/login" className="auth-link">Кіру</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 