import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProfileView.module.css';
import NavBar from '../components/NavBar/NavBar';
import Particles from '../components/Particles/Particles';
import Footer from '../components/Footer/Footer';
import { FiUser, FiCalendar, FiMonitor } from 'react-icons/fi';

const ProfileView = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile/${username}/stats`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setUserData(data.user);
        setLeaderboardData(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div>
        <Particles />
        <NavBar />
        <section className={`section ${styles['profile-section']}`}>
          <div className="section-content">
            <div className={styles['loading-container']}>
              <div className={styles['loading-spinner']}></div>
              <h2>Loading Profile...</h2>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Particles />
        <NavBar />
        <section className={`section ${styles['profile-section']}`}>
          <div className="section-content">
            <div className={styles['error-container']}>
              <h1>Error</h1>
              <div className="cyber-line"></div>
              <p className={styles['error-message']}>{error}</p>
              <button 
                className="cyber-button" 
                onClick={() => navigate('/')}
              >
                Return Home
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Particles />
      <NavBar />
      
      <section className={styles['profile-page-section']}>
        <div className={styles['profile-page-content']}>
          <div className={styles['profile-header']}>
            <div className={styles['profile-avatar']}>
              <FiUser />
            </div>
            <div className={styles['profile-titles']}>
              <h1>{userData.username}</h1>
              <div className={styles['profile-subtitle']}>
                <span><FiMonitor /> {userData.ign}</span>
                <span><FiCalendar /> Joined {new Date(userData.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className={styles['stats-grid']}>
            {Object.entries(leaderboardData).map(([mode, data]) => (
              <div key={mode} className={styles['stat-card']}>
                <div className={styles['stat-header']}>
                  <h3>{mode.toUpperCase()}</h3>
                  <div className={styles['stat-line']}></div>
                </div>
                {data ? (
                  <div className={styles['stat-content']}>
                    <div className={styles['stat-item']}>
                      <span className={styles['stat-label']}>Rank</span>
                      <span className={styles['stat-value']}>#{data.rank}</span>
                    </div>
                    <div className={styles['stat-item']}>
                      <span className={styles['stat-label']}>Points</span>
                      <span className={styles['stat-value']}>{data.points}</span>
                    </div>
                    {mode === 'kog' && (
                      <>
                        <div className={styles['stat-item']}>
                          <span className={styles['stat-label']}>Maps</span>
                          <span className={styles['stat-value']}>{data.mapsCompleted}</span>
                        </div>
                        <div className={styles['stat-item']}>
                          <span className={styles['stat-label']}>Total Finishes</span>
                          <span className={styles['stat-value']}>{data.totalFinishes}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles['no-data']}>
                    No data available
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileView;