import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="cyber-footer">
      <div className="footer-content">
        <div className="cyber-line"></div>
        <div className="social-links">
          <a 
            href="https://t.me/ddnethvh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
          >
            <i className="fab fa-telegram"></i>
            <span>Join our Telegram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 