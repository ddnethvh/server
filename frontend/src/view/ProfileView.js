import React from 'react';
import styles from './ProfileView.module.css';
import NavBar from '../components/NavBar/NavBar';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';

const ProfileView = () => {
  return (
    <div>
      <Particles />
      <NavBar />
      
      <section className={`section ${styles['profile-section']}`}>
        <div className="section-content">
          <h1>Profile</h1>
          <div className="cyber-line"></div>
          
          <div className={styles['profile-container']}>
            <p>Profile page is under construction</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileView;