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

    // Trim values
    const trimmedUsername = formData.username.trim();
    const trimmedIgn = formData.ign.trim();

    // Basic validation
    if (!trimmedUsername || !formData.password || (!isLogin && !trimmedIgn)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Length validation
    if (trimmedUsername.length === 0) {
      setError('Username cannot be empty');
      setLoading(false);
      return;
    }

    if (trimmedUsername.length > 16) {
      setError('Username must not exceed 16 characters');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (trimmedIgn.length === 0) {
        setError('In-game name cannot be empty');
        setLoading(false);
        return;
      }

      if (trimmedIgn.length > 16) {
        setError('In-game name must not exceed 16 characters');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: formData.password,
          ign: trimmedIgn
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