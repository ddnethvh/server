import React from 'react';
import './MainView.css';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';
import NavBar from '../components/NavBar/NavBar';
import GameMode from '../components/GameMode/GameMode';
import { useNavigate } from 'react-router-dom';

const MainView = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Particles />
      <NavBar />

      <section id="home" className="section">
        <div className="section-content">
          <h1>Welcome to DDNet<span className="highlight">HvH</span></h1>
          <div className="cyber-line"></div>
          <p className="hero-text">
            The first and only HvH server network featuring 
            <GameMode mode="FNG" />, 
            <GameMode mode="DM" />, 
            <GameMode mode="KoG" />, and
            <GameMode mode="Block" /> modes.
            Experience the ultimate hacker versus hacker competition in DDNet.
          </p>
          <button className="cyber-button" onClick={() => navigate('/cheats')}>Get Started</button>
        </div>
      </section>

      <section id="servers" className="section">
        <div className="section-content">
          <h2>Our Servers</h2>
          <div className="cyber-line"></div>
          <div className="stats-container">
            <div className="stat-box">
              <span className="stat-number">0</span>
              <span className="stat-label">Active Servers</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">0</span>
              <span className="stat-label">Players Online</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">0</span>
              <span className="stat-label">Custom Maps</span>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section">
        <div className="section-content">
          <h2>Project Team</h2>
          <div className="cyber-line"></div>
          <div className="community-links">
            <div className="community-card">
              <i className="fas fa-code"></i>
              <span className="team-role">Project Founder</span>
              <span className="team-name">scar17off</span>
            </div>
            <div className="community-card">
              <i className="fas fa-server"></i>
              <span className="team-role">Server Host</span>
              <span className="team-name">Hexose</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MainView; 