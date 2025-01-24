import React from 'react';
import './MainView.css';
import CheatCard from '../components/CheatCard/CheatCard';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';

const MainView = () => {
  return (
    <div>
      <Particles />
      <nav className="cyber-nav">
        <div className="nav-brand">
          DDNet<span className="highlight">HvH</span>
        </div>
      </nav>

      <section id="home" className="section">
        <div className="section-content">
          <h1>Welcome to DDNet<span className="highlight">HvH</span></h1>
          <div className="cyber-line"></div>
          <p className="hero-text">
            The first and only HvH server network featuring 
            <span className="mode fng">FNG</span>, 
            <span className="mode dm">DM</span>, 
            <span className="mode kog">KoG</span>, and
            <span className="mode block">Block</span> modes.
            Experience the ultimate hacker versus hacker competition in DDNet.
          </p>
          <button className="cyber-button">Get Started</button>
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

      <section id="cheats" className="section">
        <div className="section-content">
          <h2>Available Cheats</h2>
          <div className="cyber-line"></div>
          <div className="cheats-grid">
            <CheatCard
              name="DD.CFF"
              versions={['Free']}
              description="The best free cheat available. Known for its stability and frequent updates. Community favorite."
              downloadUrl="https://discord.com/invite/4nUaaaaWt5"
            />
            
            <CheatCard
              name="KRX Client"
              versions={['Free', 'Premium', 'Ultimate']}
              description="The most sophisticated DDNet cheat featuring FentBot™, advanced prediction systems, and input sequence generators. Includes TAS capabilities, perfect for both casual and competitive play. Ultimate tier provides access to exclusive features."
              downloadUrl="https://krxclient.xyz/"
              isPremium
            />
            
            <CheatCard
              name="Sash Client"
              versions={['Free']}
              description="A reliable free alternative with essential features. Perfect for beginners in the HvH scene."
              downloadUrl="https://sash.mybin.ir/"
            />
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