import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundView.css';
import NavBar from '../components/NavBar/NavBar';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';

const NotFoundView = () => {
  return (
    <div>
      <Particles />
      <NavBar />
      
      <section className="section not-found-section">
        <div className="section-content">
          <h1>404</h1>
          <div className="cyber-line"></div>
          <p className="not-found-text">Page not found</p>
          <Link to="/" className="cyber-button">
            Return Home
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFoundView; 