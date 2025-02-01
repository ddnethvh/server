import React from 'react';
import './SettingsView.css';
import NavBar from '../components/NavBar/NavBar';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';

const SettingsView = () => {
  return (
    <div>
      <Particles />
      <NavBar />
      
      <section className="section settings-section">
        <div className="section-content">
          <h1>Settings</h1>
          <div className="cyber-line"></div>
          
          <div className="settings-container">
            <p>Settings page is under construction</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SettingsView; 