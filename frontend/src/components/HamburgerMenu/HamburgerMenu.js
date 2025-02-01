import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const rankItems = [
    { path: '/leaderboard/fng', label: 'FNG' },
    { path: '/leaderboard/block', label: 'Block' },
    { path: '/leaderboard/dm', label: 'DM' },
    { path: '/leaderboard/kog', label: 'KoG' }
  ];

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    setIsOpen(false);
    navigate('/auth');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-container">
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={toggleMenu}></div>
      
      <div className={`menu-content ${isOpen ? 'open' : ''}`}>
        <div className="profile-section">
          <div className="profile-icon">
            <FiUser />
          </div>
          <div className="profile-info">
            {loading ? (
              <span className="profile-name">Loading...</span>
            ) : user ? (
              <>
                <span className="profile-name">{user.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="profile-icon-button sign-out"
                  aria-label="Sign out"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <span className="profile-name">Guest</span>
                <button 
                  onClick={handleSignIn}
                  className="profile-icon-button sign-in"
                  aria-label="Sign in"
                >
                  <FiLogIn />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="menu-sections-container">
          {isAuthenticated() && (
            <div className="menu-section">
              <h3>Profile</h3>
              <Link to="/profile" className="menu-item" onClick={toggleMenu}>
                My Profile
              </Link>
              <Link to="/settings" className="menu-item" onClick={toggleMenu}>
                Settings
              </Link>
            </div>
          )}

          <div className="menu-section">
            <h3>Ranks</h3>
            {rankItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="menu-item"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="menu-section">
            <h3>Pages</h3>
            <Link to="/cheats" className="menu-item" onClick={toggleMenu}>
              Cheats
            </Link>
            <Link to="/developer" className="menu-item" onClick={toggleMenu}>
              Developer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu; 