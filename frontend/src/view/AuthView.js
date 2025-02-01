import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthView.css';
import NavBar from '../components/NavBar/NavBar';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';

const AuthView = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    ign: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username || !formData.password || (!isLogin && !formData.ign)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          ign: formData.ign
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  return (
    <div>
      <Particles />
      <NavBar />
      
      <section className="section auth-section">
        <div className="auth-container">
          <div className="auth-box">
            <h2>{isLogin ? 'Sign In' : 'Register'}</h2>
            <div className="cyber-line"></div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="cyber-input"
                  disabled={loading}
                />
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="ign"
                    placeholder="In-game Name"
                    value={formData.ign}
                    onChange={handleInputChange}
                    className="cyber-input"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="cyber-input"
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="cyber-input"
                    disabled={loading}
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="cyber-button auth-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                className="switch-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    ign: ''
                  });
                }}
                disabled={loading}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuthView; 